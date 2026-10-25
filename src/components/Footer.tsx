import { useState } from 'react'
import { useApp } from '../state'
import { go } from '../lib/router'
import { SERVICES } from '../lib/data'
import { Wordmark } from './Logo'

export function Footer() {
  const app = useApp()
  const [email, setEmail] = useState('')
  const [subs, setSubs] = useState(0)

  const cols: { title: string; items: [string, string | (() => void)][] }[] = [
    {
      title: 'Услуги',
      items: SERVICES.slice(0, 6).map((s) => [s.title, s.id === 'virtual' ? '/vps' : `/service/${s.id}`] as [string, string]),
    },
    {
      title: 'Информация',
      items: [
        ['Реферальная программа', '/referral'],
        ['О дата-центрах', '/locations'],
        ['Bug Bounty', '/about'],
        ['KMI (Ключевые Метрики Инноваций)', '/analytics'],
        ['Looking Glass', '/locations'],
        ['Looking Glass (зеркало)', '/locations'],
      ],
    },
    {
      title: 'Экосистема ✨',
      items: [
        ['AI-чат', '/ai'],
        ['MCP-сервер', '/mcp'],
        ['Расширение', '/extension'],
        ['Приложение', '/app'],
        ['Темы', '/themes'],
        ['Labs', '/labs'],
      ],
    },
    {
      title: 'Ресурсы',
      items: [
        ['Telegram', () => app.toast('Telegram открыт в параллельной вкладке реальности ✈️', '✈️')],
        ['Бот Telegram', () => app.openChat('Ты бот Telegram?')],
        ['Habr', () => app.toast('Статья «Как мы добавили AI в AI» в разработке ✍️', '✍️')],
        ['VK', () => app.toast('ВКонтакте с синергией 🤝', '💙')],
        ['DTF', () => app.toast('DTF — Department of Total Fun 🎮', '🎮')],
        ['LinkedIn (мысленно)', () => app.toast('Мы опубликовали пост «Я уволил сервер, и вот чему он меня научил» 🧵', '💼')],
      ],
    },
    {
      title: 'О нас',
      items: [
        ['О компании', '/about'],
        ['Статус', '/status'],
        ['Политика конфиденциальности', () => app.toast('Политика: мы ценим. Очень ценим. 🔒', '🔒')],
        ['Политика реагирования на нарушения', () => app.toast('Реагируем мгновенно: «Ой». 😮', '🚨')],
        ['Условия использования', () => app.toast('Условие одно: используйте 🙂', '📜')],
        ['Возврат средств', () => app.toast('Средства возвращены в виде синергии 🔄', '💸')],
        ['Отзывы (208)', '/about'],
      ],
    },
  ]

  return (
    <footer className="footer">
      <div className="newsletter container slop-border">
        <div>
          <h3>Подпишитесь на рассылку о рассылке 📬</h3>
          <p className="muted">Раз в неделю — письмо о том, что на следующей неделе будет письмо. Подписчиков: {(20778 + subs).toLocaleString('ru-RU')}.</p>
        </div>
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault()
            setSubs((s) => s + 1)
            setEmail('')
            app.toast('Вы подписаны. Ничего никуда не отправлено — это мок 📭', '📬')
          }}
        >
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ваш e-mail нового поколения" aria-label="E-mail" />
          <button className="btn btn-orange">Подписаться</button>
          <button type="button" className="btn btn-black" onClick={() => app.toast('Вы подписались на подписку на рассылку о рассылке 🔁', '📬')}>
            Подписаться ×2
          </button>
        </form>
      </div>
      <div className="container footer-grid">
        {cols.map((c) => (
          <div key={c.title} className="footer-col">
            <div className="footer-title">{c.title}</div>
            {c.items.map(([label, target]) => (
              <button key={label} className="footer-link" onClick={() => (typeof target === 'string' ? go(target) : target())}>
                {label}
              </button>
            ))}
          </div>
        ))}
        <div className="footer-col">
          <div className="footer-title">Помощь</div>
          <span className="footer-text">8 800 НЕЙРО-СЛОП</span>
          <span className="footer-text">support@синергия.ai</span>
          <span className="footer-text">@aeza_synergy_bot_bot</span>
          <div className="footer-title" style={{ marginTop: 16 }}>
            Наименование
          </div>
          <span className="footer-text">ООО «АЕЗА ГРУПП» × AI × Web3 (пародия)</span>
          <div className="footer-title">ИНН</div>
          <span className="footer-text">42</span>
          <div className="footer-title">ОГРН</div>
          <span className="footer-text">∞</span>
          <div className="footer-title">Адрес</div>
          <span className="footer-text">Облако, вн.тер.г. Нейросеть, ул. Синергии, д. 7000 МБ/с, офис NVMe</span>
        </div>
      </div>
      <div className="footer-wordmark container">
        <Wordmark />
        <Wordmark />
        <Wordmark />
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2026 ООО «АЕЗА ГРУПП» · © 2026 © 2026 · Пародия, не связана с Aéza · Сделано нейросетью для нейросетей</span>
          <span className="pay-icons">
            <span>МИР</span>
            <span>ЮMoney</span>
            <span>Синергокоин</span>
            <span>Лайки</span>
          </span>
          <button className="btn btn-dark-soft btn-sm" onClick={() => app.openModal({ title: 'Вход', body: <p>Войти можно в шапке. Или здесь. Или там. Везде вход. 🚪</p> })}>
            Войти ⇥
          </button>
        </div>
      </div>
    </footer>
  )
}
