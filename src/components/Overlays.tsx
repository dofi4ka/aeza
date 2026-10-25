import { useEffect, useRef, useState } from 'react'
import { useApp, useTick } from '../state'
import { NEWS } from '../lib/data'
import { go } from '../lib/router'
import { confetti } from '../lib/confetti'
import { EMark } from './Logo'

export function ToastHost() {
  const { toasts } = useApp()
  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          <span className="toast-icon">{t.icon}</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  )
}

export function ModalHost() {
  const { modal, closeModal } = useApp()
  useEffect(() => {
    if (!modal) return
    const on = (e: KeyboardEvent) => e.key === 'Escape' && closeModal()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [modal, closeModal])
  if (!modal) return null
  return (
    <div className="modal-back" onClick={closeModal}>
      <div className={`modal slop-border ${modal.wide ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
        <div className="modal-head">
          <h3>{modal.title}</h3>
          <button className="icon-btn" onClick={closeModal} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <div className="modal-body">{modal.body}</div>
        {modal.actions && (
          <div className="modal-actions">
            {modal.actions.map((a, i) => (
              <button
                key={i}
                className={`btn btn-${a.kind ?? 'black'}`}
                onClick={() => {
                  a.onClick?.()
                  if (!a.keepOpen) closeModal()
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function NewsToasts() {
  const [i, setI] = useState(0)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % NEWS.length), 6500)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    if (!hidden) return
    const id = setTimeout(() => setHidden(false), 15000)
    return () => clearTimeout(id)
  }, [hidden])
  if (hidden) return null
  const cur = NEWS[i]
  const next = NEWS[(i + 1) % NEWS.length]
  return (
    <div className="news-stack">
      <div className="news-card ghost2" aria-hidden />
      <div className="news-card ghost1" aria-hidden>
        <div className="news-title">{next.title}</div>
      </div>
      <div className="news-card" key={i}>
        <div className="news-head">
          <span className="news-avatar">
            <EMark size={14} />
          </span>
          <span className="news-src">Aeza</span>
          <span className="news-src muted">· и ещё 3 канала</span>
          <svg className="news-tg" width="20" height="20" viewBox="0 0 24 24" aria-label="Telegram">
            <path fill="#2AABEE" d="M21.9 4.4 18.7 19.6c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13.4l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 3.2c.9-.3 1.6.2 1.4 1.2z" />
          </svg>
        </div>
        <div className="news-title">{cur.title}</div>
        <div className="news-date">{cur.date}</div>
        <button className="news-x" onClick={() => setHidden(true)} aria-label="Скрыть новость">
          ✕
        </button>
      </div>
    </div>
  )
}

const COOKIE_STEPS = [
  {
    text: 'Мы обрабатываем локальные данные браузера и используем инструменты аналитики в целях улучшения и обеспечения работоспособности сайта, статистических исследований и обзоров. Вы можете запретить обработку указанных данных в настройках браузера. Пожалуйста, ознакомьтесь с условиями их обработки.',
    buttons: ['Принять'],
  },
  { text: 'Спасибо! Вы приняли куки. 🍪 Теперь, пожалуйста, примите факт того, что вы приняли куки.', buttons: ['Принять принятие'] },
  {
    text: 'Мы также обрабатываем данные о том, что вы приняли принятие. Это нужно для улучшения улучшений и обеспечения обеспечения. ✨',
    buttons: ['Принять всё', 'Принять всё (рекомендуем)'],
  },
  { text: '🍪 Кстати, хотите куки? Настоящие. С шоколадом. Нового поколения.', buttons: ['Да', 'Конечно да'] },
]

export function CookieStack() {
  const app = useApp()
  const [step, setStep] = useState(-1)
  useEffect(() => {
    const id = setTimeout(() => setStep(0), 1200)
    return () => clearTimeout(id)
  }, [])
  if (step < 0 || step >= COOKIE_STEPS.length) return null
  const s = COOKIE_STEPS[step]
  const accept = () => {
    if (step === 0) app.award('cookie', 'Принял куки. Куки приняли вас', 10)
    if (step === 2) app.award('cookie3', 'Принял принятие куки', 25)
    if (step === 3) {
      app.toast('Куки отправлены Почтой России. Срок доставки: 2–3 года 📦', '🍪')
      confetti(40)
    }
    setStep(step + 1)
  }
  return (
    <div className="cookie slop-shadow" key={step}>
      <p>{s.text}</p>
      <div className="cookie-actions">
        {s.buttons.map((b) => (
          <button key={b} className="btn btn-black btn-block" onClick={accept}>
            {b}
          </button>
        ))}
      </div>
      <div className="cookie-step">Шаг {step + 1} из {COOKIE_STEPS.length} (примерно)</div>
    </div>
  )
}

export function HelpPopup() {
  const app = useApp()
  const [show, setShow] = useState(false)
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => setShow(true), 28000)
    return () => clearTimeout(id)
  }, [])
  if (!show) return null
  return (
    <div className="help-pop slop-border">
      <div className="help-head">
        <span className="help-ava">👩‍💼</span>
        <div>
          <b>Анна</b>
          <div className="muted small">Консультант · точно не AI · онлайн</div>
        </div>
        <button className="icon-btn" onClick={() => setShow(false)} aria-label="Закрыть">
          ✕
        </button>
      </div>
      <p>{phase === 0 ? 'Здравствуйте! 👋 Могу я помочь вам с синергией?' : 'Вы уверены? 🥺 Синергия сама себя не синергирует.'}</p>
      <div className="row gap8">
        <button
          className="btn btn-orange btn-sm"
          onClick={() => {
            setShow(false)
            app.openChat('Анна, помогите мне с синергией')
          }}
        >
          Да
        </button>
        <button className="btn btn-peach btn-sm" onClick={() => (phase === 0 ? setPhase(1) : setShow(false))}>
          {phase === 0 ? 'Нет' : 'Да, уверен'}
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => {
            setShow(false)
            app.openChat('Определённо да')
          }}
        >
          Определённо да
        </button>
      </div>
    </div>
  )
}

export function BackToTop() {
  const app = useApp()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 900)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  if (!show) return null
  const up = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  return (
    <div className="totop">
      <button className="btn btn-white btn-sm slop-shadow" onClick={up}>
        ↑ Наверх
      </button>
      <button className="btn btn-peach btn-sm slop-shadow" onClick={up}>
        ⇈ Ещё выше
      </button>
      <button
        className="btn btn-black btn-sm slop-shadow"
        onClick={() => {
          up()
          app.toast('Вы в облаке ☁️ Добро пожаловать.', '☁️')
        }}
      >
        ☁️ В облако
      </button>
    </div>
  )
}

export function ScrollProgress() {
  const app = useApp()
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      const v = h > 0 ? window.scrollY / h : 0
      setP(v)
      if (v > 0.3) app.award('scroll', 'Прокрутил страницу на 30%. Страница прокрутила вас на 70%', 10)
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [app])
  return (
    <div className="scroll-progress" aria-hidden>
      <i style={{ width: `${p * 100}%` }} />
      <span style={{ left: `${p * 100}%` }}>{Math.round(p * 100)}% синергии</span>
    </div>
  )
}

export function CursorSparkles() {
  const { flags } = useApp()
  const last = useRef(0)
  useEffect(() => {
    if (!flags.cursorSparkles) return
    const on = (e: MouseEvent) => {
      const now = performance.now()
      if (now - last.current < 30) return
      last.current = now
      const s = document.createElement('span')
      s.className = 'sparkle'
      s.textContent = ['✦', '✨', '•', '★', 'é'][Math.floor(Math.random() * 5)]
      s.style.left = `${e.clientX}px`
      s.style.top = `${e.clientY}px`
      document.body.appendChild(s)
      setTimeout(() => s.remove(), 900)
    }
    window.addEventListener('mousemove', on)
    return () => window.removeEventListener('mousemove', on)
  }, [flags.cursorSparkles])
  return null
}

export function PingWidget() {
  const { flags } = useApp()
  const t = useTick(900)
  if (!flags.pingWidget) return null
  const v = (Math.sin(t) * 0.4 + 0.5).toFixed(2)
  return (
    <div className="ping-widget slop-border">
      📶 Пинг: {v} мс · <span className="muted">от расширения Aéza</span>
    </div>
  )
}

export function RateWidget({ what = 'эту страницу' }: { what?: string }) {
  const app = useApp()
  const [done, setDone] = useState(false)
  const [hover, setHover] = useState(0)
  return (
    <div className="rate slop-border">
      {done ? (
        <span>Спасибо! Ваша оценка: ⭐⭐⭐⭐⭐ (любая оценка — 5). Мы передали её нейросети, она расплакалась. 🥹</span>
      ) : (
        <>
          <span>Оцените {what}:</span>
          <span className="stars" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onMouseEnter={() => setHover(5)}
                onClick={() => {
                  setDone(true)
                  app.award('stars', 'Поставил 5 звёзд (любые звёзды — пять)', 15)
                }}
                className={hover >= n ? 'lit' : ''}
                aria-label={`${n} звёзд (на самом деле 5)`}
              >
                ★
              </button>
            ))}
          </span>
        </>
      )}
    </div>
  )
}

export function LoginModalBody() {
  const app = useApp()
  const [phase, setPhase] = useState<'pick' | 'loading' | 'done'>('pick')
  const [step, setStep] = useState(0)
  const steps = ['Сканируем ауру…', 'Сверяем ауру с NVMe…', 'Спрашиваем у нейросети, вы ли это…', 'Нейросеть сказала «наверное»…']
  useEffect(() => {
    if (phase !== 'loading') return
    if (step >= steps.length) {
      setPhase('done')
      app.setLoggedIn(true)
      confetti(60)
      return
    }
    const id = setTimeout(() => setStep(step + 1), 700)
    return () => clearTimeout(id)
  }, [phase, step])
  if (phase === 'done')
    return (
      <div className="center-col">
        <div className="big-emoji">🫂</div>
        <h3>Вы вошли. Вы всегда были внутри.</h3>
        <button
          className="btn btn-orange"
          onClick={() => {
            app.closeModal()
            go('/dashboard')
          }}
        >
          В личный кабинет →
        </button>
      </div>
    )
  if (phase === 'loading')
    return (
      <div className="center-col">
        <div className="spinner" />
        {steps.slice(0, step + 1).map((s, i) => (
          <div key={i} className={i === step ? '' : 'muted'}>
            {i < step ? '✓ ' : ''}
            {s}
          </div>
        ))}
      </div>
    )
  const methods = ['✨ Войти через ауру', '😴 Войти через сон', '🤖 Войти через AI', '🧘 Войти через внутренний покой', '🔁 Войти через «Войти»', '🍪 Войти через принятые куки']
  return (
    <div className="login-grid">
      <p className="muted">Никаких паролей — только вайбы. Это пародия: ничего никуда не отправляется.</p>
      {methods.map((m) => (
        <button key={m} className="btn btn-outline btn-block slop-shadow" onClick={() => setPhase('loading')}>
          {m}
        </button>
      ))}
      <p className="muted small">Нажимая на кнопку, вы соглашаетесь с тем, что нажали на кнопку.</p>
    </div>
  )
}
