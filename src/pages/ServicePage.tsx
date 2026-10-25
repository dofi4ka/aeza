import { useEffect, useState } from 'react'
import { useApp, useTick } from '../state'
import { SERVICES, FAQ } from '../lib/data'
import { hashStr, mulberry32, pick, fmt } from '../lib/rand'
import { rngFor, slopSentence } from '../lib/slop'
import { orderFlow } from '../lib/flows'
import { PageHero } from '../components/PageHero'
import { Accordion, SectionTitle, Toggle } from '../components/ui'
import { RateWidget } from '../components/Overlays'
import { ServiceCard } from './Home'
import NotFound from './NotFound'

const ZONES = ['.ru', '.com', '.ai', '.aeza', '.neuro', '.slop', '.синергия', '.рф', '.nvme', '.io', '.ещё']
const STATUSES = ['Свободен', 'Свободен (наверное)', 'Занят вами в будущем', 'Квантово свободен', 'Свободен, но грустит', 'Свободен ✨']

function DomainChecker() {
  const app = useApp()
  const [q, setQ] = useState('synergy')
  const [res, setRes] = useState<{ name: string; status: string; price: number }[] | null>(null)
  const [loading, setLoading] = useState(false)
  const check = () => {
    setLoading(true)
    setRes(null)
    setTimeout(() => {
      const base = q.trim().toLowerCase().replace(/\s+/g, '-') || 'синергия'
      const r = mulberry32(hashStr(base))
      setRes(ZONES.map((z) => ({ name: base + z, status: pick(STATUSES, r), price: Math.round(99 + r() * 4900) })))
      setLoading(false)
    }, 900)
  }
  return (
    <div className="panel slop-border">
      <h3>🔎 Проверка домена с AI</h3>
      <form
        className="row gap8 wrap"
        onSubmit={(e) => {
          e.preventDefault()
          check()
        }}
      >
        <input className="input grow" value={q} onChange={(e) => setQ(e.target.value)} placeholder="придумайте-домен-нового-поколения" />
        <button className="btn btn-orange">Проверить</button>
        <button type="button" className="btn btn-black" onClick={() => setQ(pick(['synergy-ai', 'nvme-for-soul', 'hosting-next-gen', 'try-try', 'oranzhevo']))}>
          Придумай за меня ✨
        </button>
      </form>
      {loading && <div className="muted mt16">Спрашиваем у регистратора… регистратор спрашивает у AI…</div>}
      {res && (
        <div className="domain-list">
          {res.map((d) => (
            <div key={d.name} className="domain-row">
              <b>{d.name}</b>
              <span className="domain-status">{d.status}</span>
              <span>{fmt(d.price)} ₽/год</span>
              <button className="btn btn-peach btn-sm" onClick={() => app.toast(`${d.name} добавлен в корзину мечты 🛒`, '🛒')}>
                В корзину
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function QuantumWidget() {
  const [observed, setObserved] = useState(false)
  const t = useTick(400)
  return (
    <div className="panel slop-border center-col">
      <h3>⚛️ Состояние вашего квантового VPS</h3>
      <div className="big-emoji">{observed ? (t % 2 ? '🟢' : '🔴') : '🟢🔴'}</div>
      <p>{observed ? 'Вы посмотрели — сервер смутился и начал мигать.' : 'Сервер одновременно включён и выключен.'}</p>
      <Toggle on={observed} onChange={setObserved} label="Наблюдать за сервером" />
    </div>
  )
}

function SoonWidget() {
  const [s, setS] = useState(10)
  useEffect(() => {
    const id = setInterval(() => setS((x) => (x <= 1 ? 10 : x - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="panel slop-border center-col">
      <h3>⏳ До запуска осталось</h3>
      <div className="countdown">00:00:{String(s).padStart(2, '0')}</div>
      <p className="muted">Когда таймер дойдёт до нуля, он начнётся заново. Это и есть «Скоро».</p>
    </div>
  )
}

function FeelingsWidget() {
  const app = useApp()
  const moods = ['😊', '😐', '😢', '😡', '🥹', '🤖']
  return (
    <div className="panel slop-border center-col">
      <h3>💗 Какой трафик эмоций разместить?</h3>
      <div className="row gap8 wrap center">
        {moods.map((m) => (
          <button key={m} className="mood" onClick={() => app.toast(`Эмоция ${m} размещена на NVMe. Аптайм чувства: 99.9%`, m)}>
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}

function AdminWidget() {
  const app = useApp()
  const admins = ['Админ Алексей (человек)', 'Админ Алексей (AI)', 'Админ Алексей (AI, но притворяется человеком)', 'Блокчейн-админ (не найден)']
  return (
    <div className="panel slop-border">
      <h3>🧑‍🔧 Выберите администратора</h3>
      <div className="admin-list">
        {admins.map((a) => (
          <button key={a} className="btn btn-outline btn-block" onClick={() => app.openChat(`${a}, помогите с сервером`)}>
            {a}
          </button>
        ))}
      </div>
    </div>
  )
}

const WIDGETS: Record<string, () => JSX.Element> = {
  domains: DomainChecker,
  quantum: QuantumWidget,
  waf: SoonWidget,
  feelings: FeelingsWidget,
  admin: AdminWidget,
  'chain-admin': AdminWidget,
}

export default function ServicePage({ id }: { id: string }) {
  const app = useApp()
  const s = SERVICES.find((x) => x.id === id)
  if (!s) return <NotFound />
  const r = rngFor(id)
  const perks = Array.from({ length: 6 }, () => slopSentence(r))
  const base = 100 + Math.floor(r() * 900)
  const tiers = [
    { n: 'Базовый', p: base },
    { n: 'Базовый+', p: base + 20 },
    { n: 'Не базовый ✨', p: base * 7 },
  ]
  const Widget = WIDGETS[id]
  const others = SERVICES.filter((x) => x.id !== id).slice(0, 4)
  return (
    <>
      <PageHero emoji={s.emoji} title={s.title} sub={`${s.desc} ${s.desc}`} badges={s.badges as string[] | undefined} />
      <section className="container section">
        {Widget && <Widget />}
        <SectionTitle title="Ключевые преимущества:" sub="Важно отметить, что каждое преимущество является преимуществом." />
        <div className="perk-grid">
          {perks.map((p, k) => (
            <div key={k} className="perk slop-border">
              <span className="perk-num">{k + 1}</span>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Тарифы" sub="Три тарифа. Два из них одинаковые." />
        <div className="plans plans-3">
          {tiers.map((t) => (
            <div key={t.n} className="plan slop-hover">
              <h3>{t.n}</h3>
              <div className="plan-price">
                {fmt(t.p)} <span>₽/мес</span>
              </div>
              <ul>
                <li>✅ {s.title}</li>
                <li>✅ {s.title} (ещё раз)</li>
                <li>✨ AI-ассистент</li>
                <li>🤝 Синергия</li>
              </ul>
              <button className="btn btn-orange btn-block" onClick={() => orderFlow(app, `${s.title} · ${t.n}`)}>
                Заказать
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Похожие услуги" sub="Они не похожи, но AI сказал, что похожи." />
        <div className="svc-grid">
          {others.map((o) => (
            <ServiceCard key={o.id} s={o} />
          ))}
        </div>
      </section>
      <section className="container section">
        <Accordion items={FAQ.slice(0, 4)} />
        <RateWidget what={`услугу «${s.title}»`} />
      </section>
    </>
  )
}
