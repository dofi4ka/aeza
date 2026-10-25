import { useEffect, useState } from 'react'
import { useApp, useTick } from '../state'
import { go, Link } from '../lib/router'
import { FAQ, LOCATIONS, SERVICES, TESTIMONIALS, WHY } from '../lib/data'
import { walk } from '../lib/rand'
import { BUZZ, slopParagraph } from '../lib/slop'
import { orderFlow } from '../lib/flows'
import { Wordmark } from '../components/Logo'
import { Accordion, Arrow, Badge, Marquee, SectionTitle, Star } from '../components/ui'
import { Gauge, LineChart, PieChart, Sparkline } from '../components/Charts'
import { RateWidget } from '../components/Overlays'
import type { Service } from '../lib/data'

const BUZZ_ROW = [...BUZZ]

const SLOGANS = [
  'Хостинг нового поколения',
  'Хостинг нового поколения нового поколения',
  'Поколение нового хостинга',
  'Не просто хостинг — экосистема хостинга',
  'Хостинг, который хостит хостинг',
  'Хостинг нового поколения ✨',
]

export function Globe() {
  return (
    <div className="globe-wrap" aria-hidden>
      <div className="ring r1" />
      <div className="ring r2" />
      <div className="globe">
        <svg viewBox="-100 -100 200 200" className="globe-lines">
          <defs>
            <clipPath id="globe-clip">
              <circle r="92" />
            </clipPath>
          </defs>
          <g clipPath="url(#globe-clip)">
            <g className="continents">
              {[0, 200].map((dx) => (
                <g key={dx} transform={`translate(${dx} 0)`}>
                  <path d="M-80,-40 q20,-25 45,-10 t30,15 q-5,20 -30,25 t-40,-5 z" />
                  <path d="M-20,10 q15,-5 25,10 t5,35 q-15,10 -25,-5 t-5,-40 z" />
                  <path d="M20,-55 q30,-10 60,5 t10,30 q-20,10 -40,0 t-30,-35 z" />
                  <path d="M50,20 q20,0 25,15 t-10,20 q-15,-5 -15,-35 z" />
                </g>
              ))}
            </g>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ellipse key={i} rx="92" ry="92" className="meridian" style={{ animationDelay: `${-i * 2}s` }} />
            ))}
            {[-60, -30, 0, 30, 60].map((lat) => (
              <ellipse key={lat} cx="0" cy={92 * Math.sin((lat * Math.PI) / 180)} rx={92 * Math.cos((lat * Math.PI) / 180)} ry="7" className="parallel" />
            ))}
          </g>
        </svg>
        <div className="globe-shine" />
      </div>
      <div className="ring r3" />
    </div>
  )
}

function Hero() {
  const app = useApp()
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % SLOGANS.length), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <section className="hero">
      <Globe />
      <div className="hero-content">
        <div className="pill-row">
          {['✨ Теперь с AI', '✨ Теперь с AI', '✨ Теперь с AI'].map((p, k) => (
            <span key={k} className="hero-pill" style={{ opacity: 1 - k * 0.3 }}>
              {p}
            </span>
          ))}
        </div>
        <Wordmark className="hero-mark" />
        <h1 key={i} className="hero-title fade-in">
          {SLOGANS[i]}
        </h1>
        <div className="hero-echo">нового поколения</div>
        <div className="hero-echo e2">поколения</div>
        <div className="hero-echo e3">…ения</div>
        <div className="hero-cta">
          <button className="btn btn-orange btn-lg glow" onClick={() => go('/vps')}>
            Попробовать <Arrow />
          </button>
          <button className="btn btn-black btn-lg" onClick={() => app.openChat('Хочу попробовать с AI')}>
            Попробовать с AI ✨
          </button>
          <button className="btn btn-peach btn-lg" onClick={() => app.toast('Вы попробовали попробовать. Получилось! 🎉', '🧪')}>
            Попробовать попробовать
          </button>
        </div>
        <p className="hero-note">Без карты · Без смысла · Без доплат · Без. Доплат.</p>
      </div>
    </section>
  )
}

function Stats() {
  const app = useApp()
  const t = useTick(1200)
  const servers = 20778 + t * 3 + (t % 7)
  const up = walk(40, 3, 97, 1.2, 94, 100)
  const grow = walk(40, 11, 40, 4, 0, 100).map((v, i) => v * 0.3 + i * 2)
  const flags = LOCATIONS.filter((l) => !l.fake).map((l) => l.flag)
  const tiles = [
    { body: <Sparkline data={up} min={80} max={100} />, title: 'Стабильная работа', link: 'Статус', to: '/status' },
    {
      body: (
        <div className="flag-grid">
          {flags.map((f, k) => (
            <span key={k}>{f}</span>
          ))}
        </div>
      ),
      title: '11 дата-центров',
      link: 'Локации',
      to: '/locations',
    },
    { body: <Sparkline data={grow} />, title: `${servers.toLocaleString('ru-RU')} серверов`, link: 'Онлайн', to: '/dashboard' },
    { body: <div className="stat-big">∞</div>, title: 'Бесконечная синергия', link: 'Синергия', onClick: () => app.toast('Синергия: ∞. Проверено синергией. 🤝', '♾️') },
    { body: <div className="stat-big">42</div>, title: 'Нейросети думают', link: 'Думают', onClick: () => app.openChat('О чём вы думаете?') },
    { body: <Sparkline data={walk(40, 99, 70, 15)} color="var(--accent)" />, title: '7000 МБ/с вдохновения', link: 'Вдохновение', to: '/analytics' },
  ]
  return (
    <div className="stats container">
      {tiles.map((s, k) => (
        <div key={k} className="stat">
          <div className="stat-vis">{s.body}</div>
          <div className="stat-title">{s.title}</div>
          <button className="stat-link" onClick={() => (s.to ? go(s.to) : s.onClick?.())}>
            {s.link} <Arrow size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export function ServiceCard({ s, first }: { s: Service; first?: boolean }) {
  const app = useApp()
  const to = s.id === 'virtual' ? '/vps' : `/service/${s.id}`
  return (
    <div className={`svc-card slop-hover ${s.soon ? 'soon' : ''}`} onClick={() => go(to)}>
      <div className="svc-top">
        <h3>
          {s.title} <span className="svc-emoji">{s.emoji}</span>
        </h3>
        <div className="badges">{s.badges?.map((b) => <Badge key={b} b={b} />)}</div>
      </div>
      <p>{s.desc}</p>
      <div className="svc-bottom">
        <button
          className="svc-order"
          onClick={(e) => {
            e.stopPropagation()
            orderFlow(app, s.title)
          }}
        >
          Заказать в 1 клик (4 клика)
        </button>
        <span className={`arrow-btn ${first ? 'filled' : ''}`}>
          <Arrow />
        </span>
      </div>
    </div>
  )
}

function Services() {
  const app = useApp()
  return (
    <section className="container section" id="services">
      <div className="promo-banner">
        <div>
          <h2>Что мы предлагаем?</h2>
          <p>Полный спектр для создания своей инфраструктуры. Полный. Спектр. И ещё немного сверх спектра. 🌈</p>
          <div className="row gap8 wrap">
            <button className="btn btn-white" onClick={() => go('/dashboard')}>
              Личный кабинет
            </button>
            <button className="btn btn-white-ghost" onClick={() => app.openChat('Покажи личный кабинет, но с AI')}>
              Личный кабинет (AI) ✨
            </button>
          </div>
        </div>
        <div className="glass-server" aria-hidden>
          <div className="gs-unit">
            <i />
            <i />
          </div>
          <div className="gs-unit">
            <i />
            <i />
          </div>
          <div className="gs-unit">
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className="svc-grid">
        {SERVICES.map((s, k) => (
          <ServiceCard key={s.id} s={s} first={k === 0} />
        ))}
      </div>
      <div className="promo-banner small">
        <h2>Что мы предлагаем? (ещё раз)</h2>
        <p>Мы предлагаем то, что предлагаем. И предлагаем это снова. 🔁</p>
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <section className="container section why">
      <div className="why-head">
        <SectionTitle title="Почему мы?" sub="Мы собраны из ваших запросов. Выберите то, что вам откликается. Откликается? Откликается. 🔊" echo={2} />
        <svg className="why-deco" viewBox="0 0 420 140" aria-hidden>
          <path d="M40 120 C 80 20, 200 0, 260 60 S 400 110, 400 30" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 7" />
          <text x="10" y="110" fontSize="80" className="why-star">
            ☆
          </text>
        </svg>
      </div>
      <div className="bento">
        {WHY.map((w, k) => (
          <div key={k} className={`bento-card tone-${w.tone} ${w.span === 2 ? 'span2' : ''}`}>
            <span className="bento-star">
              <Star />
            </span>
            <h3>{w.title}</h3>
            <p>{w.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Versus() {
  const rows: [string, string, string, string][] = [
    ['NVMe SSD', '✅', '✅', '✅✅'],
    ['Синергия', '✅', '✅', '✅✅✅'],
    ['AI', '✅', '✅', '✅ (AI)'],
    ['Оранжевый цвет', '🟧', '🟧', '🟧🟧🟧'],
    ['Кнопка «Попробовать»', '✅', '✅', '✅ ×3'],
    ['Экосистема', '✅', '✅', '♾️'],
    ['Смысл', '❌', '❌', '❌ (но с AI)'],
  ]
  return (
    <section className="container section">
      <SectionTitle title="Aéza vs Aéza vs Aéza" sub="Честное сравнение. Мы сравнили себя с собой и победили. 🏆" center />
      <div className="table-wrap slop-border">
        <table className="vs-table">
          <thead>
            <tr>
              <th>Функция</th>
              <th>Aéza</th>
              <th>Aéza (ещё раз)</th>
              <th className="hl">Aéza с AI ✨</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                {r.map((c, k) => (
                  <td key={k} className={k === 3 ? 'hl' : ''}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function AnalyticsTeaser() {
  const moon = walk(14, 5, 50, 20).map((v) => v)
  const ping = moon.map((v, i) => v * 0.8 + Math.sin(i) * 6 + 8)
  return (
    <section className="container section">
      <SectionTitle title="Аналитика синергии 📊" sub="Графики, которые ничего не значат, но выглядят очень убедительно." />
      <div className="grid-3">
        <div className="panel slop-border span2">
          <h4>Пинг vs фазы Луны 🌕</h4>
          <LineChart
            series={[
              { name: 'Пинг, мс', data: ping, color: 'var(--accent)' },
              { name: 'Фаза Луны, %', data: moon, color: '#7c3aed' },
            ]}
            labels={['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']}
          />
          <p className="muted small">Корреляция: 0.97. Причинно-следственная связь: подтверждена нейросетью.</p>
        </div>
        <div className="panel slop-border">
          <h4>Индекс нового поколения</h4>
          <Gauge value={137} label="Превышено на 37% от возможного" />
        </div>
        <div className="panel slop-border">
          <h4>Из чего состоит сервер</h4>
          <PieChart
            data={[
              { label: 'Сервер', value: 97, color: 'var(--accent)' },
              { label: 'NVMe', value: 2, color: '#000' },
              { label: 'Магия', value: 1, color: '#7c3aed' },
            ]}
          />
        </div>
        <div className="panel slop-border span2 center-col">
          <h4>Хотите больше бессмысленных графиков?</h4>
          <p className="muted">У нас есть целая страница. С тепловой картой инноваций.</p>
          <Link to="/analytics" className="btn btn-orange">
            Открыть аналитику <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Ecosystem() {
  const items = [
    { to: '/ai', e: '🤖', t: 'Aéza AI', d: 'Чат, который отвечает на вопросы, которые вы не задавали.', b: ['AI', 'NEW'] },
    { to: '/mcp', e: '🧩', t: 'Aéza MCP', d: 'Model Context Protocol для вашего Context Protocol.', b: ['NEW'] },
    { to: '/extension', e: '🧭', t: 'Расширение', d: 'Добавляет ✨ ко всем заголовкам интернета. Почти.', b: ['BETA'] },
    { to: '/app', e: '📱', t: 'Приложение', d: 'Медитируйте вместе с сервером. 5 минут в день.', b: ['HOT'] },
    { to: '/themes', e: '🎨', t: 'Темы', d: '8 тем, включая «Ещё оранжевее».', b: ['x8'] },
    { to: '/labs', e: '🧪', t: 'Labs', d: 'Квантовый пинг, NFT-серверы и метавселенная.', b: ['WEB3'] },
  ]
  return (
    <section className="container section">
      <SectionTitle title="Экосистема Aéza ✨" sub="Шесть продуктов, которые бесшовно делают одно и то же." echo={1} />
      <div className="eco-grid">
        {items.map((it) => (
          <Link key={it.to} to={it.to} className="eco-card slop-hover">
            <span className="eco-emoji">{it.e}</span>
            <div className="badges">
              {it.b.map((b) => (
                <Badge key={b} b={b} />
              ))}
            </div>
            <h3>{it.t}</h3>
            <p>{it.d}</p>
            <span className="arrow-btn">
              <Arrow />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <SectionTitle title="Отзывы (208)" sub="Показано 8 из 208. Остальные 200 — те же 8, но в другом порядке." />
      </div>
      <div className="testi-track">
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, k) => (
          <div key={k} className="testi slop-border">
            <div className="testi-head">
              <span className="testi-ava">{t.avatar}</span>
              <div>
                <b>{t.who}</b>
                <div className="muted small">{t.role}</div>
              </div>
            </div>
            <div className="testi-stars">★★★★★</div>
            <p>{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  const app = useApp()
  return (
    <section className="container section faq">
      <div className="faq-side">
        <SectionTitle title="Часто спрашивают" sub="Узнайте ответы на самые частые вопросы. Самые частые вопросы — те, которые спрашивают часто." />
        <button className="btn btn-black" onClick={() => app.openChat()}>
          Задать свой вопрос
        </button>
        <button className="btn btn-peach" onClick={() => app.openChat('Задай вопрос за меня')}>
          Задать чужой вопрос
        </button>
      </div>
      <Accordion items={FAQ} />
    </section>
  )
}

function Cta() {
  const app = useApp()
  return (
    <section className="container section">
      <div className="cta-block">
        <div className="cta-glow" />
        <h2>Готовы попробовать?</h2>
        <h3>Готовы попробовать попробовать?</h3>
        <p>{slopParagraph('cta', 2)}</p>
        <div className="row gap8 wrap center">
          <button className="btn btn-orange" onClick={() => go('/vps')}>
            Попробовать
          </button>
          <button className="btn btn-orange btn-lg" onClick={() => go('/vps')}>
            Попробовать
          </button>
          <button className="btn btn-orange btn-xl glow" onClick={() => app.openChat('Попробовать!')}>
            ПОПРОБОВАТЬ ✨
          </button>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <div className="sheet">
        <Stats />
        <Marquee items={BUZZ_ROW} />
        <Marquee items={BUZZ_ROW} reverse dark />
        <Services />
        <WhyUs />
        <Versus />
        <AnalyticsTeaser />
        <Ecosystem />
        <Testimonials />
        <Faq />
        <Cta />
        <div className="container">
          <RateWidget what="главную страницу" />
        </div>
      </div>
    </>
  )
}
