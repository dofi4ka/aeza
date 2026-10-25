import { useEffect, useState } from 'react'
import { useApp, useTick } from '../state'
import { PageHero } from '../components/PageHero'
import { FakeQR, SectionTitle } from '../components/ui'
import { Sparkline } from '../components/Charts'
import { Wordmark } from '../components/Logo'
import { walk } from '../lib/rand'
import { RateWidget } from '../components/Overlays'

const SCREENS = ['🏠', '🤖', '📶', '🧘'] as const

function Meditation() {
  const app = useApp()
  const [sec, setSec] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSec((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    if (sec === 8) app.award('meditate', 'Помедитировал с сервером 8 секунд', 25)
  }, [sec])
  return (
    <div className="ph-screen center-col">
      <div className="breath" />
      <b>{sec % 8 < 4 ? 'Вдох… сервер вдыхает' : 'Выдох… сервер выдыхает'}</b>
      <span className="muted small">Сессия: {sec} с · Синхронизация с NVMe: 100%</span>
    </div>
  )
}

function PhoneScreen({ s }: { s: (typeof SCREENS)[number] }) {
  const t = useTick(1000)
  if (s === '🏠')
    return (
      <div className="ph-screen">
        <div className="ph-card">
          <span className="muted small">Баланс</span>
          <b>1 337 ₽</b>
        </div>
        {['synergy-prod-01', 'synergy-prod-01-copy', 'landing-one-button'].map((n, i) => (
          <div key={n} className="ph-card row between">
            <span>
              <span className={`status-dot ${i === 2 ? 'sad' : 'ok'}`} /> {n}
            </span>
            <span className="muted small">{30 + ((t * 7 + i * 13) % 60)}%</span>
          </div>
        ))}
        <div className="ph-card orange">✨ AI рекомендует: ничего не трогать</div>
      </div>
    )
  if (s === '🤖')
    return (
      <div className="ph-screen">
        <div className="ph-msg me">Как дела у сервера?</div>
        <div className="ph-msg ai">Отличный вопрос! 🙌 У сервера дела — это не просто дела, а синергия.</div>
        <div className="ph-msg me">Понятно</div>
        <div className="ph-msg ai">Отличный вопрос! 🙌</div>
      </div>
    )
  if (s === '📶')
    return (
      <div className="ph-screen center-col">
        <div className="ph-ping">{(Math.abs(Math.sin(t)) * 0.9).toFixed(2)} мс</div>
        <Sparkline data={walk(30, t, 10, 5, 0, 20)} color="var(--accent)" />
        <span className="muted small">Пинг до сервера, до облака и до мечты</span>
      </div>
    )
  return <Meditation />
}

export default function MobileApp() {
  const app = useApp()
  const [s, setS] = useState<(typeof SCREENS)[number]>('🏠')
  const stores = ['App Store', 'Google Play', 'RuStore', 'AppGallery', 'Aéza Store', 'Скачать .exe для iPhone', 'Дискета 3.5″']
  return (
    <>
      <PageHero emoji="📱" title="Приложение Aéza" sub="Управляйте серверами с телефона. Управляйте телефоном с сервера. Медитируйте вместе с NVMe. Всё в одном приложении, которое делает всё. 📲" badges={['HOT', 'NEW', 'iOS', 'Android', 'Тамагочи']} />
      <section className="container section app-layout">
        <div className="phone slop-shadow">
          <div className="phone-notch" />
          <div className="phone-top">
            <span>9:41</span>
            <Wordmark className="phone-mark" />
            <span>📶 🔋</span>
          </div>
          <PhoneScreen s={s} />
          <div className="phone-nav">
            {SCREENS.map((x) => (
              <button key={x} className={x === s ? 'on' : ''} onClick={() => setS(x)}>
                {x}
              </button>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle title="Скачать" sub="Доступно везде, где есть экран. И там, где нет." />
          <div className="store-grid">
            {stores.map((st) => (
              <button key={st} className="store-badge" onClick={() => app.toast(`«${st}»: загрузка началась в параллельной вселенной ⏬`, '📲')}>
                <span className="store-small">Загрузите в</span>
                <b>{st}</b>
              </button>
            ))}
          </div>
          <div className="qr-row panel slop-border">
            <FakeQR seed={42} />
            <div>
              <b>Отсканируйте QR-код</b>
              <p className="muted small">Он никуда не ведёт. Это QR-код нового поколения: его ценность — в процессе сканирования.</p>
            </div>
          </div>
          <div className="device-list">
            {['📱 iPhone', '🤖 Android', '⌚ Apple Watch', '🫖 Умный чайник', '🥚 Тамагочи', '🧮 Калькулятор Casio', '📟 Пейджер'].map((d) => (
              <span key={d} className="compat-chip">
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Отзывы в сторах" />
        <div className="grid-3">
          {['Приложение установилось. 5 звёзд. ⭐⭐⭐⭐⭐', 'Медитировал с сервером, теперь у меня аптайм 99.9%. 🧘', 'Не понял, что оно делает, но очень красиво. Оранжевое. 🧡'].map((r, i) => (
            <div key={i} className="testi slop-border">
              <div className="testi-stars">★★★★★</div>
              <p>{r}</p>
              <span className="muted small">— Пользователь {i + 1}, {['iOS', 'Android', 'Тамагочи'][i]}</span>
            </div>
          ))}
        </div>
        <RateWidget what="приложение" />
      </section>
    </>
  )
}
