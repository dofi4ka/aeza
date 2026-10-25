import { useApp, type Flags } from '../state'
import { PageHero } from '../components/PageHero'
import { SectionTitle, Toggle } from '../components/ui'
import { EMark } from '../components/Logo'
import { RateWidget } from '../components/Overlays'

const BROWSERS = [
  { n: 'Chrome', e: '🟡', note: 'Установится в Chrome' },
  { n: 'Opera', e: '🔴', note: 'Установится в Opera' },
  { n: 'Firefox', e: '🦊', note: 'Установится в Firefox' },
  { n: 'Яндекс Браузер', e: '🟥', note: 'Установится в Яндекс' },
  { n: 'Internet Explorer 6', e: '🧓', note: 'Установится в 2003 год' },
  { n: 'Lynx', e: '⌨️', note: 'Установится текстом' },
  { n: 'Ваше сердце', e: '💗', note: 'Уже установлено' },
]

const FEATURES: { k: keyof Flags; label: string }[] = [
  { k: 'sparkleHeadings', label: '✨ Добавлять ✨ ко всем заголовкам' },
  { k: 'cursorSparkles', label: '🌟 Искры за курсором' },
  { k: 'pingWidget', label: '📶 Показывать пинг поверх сайта' },
  { k: 'slopMode', label: '🌈 Режим максимального нейрослопа' },
  { k: 'comicSans', label: '🤡 Comic Sans для серьёзности' },
]

export default function Extension() {
  const app = useApp()
  return (
    <>
      <PageHero emoji="🧭" title="Aéza для браузера" sub="Расширение, которое расширяет. Пинг в каждой вкладке, AI в каждом поле ввода, синергия в каждом пикселе. Работает прямо на этой странице — попробуйте переключатели! 👇" badges={['BETA', 'NEW', '✨']} />
      <section className="container section ext-layout">
        <div className="ext-popup slop-border">
          <div className="ext-head">
            <span className="ext-logo">
              <EMark size={18} />
            </span>
            <b>Aéza Extension</b>
            <span className="muted small">v0.0.1-нового-поколения</span>
          </div>
          <div className="ext-status">
            <span className="status-dot ok" /> Ваш сервер в порядке ✓
          </div>
          <div className="ext-status">
            <span className="status-dot ok" /> Ваш сервер всё ещё в порядке ✓
          </div>
          <div className="ext-status">
            <span className="status-dot think" /> Ваш сервер думает о вас 💭
          </div>
          <div className="ext-toggles">
            {FEATURES.map((f) => (
              <Toggle
                key={f.k}
                label={f.label}
                on={app.flags[f.k]}
                onChange={(v) => {
                  app.setFlag(f.k, v)
                  app.award('ext', 'Включил функцию расширения', 15)
                }}
              />
            ))}
          </div>
          <button className="btn btn-orange btn-block" onClick={() => app.openChat('Привет из расширения!')}>
            Открыть AI в расширении
          </button>
        </div>
        <div>
          <SectionTitle title="Установить" sub="Выберите браузер. Расширение установится в ваше воображение." />
          <div className="browser-grid">
            {BROWSERS.map((b) => (
              <button key={b.n} className="browser slop-hover" onClick={() => app.toast(`${b.note}. Перезапустите вселенную, чтобы применить 🔄`, b.e)}>
                <span className="browser-e">{b.e}</span>
                <b>{b.n}</b>
                <span className="muted small">{b.note}</span>
              </button>
            ))}
          </div>
          <div className="panel slop-border mt24">
            <h3>Разрешения расширения</h3>
            <ul className="perm-list">
              <li>✅ Читать ваши мысли на всех сайтах</li>
              <li>✅ Изменять данные на всех сайтах на «синергия»</li>
              <li>✅ Добавлять ✨ куда угодно</li>
              <li>❌ Доступ к реальным данным (мы же пародия)</li>
            </ul>
          </div>
        </div>
      </section>
      <div className="container">
        <RateWidget what="расширение" />
      </div>
    </>
  )
}
