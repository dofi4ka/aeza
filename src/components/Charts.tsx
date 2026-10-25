import { useId } from 'react'

// Графики нового поколения: красивые, бессмысленные, на чистом SVG.

type Pt = [number, number]

function toPath(pts: Pt[]) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
}

function scale(data: number[], w: number, h: number, pad = 4, min?: number, max?: number): Pt[] {
  const lo = min ?? Math.min(...data)
  const hi = max ?? Math.max(...data)
  const span = hi - lo || 1
  return data.map((v, i) => [pad + (i / Math.max(1, data.length - 1)) * (w - pad * 2), h - pad - ((v - lo) / span) * (h - pad * 2)])
}

export function Sparkline({ data, color = 'var(--green)', height = 40, min, max }: { data: number[]; color?: string; height?: number; min?: number; max?: number }) {
  const id = useId().replace(/:/g, '')
  const w = 200
  const pts = scale(data, w, height, 2, min, max)
  const area = `${toPath(pts)} L${w - 2},${height} L2,${height} Z`
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g${id})`} />
      <path d={toPath(pts)} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function LineChart({
  series,
  labels,
  height = 200,
  min,
  max,
}: {
  series: { name: string; data: number[]; color: string }[]
  labels?: string[]
  height?: number
  min?: number
  max?: number
}) {
  const w = 600
  const all = series.flatMap((s) => s.data)
  const lo = min ?? Math.min(...all)
  const hi = max ?? Math.max(...all)
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="chart-svg">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={w} y1={height * f} y2={height * f} className="grid-line" />
        ))}
        {series.map((s) => {
          const pts = scale(s.data, w, height, 8, lo, hi)
          return (
            <g key={s.name}>
              <path d={toPath(pts)} fill="none" stroke={s.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" className="line-glow" style={{ color: s.color }} />
            </g>
          )
        })}
      </svg>
      {labels && (
        <div className="chart-x">
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}
      <div className="legend">
        {series.map((s) => (
          <span key={s.name}>
            <i style={{ background: s.color }} /> {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export function BarChart({ data, color = 'var(--accent)', height = 180, suffix = '' }: { data: { label: string; value: number }[]; color?: string; height?: number; suffix?: string }) {
  const hi = Math.max(...data.map((d) => d.value)) || 1
  return (
    <div className="bars" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="bar-col" title={`${d.label}: ${d.value}${suffix}`}>
          <span className="bar-val">
            {Math.round(d.value)}
            {suffix}
          </span>
          <div className="bar" style={{ height: `${(d.value / hi) * 100}%`, background: color }} />
          <span className="bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export function PieChart({ data, size = 180, donut = true }: { data: { label: string; value: number; color: string }[]; size?: number; donut?: boolean }) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1
  const r = 50
  let acc = 0
  return (
    <div className="pie-wrap">
      <svg viewBox="-60 -60 120 120" width={size} height={size} className="pie">
        {data.map((d) => {
          const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2
          acc += d.value
          const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2
          const large = a1 - a0 > Math.PI ? 1 : 0
          const p = `M0,0 L${r * Math.cos(a0)},${r * Math.sin(a0)} A${r},${r} 0 ${large} 1 ${r * Math.cos(a1)},${r * Math.sin(a1)} Z`
          return <path key={d.label} d={p} fill={d.color} stroke="var(--bg)" strokeWidth="1.5" />
        })}
        {donut && <circle r="28" fill="var(--bg)" />}
        {donut && (
          <text y="4" textAnchor="middle" className="pie-center">
            100%
          </text>
        )}
      </svg>
      <div className="legend legend-col">
        {data.map((d) => (
          <span key={d.label}>
            <i style={{ background: d.color }} /> {d.label} — {((d.value / total) * 100).toFixed(1)}%
          </span>
        ))}
      </div>
    </div>
  )
}

export function Gauge({ value, max = 100, label }: { value: number; max?: number; label: string }) {
  const f = Math.min(1.35, value / max)
  const a = Math.PI * (1 - Math.min(1, f))
  const x = 50 + 40 * Math.cos(a)
  const y = 55 - 40 * Math.sin(a)
  return (
    <div className="gauge">
      <svg viewBox="0 0 100 62">
        <path d="M10,55 A40,40 0 0 1 90,55" fill="none" stroke="var(--card-2)" strokeWidth="9" strokeLinecap="round" />
        <path d={`M10,55 A40,40 0 0 1 ${x},${y}`} fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" className="line-glow" style={{ color: 'var(--accent)' }} />
        <text x="50" y="50" textAnchor="middle" className="gauge-val">
          {Math.round(value)}%
        </text>
      </svg>
      <div className="gauge-label">{label}</div>
    </div>
  )
}

export function Radar({ axes, values, color = 'var(--accent)' }: { axes: string[]; values: number[]; color?: string }) {
  const n = axes.length
  const pt = (i: number, r: number): Pt => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return [r * Math.cos(a), r * Math.sin(a)]
  }
  const poly = (r: (i: number) => number) => axes.map((_, i) => pt(i, r(i)).join(',')).join(' ')
  return (
    <svg viewBox="-80 -70 160 140" className="radar">
      {[0.33, 0.66, 1].map((k) => (
        <polygon key={k} points={poly(() => 50 * k)} fill="none" className="grid-line" />
      ))}
      <polygon points={poly((i) => (values[i] / 100) * 50)} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      {axes.map((a, i) => {
        const [x, y] = pt(i, 62)
        return (
          <text key={i} x={x} y={y + 3} textAnchor="middle" className="radar-label">
            {a}
          </text>
        )
      })}
    </svg>
  )
}

export function Heatmap({ rows, cols, data }: { rows: string[]; cols: number; data: number[][] }) {
  return (
    <div className="heatmap" style={{ gridTemplateColumns: `34px repeat(${cols}, minmax(0, 1fr))` }}>
      {rows.map((r, ri) => (
        <div key={r} style={{ display: 'contents' }}>
          <span className="hm-label">{r}</span>
          {data[ri].map((v, ci) => (
            <i key={ci} style={{ background: `color-mix(in srgb, var(--accent) ${Math.round(v * 100)}%, var(--card))` }} title={`${r}, ${ci}:00 — ${Math.round(v * 100)}% инноваций`} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function Scatter({ points }: { points: { x: number; y: number; r?: number }[] }) {
  return (
    <svg viewBox="0 0 300 160" className="chart-svg">
      <line x1="20" y1="140" x2="290" y2="140" className="axis" />
      <line x1="20" y1="10" x2="20" y2="140" className="axis" />
      {points.map((p, i) => (
        <circle key={i} cx={20 + p.x * 270} cy={140 - p.y * 130} r={p.r ?? 4} fill="var(--accent)" fillOpacity="0.6" stroke="var(--accent)" />
      ))}
      <text x="155" y="156" textAnchor="middle" className="radar-label">
        Цена →
      </text>
      <text x="8" y="80" textAnchor="middle" className="radar-label" transform="rotate(-90 8 80)">
        Счастье →
      </text>
    </svg>
  )
}
