import { useState, type ReactNode } from 'react'
import type { Badge as BadgeT } from '../lib/data'

export function Badge({ b }: { b: BadgeT | string }) {
  const cls: Record<string, string> = { NEW: 'new', AI: 'ai', BETA: 'beta', HOT: 'hot', СКОРО: 'soon', PRO: 'pro', WEB3: 'web3' }
  return <span className={`badge badge-${cls[b] ?? 'misc'}`}>{b}</span>
}

export function Arrow({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12h15m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Star() {
  return (
    <svg width="18" height="18" viewBox="-3.4 -3.8 24 24" fill="none" aria-hidden>
      <path d="M8.6 0.8l2.3 4.8 5.2.7-3.8 3.6.9 5.2-4.6-2.5-4.6 2.5.9-5.2L1.1 6.3l5.2-.7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function SectionTitle({ title, sub, echo = 0, center }: { title: string; sub?: string; echo?: number; center?: boolean }) {
  return (
    <div className={`section-title ${center ? 'center' : ''}`}>
      <h2>{title}</h2>
      {Array.from({ length: echo }, (_, i) => (
        <div key={i} className="echo" style={{ opacity: 0.5 / (i + 1) }} aria-hidden>
          {title}
        </div>
      ))}
      {sub && <p>{sub}</p>}
    </div>
  )
}

export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="accordion">
      {items.map((it, i) => (
        <div key={i} className={`acc-item slop-border ${open === i ? 'open' : ''}`}>
          <button className="acc-q" onClick={() => setOpen(open === i ? null : i)}>
            <span>{it.q}</span>
            <span className="acc-plus">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <div className="acc-a">{it.a}</div>}
        </div>
      ))}
    </div>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <button type="button" role="switch" aria-checked={on} className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)}>
        <i />
      </button>
    </label>
  )
}

export function Marquee({ items, reverse, dark }: { items: string[]; reverse?: boolean; dark?: boolean }) {
  const row = [...items, ...items]
  return (
    <div className={`marquee ${dark ? 'dark' : ''}`}>
      <div className={`marquee-track ${reverse ? 'rev' : ''}`}>
        {row.map((t, i) => (
          <span key={i}>
            {t} <b>✦</b>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Простейший «MarkDown нового поколения»: **жирный** и переносы строк. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <p key={i} className="rich-line">
          {line.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) => (chunk.startsWith('**') ? <b key={j}>{chunk.slice(2, -2)}</b> : <span key={j}>{chunk}</span>))}
        </p>
      ))}
    </>
  )
}

export function FakeQR({ seed = 7, size = 140 }: { seed?: number; size?: number }) {
  const n = 25
  let s = seed
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const cells: ReactNode[] = []
  const finder = (x: number, y: number) => x < 7 && y < 7
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const inF = finder(x, y) || finder(n - 1 - x, y) || finder(x, n - 1 - y)
      let on = rnd() > 0.5
      if (inF) {
        const lx = x < 7 ? x : n - 1 - x
        const ly = y < 7 ? y : n - 1 - y
        on = lx === 0 || ly === 0 || lx === 6 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4)
      }
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
    }
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} width={size} height={size} className="qr">
      <rect x="-1" y="-1" width={n + 2} height={n + 2} fill="#fff" />
      <g fill="#000">{cells}</g>
      <rect x="9.5" y="9.5" width="6" height="6" rx="1.5" fill="#ff7a00" />
      <text x="12.5" y="14" textAnchor="middle" fontSize="5" fontWeight="800" fill="#fff">
        é
      </text>
    </svg>
  )
}
