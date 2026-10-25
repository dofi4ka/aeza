import { useMemo, useState } from 'react'
import { useApp } from '../state'
import { LOCATIONS, PLANS, FAQ } from '../lib/data'
import { orderFlow } from '../lib/flows'
import { fmt } from '../lib/rand'
import { PageHero } from '../components/PageHero'
import { Accordion, Badge, SectionTitle } from '../components/ui'
import { RateWidget } from '../components/Overlays'

type Period = 'hour' | 'month' | 'year' | 'epoch'
const PERIODS: { id: Period; label: string; k: number; suffix: string }[] = [
  { id: 'hour', label: 'Час', k: 1 / 720, suffix: '₽/час' },
  { id: 'month', label: 'Месяц', k: 1, suffix: '₽/мес' },
  { id: 'year', label: 'Год', k: 12, suffix: '₽/год' },
  { id: 'epoch', label: 'Эпоха', k: 12000, suffix: '₽/эпоху' },
]

function Configurator() {
  const app = useApp()
  const [cpu, setCpu] = useState(4)
  const [ram, setRam] = useState(8)
  const [disk, setDisk] = useState(120)
  const [ai, setAi] = useState(50)
  const [gen, setGen] = useState(3)
  const [emp, setEmp] = useState(70)
  const price = useMemo(() => {
    const base = cpu * 150 + ram * 60 + disk * 2
    const aiTax = Math.round(Math.sin(ai / 15) * 300 + ai * 7)
    const genMul = 1 + gen * 0.11
    return Math.max(1, Math.round((base + aiTax) * genMul - emp * 3))
  }, [cpu, ram, disk, ai, gen, emp])
  const sliders: { label: string; v: number; set: (n: number) => void; min: number; max: number; step?: number; unit: string; hint?: string }[] = [
    { label: 'vCPU', v: cpu, set: setCpu, min: 1, max: 64, unit: 'ядер' },
    { label: 'RAM', v: ram, set: setRam, min: 1, max: 512, unit: 'ГБ' },
    { label: 'NVMe', v: disk, set: setDisk, min: 10, max: 8000, step: 10, unit: 'ГБ' },
    { label: 'Количество AI', v: ai, set: setAi, min: 0, max: 100, unit: '%', hint: 'Влияет на цену синусоидально' },
    { label: 'Уровень нового поколения', v: gen, set: setGen, min: 1, max: 12, unit: 'пок.', hint: 'Каждое поколение +11%' },
    { label: 'Эмпатия ядра', v: emp, set: setEmp, min: 0, max: 100, unit: '%', hint: 'Добрые серверы дешевле' },
  ]
  return (
    <div className="configurator slop-border">
      <div className="conf-sliders">
        {sliders.map((s) => (
          <label key={s.label} className="slider">
            <div className="slider-head">
              <span>{s.label}</span>
              <b>
                {fmt(s.v)} {s.unit}
              </b>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step ?? 1} value={s.v} onChange={(e) => s.set(+e.target.value)} />
            {s.hint && <span className="muted small">{s.hint}</span>}
          </label>
        ))}
      </div>
      <div className="conf-total">
        <div className="muted">Итого:</div>
        <div className="conf-price">{fmt(price)} ₽/мес</div>
        <div className="muted small">или 0 ₽, если верить в себя ✨</div>
        <div className="conf-summary">
          {cpu} vCPU · {ram} ГБ RAM · {fmt(disk)} ГБ NVMe · {ai}% AI · {gen}-е поколение · {emp}% эмпатии
        </div>
        <button className="btn btn-orange btn-block" onClick={() => orderFlow(app, `Кастомный VPS за ${fmt(price)} ₽`)}>
          Собрать сервер
        </button>
        <button className="btn btn-black btn-block" onClick={() => app.openChat(`Собери мне сервер: ${cpu} vCPU, ${ram} ГБ RAM`)}>
          Пусть AI соберёт ✨
        </button>
      </div>
    </div>
  )
}

export default function Vps() {
  const app = useApp()
  const [loc, setLoc] = useState(1)
  const [period, setPeriod] = useState<Period>('month')
  const per = PERIODS.find((p) => p.id === period)!
  const l = LOCATIONS[loc]
  return (
    <>
      <PageHero
        emoji="🖥️"
        title="Виртуальные серверы"
        sub="Мощные процессоры AMD и накопители NVMe SSD. Мощные процессоры AMD и накопители NVMe SSD. Мощные процессоры AMD и накопители NVMe SSD нового поколения. 🚀"
        badges={['HOT', 'AI', '✨', 'NVMe', 'x2']}
      />
      <section className="container section">
        <div className="loc-tabs">
          {LOCATIONS.map((x, i) => (
            <button key={x.city} className={`loc-tab ${i === loc ? 'active' : ''}`} onClick={() => setLoc(i)}>
              <span>{x.flag}</span> {x.city}
              {x.tag && <Badge b={x.tag} />}
            </button>
          ))}
        </div>
        <div className="row between wrap gap8 plan-bar">
          <div className="muted">
            Локация: <b>{l.flag} {l.country}, {l.city}</b> · пинг ≈ {l.ping} мс {l.fake && '(примерно, по ощущениям)'}
          </div>
          <div className="seg">
            {PERIODS.map((p) => (
              <button key={p.id} className={p.id === period ? 'on' : ''} onClick={() => setPeriod(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="plans">
          {PLANS.map((p) => {
            const price = p.price * per.k * (l.fake ? 3.14 : 1)
            return (
              <div key={p.name} className={`plan slop-hover ${p.hot ? 'hot' : ''}`}>
                {p.hot && <div className="plan-ribbon">🔥 ХИТ · ХИТ · ХИТ</div>}
                <h3>{p.name}</h3>
                <div className="plan-price">
                  {price < 10 ? price.toFixed(2) : fmt(price)} <span>{per.suffix}</span>
                </div>
                <ul>
                  <li>⚙️ {p.cpu} vCPU (AMD, мощные)</li>
                  <li>🧠 {p.ram} ГБ RAM</li>
                  <li>💾 {fmt(p.disk)} ГБ NVMe SSD</li>
                  <li>🌐 {p.net}</li>
                  <li>🤝 Синергия: {p.synergy}</li>
                  <li>✨ AI: включён</li>
                  <li>✨ AI: включён (повторно)</li>
                </ul>
                <button className="btn btn-orange btn-block" onClick={() => orderFlow(app, `${p.name} · ${l.city}`)}>
                  Заказать
                </button>
                <button className="btn btn-ghost btn-block small" onClick={() => app.openChat(`Чем ${p.name} отличается от остальных?`)}>
                  Сравнить с AI
                </button>
              </div>
            )
          })}
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Конфигуратор нового поколения 🎛️" sub="Соберите сервер мечты. Цена рассчитывается по запатентованной формуле синергии." />
        <Configurator />
      </section>
      <section className="container section">
        <SectionTitle title="Сравнение тарифов" sub="Все тарифы одинаково хороши. Особенно одинаково." />
        <div className="table-wrap slop-border">
          <table className="vs-table">
            <thead>
              <tr>
                <th>Параметр</th>
                {PLANS.slice(0, 4).map((p) => (
                  <th key={p.name}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['NVMe', 'DDoS-защита', 'AI', 'Синергия', 'Оранжевая кнопка', 'Смысл'].map((r) => (
                <tr key={r}>
                  <td>{r}</td>
                  {PLANS.slice(0, 4).map((p) => (
                    <td key={p.name}>{r === 'Смысл' ? '❌' : '✅'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Часто спрашивают (про VPS)" sub="Те же вопросы, что и на главной. Мы их любим." />
        <Accordion items={FAQ.slice(0, 5)} />
        <RateWidget what="виртуальные серверы" />
      </section>
    </>
  )
}
