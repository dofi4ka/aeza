import { mulberry32 } from '../lib/rand'
import { PageHero } from '../components/PageHero'
import { SectionTitle } from '../components/ui'

const COMPONENTS = ['Виртуальные серверы', 'Виртуальные серверы (ещё раз)', 'Панель управления', 'AI', 'AI для AI', 'Кнопка «Попробовать»', 'Тень под кнопкой «Попробовать»', 'Синергия', 'Синергия (резервная)', 'Эта страница статуса', 'Статус страницы статуса']

const INCIDENTS = [
  { d: '25 октября 2026', t: 'Сервер был слишком быстрым', r: 'Добавили анимацию загрузки, чтобы пользователи успевали порадоваться.' },
  { d: '19 октября 2026', t: 'AI ответил без эмодзи', r: 'Модель переобучена. Эмодзи восстановлены в полном объёме. 🎉✨🚀' },
  { d: '12 октября 2026', t: 'Пинг 0 мс вызвал беспокойство', r: 'Пинг повышен до 0.1 мс для правдоподобия.' },
  { d: '1 октября 2026', t: 'Кнопка «Попробовать» стала недостаточно оранжевой', r: 'Оранжевость возвращена до #ff7a00.' },
]

export default function Status() {
  const r = mulberry32(7)
  return (
    <>
      <PageHero emoji="🟢" title="Все системы работают" sub="Все системы работают. Все системы работают стабильно. Все системы работают стабильно стабильно. Инцидентов за 90 дней: 0 (мы не смотрели)." badges={['100%', '99.999%', '∞']} />
      <section className="container section">
        <div className="status-banner">
          <span className="status-dot ok big" /> Всё отлично. Всё ещё отлично. Обновлено только что (и всегда).
        </div>
        <div className="status-list">
          {COMPONENTS.map((c, ci) => (
            <div key={c} className="status-row slop-border">
              <div className="row between">
                <b>{c}</b>
                <span className="status-ok">Работает{ci % 3 === 2 ? ' стабильно' : ''}</span>
              </div>
              <div className="uptime-bars">
                {Array.from({ length: 90 }, (_, i) => {
                  const odd = r() > 0.985
                  return <i key={i} className={odd ? 'think' : ''} title={odd ? 'Сервер задумался (1 мин)' : `День ${i + 1}: всё отлично`} />
                })}
              </div>
              <div className="row between muted small">
                <span>90 дней назад</span>
                <span>Аптайм 100.00% (округлили с оптимизмом)</span>
                <span>Сегодня</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="История инцидентов" sub="Не инциденты, а возможности для роста." />
        <div className="incident-list">
          {INCIDENTS.map((i) => (
            <div key={i.t} className="incident slop-border">
              <span className="muted small">{i.d}</span>
              <b>{i.t}</b>
              <p>
                <span className="badge badge-new">Решено</span> {i.r}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
