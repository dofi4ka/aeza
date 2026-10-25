import { useState } from 'react'
import { useApp } from '../state'
import { TESTIMONIALS } from '../lib/data'
import { slopParagraph } from '../lib/slop'
import { PageHero } from '../components/PageHero'
import { SectionTitle } from '../components/ui'
import { RateWidget } from '../components/Overlays'

const TIMELINE = [
  ['2021', 'Основание', 'Мы основали компанию.'],
  ['2022', 'Основание (ещё раз)', 'Мы основали компанию снова — на всякий случай.'],
  ['2023', 'Добавили NVMe', 'Все серверы стали быстрыми.'],
  ['2024', 'Добавили ещё NVMe', 'Все серверы стали быстрыми быстрыми.'],
  ['2025', 'Добавили AI', 'Серверы начали думать.'],
  ['2026', 'Добавили AI в AI', 'Серверы начали думать о том, что думают.'],
  ['2027', 'Станем AI', 'Компания будет полностью сгенерирована. Этот таймлайн тоже.'],
]

const TEAM = [
  { e: '🤖', n: 'CEO', r: 'AI, отвечает за видение' },
  { e: '🤖', n: 'CTO', r: 'AI, отвечает за видение видения' },
  { e: '🖥️', n: 'Сервер №1', r: 'Сотрудник месяца 14 месяцев подряд' },
  { e: '🐈', n: 'Кот', r: 'Head of Warmth, дата-центр Хельсинки' },
  { e: '🧑‍🔧', n: 'Алексей', r: 'Единственный человек. Мы его бережём' },
  { e: '🟧', n: 'Кнопка «Попробовать»', r: 'Chief Conversion Officer' },
]

const VALUES = ['Синергия', 'Синергия', 'Ещё раз синергия', 'Оранжевость', 'NVMe', 'Бесшовность']

export default function About() {
  const app = useApp()
  const [bugs, setBugs] = useState(0)
  const spawnBug = () => {
    const b = document.createElement('span')
    b.className = 'crawl-bug'
    b.textContent = '🐛'
    b.style.top = `${20 + Math.random() * 60}vh`
    document.body.appendChild(b)
    setTimeout(() => b.remove(), 6000)
    setBugs((x) => x + 1)
    app.award('bug', 'Нашёл баг. Это фича', 20)
    app.toast('Баг найден! Он ползёт по экрану. Это фича 🐛', '🐛')
  }
  return (
    <>
      <PageHero emoji="🏢" title="О компании" sub="Мы — это мы. Наша миссия — это миссия. Наше видение — видеть. Наши ценности — ценить. 🤝" badges={['EST. 2021', 'EST. 2022']} />
      <section className="container section grid-2">
        <div className="prose">
          <h3>Наша история</h3>
          <p>{slopParagraph('about-1', 3)}</p>
          <p>{slopParagraph('about-2', 2)}</p>
        </div>
        <div className="panel slop-border">
          <h3>Ценности</h3>
          <div className="values">
            {VALUES.map((v, i) => (
              <span key={i} className="value-chip">
                {v}
              </span>
            ))}
          </div>
          <h3 className="mt24">Миссия</h3>
          <p className="muted">Наша миссия — это миссия. Наша миссия на 2027 год — миссия 2.0.</p>
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Таймлайн нового поколения" />
        <div className="timeline">
          {TIMELINE.map(([y, t, d]) => (
            <div key={y} className="tl-item">
              <span className="tl-year">{y}</span>
              <div className="tl-card slop-border">
                <b>{t}</b>
                <p className="muted">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Команда" sub="Нас 6. Из них 1 человек." />
        <div className="team-grid">
          {TEAM.map((m) => (
            <div key={m.n} className="team slop-hover">
              <span className="team-ava">{m.e}</span>
              <b>{m.n}</b>
              <span className="muted small">{m.r}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="container section" id="bugs">
        <div className="bug-bounty">
          <div>
            <h2>Bug Bounty 🐛</h2>
            <p>Нашли баг? Это фича. Нашли фичу? Это баг. Вознаграждение — до ∞ синергобаллов.</p>
            <p className="muted small">Найдено багов в этой сессии: {bugs}</p>
          </div>
          <button className="btn btn-orange btn-lg" onClick={spawnBug}>
            Сообщить о баге
          </button>
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Отзывы (208)" sub="А вот и они." />
        <div className="grid-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.who} className="testi slop-border">
              <div className="testi-head">
                <span className="testi-ava">{t.avatar}</span>
                <div>
                  <b>{t.who}</b>
                  <div className="muted small">{t.role}</div>
                </div>
              </div>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
        <RateWidget what="компанию" />
      </section>
    </>
  )
}
