import { useEffect, useRef, useState } from 'react'
import { useApp } from '../state'
import { go, Link } from '../lib/router'
import { SERVICES, TICKER, type Badge as BadgeT } from '../lib/data'
import { LogoSquare } from './Logo'
import { Badge, Marquee } from './ui'
import { LoginModalBody } from './Overlays'

export type NavItem = { to?: string; label: string; emoji?: string; badges?: (BadgeT | string)[]; action?: 'policy' | 'kb' }
export type NavGroup = { label: string; items: NavItem[]; promo?: string }

export const NAV: NavGroup[] = [
  {
    label: 'Услуги',
    promo: 'Все услуги теперь с AI. И без AI. Одновременно. ⚛️',
    items: SERVICES.map((s) => ({ to: s.id === 'virtual' ? '/vps' : `/service/${s.id}`, label: s.title, emoji: s.emoji, badges: s.badges })),
  },
  {
    label: 'Информация',
    promo: 'Информация — это не просто информация. Это данные с душой. 📊',
    items: [
      { to: '/referral', label: 'Реферальная программа', emoji: '🔺', badges: ['HOT'] },
      { to: '/locations', label: 'О дата-центрах', emoji: '🌍' },
      { to: '/locations', label: 'Looking Glass', emoji: '🔭' },
      { to: '/status', label: 'Статус', emoji: '🟢', badges: ['100%'] },
      { to: '/analytics', label: 'Аналитика синергии', emoji: '📈', badges: ['AI'] },
      { to: '/about', label: 'Bug Bounty', emoji: '🐛' },
      { label: 'База знаний', emoji: '📚', action: 'kb', badges: ['✨'] },
      { label: 'База знаний (ещё одна)', emoji: '📚', action: 'kb' },
    ],
  },
  {
    label: 'О нас',
    promo: 'Мы — это мы. И немного вы. 🤝',
    items: [
      { to: '/about', label: 'О компании', emoji: '🏢' },
      { to: '/about', label: 'Отзывы (208)', emoji: '⭐' },
      { to: '/about', label: 'Отзывы об отзывах (1)', emoji: '⭐' },
      { label: 'Политика конфиденциальности', emoji: '🔒', action: 'policy' },
      { label: 'Политика политики', emoji: '🔒', action: 'policy' },
    ],
  },
  {
    label: 'Экосистема ✨',
    promo: 'Экосистема из 6 продуктов, которые делают одно и то же. 🧩',
    items: [
      { to: '/ai', label: 'Aéza AI Чат', emoji: '🤖', badges: ['AI', 'NEW'] },
      { to: '/mcp', label: 'MCP-сервер', emoji: '🧩', badges: ['NEW'] },
      { to: '/extension', label: 'Расширение для браузера', emoji: '🧭', badges: ['BETA'] },
      { to: '/app', label: 'Мобильное приложение', emoji: '📱', badges: ['HOT'] },
      { to: '/themes', label: 'Темы оформления', emoji: '🎨', badges: ['x8'] },
      { to: '/labs', label: 'Aéza Labs', emoji: '🧪', badges: ['WEB3'] },
      { to: '/dashboard', label: 'Личный кабинет', emoji: '🗂️' },
    ],
  },
  {
    label: 'Ещё',
    promo: 'Ещё больше «Ещё». 🔁',
    items: [
      { to: '/labs', label: 'Ещё', emoji: '➕' },
      { to: '/labs', label: 'Ещё ещё', emoji: '➕' },
      { to: '/nowhere', label: 'Совсем ещё', emoji: '➕', badges: ['404'] },
      { to: '/analytics', label: 'Бессмысленные графики', emoji: '📉' },
    ],
  },
]

export function TopBar() {
  return (
    <div className="topbar">
      <Marquee items={TICKER} dark />
    </div>
  )
}

export function Header() {
  const app = useApp()
  const [open, setOpen] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [spin, setSpin] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const on = () => {
      setOpen(null)
      setDrawer(false)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const onLogo = () => {
    const c = clicks + 1
    setClicks(c)
    if (c >= 5) {
      setSpin(true)
      setClicks(0)
      app.award('logo', 'Покрутил логотип. Логотип покрутил вас', 30)
      setTimeout(() => setSpin(false), 1300)
    }
    go('/')
  }

  const runItem = (it: NavItem) => {
    if (it.action === 'policy') {
      app.openModal({
        title: 'Политика конфиденциальности 🔒',
        body: (
          <div className="prose">
            <p>Мы ценим вашу конфиденциальность. Очень ценим. Настолько ценим, что сгенерировали этот текст нейросетью.</p>
            <p>
              <b>1. Какие данные мы собираем?</b> Никакие. Это пародия, у нас даже бекенда нет. Но если бы был — мы бы собирали синергию.
            </p>
            <p>
              <b>2. Зачем?</b> Чтобы улучшать улучшения.
            </p>
            <p>
              <b>3. Как долго храним?</b> До перезагрузки вкладки. Это и есть вечность нового поколения.
            </p>
            <p>
              <b>4. Политика политики.</b> См. пункт 1. Затем пункт 1 ещё раз.
            </p>
          </div>
        ),
        actions: [{ label: 'Принять политику', kind: 'black' }, { label: 'Принять политику политики', kind: 'peach' }],
      })
    } else if (it.action === 'kb') {
      app.openModal({
        title: 'База знаний 📚',
        body: (
          <div className="prose">
            <p>Статья 1. Как перезагрузить сервер. — Выключите и включите. ✨</p>
            <p>Статья 2. Как перезагрузить сервер (подробно). — Выключите. Затем включите. ✨✨</p>
            <p>Статья 3. Как перезагрузить сервер с AI. — Попросите AI выключить и включить. ✨✨✨</p>
            <p>Статья 4. Что делать, если ничего не помогло. — Перечитайте статью 1.</p>
          </div>
        ),
        actions: [{ label: 'Спросить AI вместо чтения', kind: 'orange', onClick: () => app.openChat('Как перезагрузить сервер?') }],
      })
    } else if (it.to) go(it.to)
    setOpen(null)
    setDrawer(false)
  }

  const login = () =>
    app.openModal({
      title: 'Вход нового поколения 🔐',
      body: <LoginModalBody />,
    })

  return (
    <>
      <header className="header" onMouseLeave={() => (closeTimer.current = window.setTimeout(() => setOpen(null), 200))} onMouseEnter={() => clearTimeout(closeTimer.current)}>
        <div className="header-inner">
          <nav className="nav-left">
            <button className="burger" onClick={() => setDrawer(true)} aria-label="Меню">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6H4M20 12H4M20 18H4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
            </button>
            {NAV.map((g) => (
              <button key={g.label} className={`nav-link ${open === g.label ? 'active' : ''}`} onMouseEnter={() => setOpen(g.label)} onClick={() => setOpen(open === g.label ? null : g.label)}>
                {g.label}
              </button>
            ))}
          </nav>
          <div className="nav-center">
            <LogoSquare onClick={onLogo} spin={spin} />
          </div>
          <div className="nav-right">
            <button className="xp-pill slop-border" title="Ваш уровень нового поколения" onClick={() => app.openModal({ title: '🏆 Ваши достижения', body: <Achievements /> })}>
              <span>Ур. {app.level}</span>
              <span className="xp-bar">
                <i style={{ width: `${app.xp % 50 * 2}%` }} />
              </span>
              <span className="muted">{app.xp} XP</span>
            </button>
            <button className="icon-btn ask-ai" onClick={() => app.setPaletteOpen(true)} title="Спросить AI (Ctrl/⌘ + K)">
              ✨ <span className="kbd">⌘K</span>
            </button>
            <button className="icon-btn bell" onClick={() => app.openModal({ title: '🔔 Уведомления (99+)', body: <Notifications /> })} aria-label="Уведомления">
              🔔<span className="bell-dot">99+</span>
            </button>
            <button className="btn btn-black btn-sm" onClick={login}>
              {app.loggedIn ? 'Кабинет' : 'Войти'}
            </button>
            <button className="btn btn-outline btn-sm hide-sm" onClick={login}>
              Войти ещё раз
            </button>
          </div>
        </div>
        {open && (
          <div className="mega" onMouseEnter={() => clearTimeout(closeTimer.current)}>
            {NAV.filter((g) => g.label === open).map((g) => (
              <div key={g.label} className="mega-inner">
                <div className="mega-grid">
                  {g.items.map((it, i) => (
                    <button key={i} className="mega-item" onClick={() => runItem(it)}>
                      <span className="mega-emoji">{it.emoji}</span>
                      <span className="mega-label">{it.label}</span>
                      {it.badges?.map((b) => <Badge key={b} b={b} />)}
                    </button>
                  ))}
                </div>
                <div className="mega-promo">
                  <div className="mega-promo-glow" />
                  <p>{g.promo}</p>
                  <button className="btn btn-orange btn-sm" onClick={() => app.openChat(`Расскажи про раздел «${g.label}»`)}>
                    Спросить AI про «{g.label}» ✨
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </header>
      {drawer && (
        <div className="drawer-back" onClick={() => setDrawer(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <LogoSquare onClick={onLogo} />
              <button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Закрыть">
                ✕
              </button>
            </div>
            {NAV.map((g) => (
              <div key={g.label} className="drawer-group">
                <div className="drawer-title">{g.label}</div>
                {g.items.map((it, i) => (
                  <button key={i} className="drawer-item" onClick={() => runItem(it)}>
                    {it.emoji} {it.label}
                  </button>
                ))}
              </div>
            ))}
          </aside>
        </div>
      )}
    </>
  )
}

function Notifications() {
  const items = [
    '🔔 У вас новое уведомление',
    '🔔 У вас новое уведомление о новом уведомлении',
    '✨ AI прочитал ваше уведомление',
    '🖥️ Сервер synergy-prod-01 чувствует себя хорошо',
    '🖥️ Сервер synergy-prod-01-copy тоже',
    '💸 Баланс пополнен на 0 ₽ (синергия +5)',
    '🧡 Кнопка «Попробовать» соскучилась',
    '🔔 Уведомлений: 99+. Это уведомление №100.',
  ]
  return (
    <div className="notif-list">
      {items.map((t, i) => (
        <div key={i} className="notif slop-border">
          <span>{t}</span>
          <span className="muted small">{i + 1} мин. назад</span>
        </div>
      ))}
    </div>
  )
}

function Achievements() {
  const app = useApp()
  const all = [
    ['scroll', 'Прокрутил страницу'],
    ['cookie', 'Принял куки'],
    ['cookie3', 'Принял принятие куки'],
    ['chat', 'Открыл AI-чат'],
    ['theme', 'Сменил тему'],
    ['logo', 'Покрутил логотип (5 кликов)'],
    ['palette', 'Открыл ⌘K'],
    ['order', 'Заказал сервер в параллельной вселенной'],
    ['mcp', 'Вызвал MCP-инструмент'],
    ['ext', 'Включил функцию расширения'],
    ['server', 'Создал сервер'],
    ['meditate', 'Помедитировал с сервером'],
    ['bug', 'Нашёл баг (это фича)'],
    ['stars', 'Поставил 5 звёзд'],
  ]
  return (
    <div className="ach-grid">
      {all.map(([id, t]) => {
        const has = app.achievements.includes(id)
        return (
          <div key={id} className={`ach slop-border ${has ? 'has' : ''}`}>
            <span className="ach-icon">{has ? '🏆' : '🔒'}</span>
            <span>{t}</span>
          </div>
        )
      })}
      <p className="muted small" style={{ gridColumn: '1 / -1' }}>
        Всего XP: {app.xp}. Уровень: {app.level}. Следующий уровень открывает следующий уровень.
      </p>
    </div>
  )
}

export { Link }
