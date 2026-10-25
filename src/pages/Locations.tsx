import { useRef, useState } from 'react'
import { useApp, useTick } from '../state'
import { LOCATIONS } from '../lib/data'
import { PageHero } from '../components/PageHero'
import { Badge, SectionTitle } from '../components/ui'
import { RateWidget } from '../components/Overlays'

// Координаты точек на «карте мира», нарисованной по памяти нейросетью.
const POS: Record<string, [number, number]> = {
  'Нью-Йорк': [24, 38],
  Хельсинки: [55, 22],
  Москва: [60, 28],
  'Санкт-Петербург': [58, 24],
  Варшава: [53, 31],
  Стокгольм: [52, 22],
  Амстердам: [47, 30],
  Вена: [51, 34],
  Лондон: [45, 30],
  Франкфурт: [49, 32],
  Париж: [46, 34],
  'Море Спокойствия': [88, 10],
  'Кратер Гейла': [92, 80],
  'Везде и нигде': [70, 8],
  'Под столом': [30, 75],
  'Лобная доля': [10, 12],
}

const HOPS = ['ваш-роутер.local', 'провайдер.думает.net', 'magistral-1.synergy.ix', 'ai-hop.neuro', 'nvme-gateway.aeza', 'router-nового-поколения.aeza', 'ещё-один-хоп.aeza', 'облако.облако', 'сервер.aeza (это он!)']

export default function Locations() {
  const app = useApp()
  const t = useTick(1500)
  const [sel, setSel] = useState<string | null>(null)
  const [target, setTarget] = useState('synergy.aeza')
  const [trace, setTrace] = useState<string[]>([])
  const running = useRef(false)

  const runTrace = () => {
    if (running.current) return
    running.current = true
    setTrace([])
    HOPS.forEach((h, i) =>
      setTimeout(() => {
        setTrace((tr) => [...tr, `${String(i + 1).padStart(2, ' ')}  ${h.padEnd(30, ' ')} ${(i * 3.7 + Math.random() * 2).toFixed(2)} мс  ${i === 4 ? '✨' : ''}`])
        if (i === HOPS.length - 1) running.current = false
      }, i * 280),
    )
  }

  return (
    <>
      <PageHero emoji="🌍" title="О дата-центрах" sub="11 дата-центров в трёх частях света и 5 дата-центров в частях, которые ещё не открыты. Выберите ближайший к своей аудитории или к своей мечте. 🗺️" badges={['11+5', 'NEW', 'BETA']} />
      <section className="container section">
        <div className="map slop-border">
          <div className="map-grid" aria-hidden />
          {LOCATIONS.map((l) => {
            const [x, y] = POS[l.city] ?? [50, 50]
            return (
              <button key={l.city} className={`map-dot ${l.fake ? 'fake' : ''} ${sel === l.city ? 'sel' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => setSel(l.city)} title={`${l.country}, ${l.city}`}>
                <span className="map-pulse" />
                <span className="map-flag">{l.flag}</span>
              </button>
            )
          })}
          <div className="map-legend">
            <span>
              <i className="ld real" /> настоящие (почти)
            </span>
            <span>
              <i className="ld fake" /> скоро / метафорические
            </span>
          </div>
        </div>
        <div className="loc-grid">
          {LOCATIONS.map((l) => (
            <div key={l.city} className={`loc-card slop-hover ${sel === l.city ? 'sel' : ''}`} onClick={() => setSel(l.city)}>
              <span className="loc-flag">{l.flag}</span>
              <div>
                <b>{l.country}</b>
                <div className="muted small">{l.city}</div>
              </div>
              <div className="loc-ping">
                {l.ping > 100000 ? '∞' : (l.ping + ((t * 7) % 3) * (l.ping > 0 ? 0.1 : 0)).toFixed(l.ping < 1 ? 1 : 0)} мс
              </div>
              {l.tag && <Badge b={l.tag} />}
            </div>
          ))}
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Looking Glass 🔭" sub="Трассировка до любого адреса. Результаты детерминированно воображаемые." />
        <div className="panel slop-border">
          <form
            className="row gap8 wrap"
            onSubmit={(e) => {
              e.preventDefault()
              runTrace()
              app.toast(`Трассируем ${target} через синергию…`, '🔭')
            }}
          >
            <input className="input grow" value={target} onChange={(e) => setTarget(e.target.value)} aria-label="Адрес" />
            <button className="btn btn-orange">traceroute</button>
            <button type="button" className="btn btn-black" onClick={runTrace}>
              traceroute с AI ✨
            </button>
          </form>
          <pre className="terminal mt16">
            {`$ traceroute ${target}\n`}
            {trace.join('\n')}
            {trace.length === HOPS.length && '\n\n✓ Цель достигнута. Цель — это путь.'}
          </pre>
        </div>
        <RateWidget what="дата-центры" />
      </section>
    </>
  )
}
