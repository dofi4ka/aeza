import { useState } from 'react'
import { useApp } from '../state'
import { THEMES } from '../lib/data'
import { PageHero } from '../components/PageHero'
import { SectionTitle } from '../components/ui'
import { Wordmark } from '../components/Logo'
import { confetti } from '../lib/confetti'

const AI_NAMES = ['Закат над NVMe', 'Синергичный рассвет', 'Оранжевая меланхолия', 'Корпоративный дзен', 'Нейронный персик', 'Тыква нового поколения']

export default function Themes() {
  const app = useApp()
  const [ai, setAi] = useState<string | null>(null)
  const generate = () => {
    const h = Math.floor(Math.random() * 360)
    const root = document.documentElement
    root.dataset.theme = 'light'
    root.style.setProperty('--accent', `hsl(${h} 95% 52%)`)
    root.style.setProperty('--peach', `hsl(${h} 100% 95%)`)
    root.style.setProperty('--peach-2', `hsl(${h} 100% 88%)`)
    const name = AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)]
    setAi(name)
    confetti(50)
    app.toast(`AI сгенерировал тему «${name}». Она почти как оранжевая.`, '🎨')
  }
  const reset = () => {
    const root = document.documentElement
    ;['--accent', '--peach', '--peach-2'].forEach((v) => root.style.removeProperty(v))
    setAi(null)
  }
  return (
    <>
      <PageHero emoji="🎨" title="Темы оформления" sub="8 тем на любой вкус. Все они в душе оранжевые. Выберите тему — тема выберет вас. 🎭" badges={['x8', 'NEW', 'AI']}>
        <div className="row gap8 wrap center mt16">
          <button className="btn btn-orange" onClick={generate}>
            ✨ Сгенерировать тему с AI
          </button>
          {ai && (
            <button className="btn btn-outline" onClick={reset}>
              Сбросить «{ai}»
            </button>
          )}
        </div>
      </PageHero>
      <section className="container section">
        <SectionTitle title="Галерея тем" sub={`Сейчас включена: «${THEMES.find((t) => t.id === app.theme)?.name ?? app.theme}»`} />
        <div className="theme-grid">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-card slop-hover ${app.theme === t.id ? 'active' : ''}`}
              onClick={() => {
                reset()
                app.setTheme(t.id)
              }}
            >
              <div className="theme-preview" style={{ background: t.swatch[0], color: t.swatch[3] }}>
                <Wordmark className="theme-mark" style={{ color: t.swatch[3] }} />
                <div className="theme-bars">
                  <i style={{ background: t.swatch[1] }} />
                  <i style={{ background: t.swatch[2] }} />
                  <i style={{ background: t.swatch[1] }} />
                </div>
                <span className="theme-btn" style={{ background: t.swatch[2], color: t.swatch[0] }}>
                  Попробовать
                </span>
              </div>
              <div className="theme-info">
                <b>{t.name}</b>
                <span className="muted small">{t.desc}</span>
                {app.theme === t.id && <span className="badge badge-new">ВКЛЮЧЕНА</span>}
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}
