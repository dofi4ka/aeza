import { useApp, useTick } from '../state'
import { mulberry32, walk } from '../lib/rand'
import { PageHero } from '../components/PageHero'
import { BarChart, Gauge, Heatmap, LineChart, PieChart, Radar, Scatter, Sparkline } from '../components/Charts'
import { RateWidget } from '../components/Overlays'

const DAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

export default function Analytics() {
  const app = useApp()
  const t = useTick(700)
  const r = mulberry32(2026)
  const heat = DAYS.map(() => Array.from({ length: 24 }, () => r()))
  const scatter = Array.from({ length: 40 }, () => {
    const x = r()
    return { x, y: Math.min(1, Math.max(0, 0.95 - Math.abs(x - 0.5) * 0.2 + (r() - 0.5) * 0.15)), r: 2 + r() * 5 }
  })
  const kpis = [
    { k: '+∞%', d: 'Рост синергии YoY' },
    { k: '−0%', d: 'Снижение неудач' },
    { k: '42', d: 'Ответ на главный вопрос' },
    { k: `${1337 + t}`, d: 'Раз мы сказали «AI» (live)' },
    { k: '7000', d: 'МБ/с, просто красивое число' },
    { k: '100%', d: 'Аптайм кнопки «Попробовать»' },
  ]
  return (
    <>
      <PageHero emoji="📊" title="Аналитика синергии" sub="Дашборд бессмысленных метрик нового поколения. Каждый график проверен нейросетью и признан «очень убедительным». 📈📉📈" badges={['AI', 'LIVE', 'KMI']} />
      <section className="container section">
        <div className="kpi-row">
          {kpis.map((x) => (
            <div key={x.d} className="kpi slop-border">
              <b className="grad-text">{x.k}</b>
              <span className="muted small">{x.d}</span>
            </div>
          ))}
        </div>
        <div className="analytics-grid">
          <div className="panel slop-border span2">
            <h4>Пинг vs фазы Луны 🌕</h4>
            <LineChart
              series={[
                { name: 'Пинг, мс', data: walk(28, 1, 40, 10), color: 'var(--accent)' },
                { name: 'Фаза Луны', data: walk(28, 1, 40, 10).map((v) => v + 6), color: '#7c3aed' },
              ]}
              labels={['1 нед', '2 нед', '3 нед', '4 нед']}
            />
            <p className="muted small">Корреляция 0.99. Значит, Луна влияет на пинг. Или пинг на Луну.</p>
          </div>
          <div className="panel slop-border">
            <h4>Индекс нового поколения</h4>
            <Gauge value={137} label="Норма: 100%. У нас: больше" />
          </div>
          <div className="panel slop-border">
            <h4>Синергия по дням недели</h4>
            <BarChart data={DAYS.map((d, i) => ({ label: d, value: 60 + ((i * 37) % 40) }))} suffix="%" />
          </div>
          <div className="panel slop-border">
            <h4>Из чего состоит сервер</h4>
            <PieChart
              data={[
                { label: 'Сервер', value: 97, color: 'var(--accent)' },
                { label: 'NVMe', value: 2, color: '#111' },
                { label: 'Магия', value: 1, color: '#7c3aed' },
              ]}
            />
          </div>
          <div className="panel slop-border">
            <h4>Радар компетенций сервера</h4>
            <Radar axes={['Скорость', 'Скорость', 'Ещё скорость', 'Эмпатия', 'NVMe', 'NVMe']} values={[95, 95, 99, 60, 100, 100]} />
          </div>
          <div className="panel slop-border span2">
            <h4>Тепловая карта инноваций 🔥 (по часам)</h4>
            <Heatmap rows={DAYS} cols={24} data={heat} />
            <p className="muted small">Пик инноваций — во вторник в 3 часа ночи. Совпадение? Нейросеть думает, что нет.</p>
          </div>
          <div className="panel slop-border">
            <h4>Корреляция цены и счастья</h4>
            <Scatter points={scatter} />
            <p className="muted small">Счастье стабильно высокое при любой цене. Это и есть синергия.</p>
          </div>
          <div className="panel slop-border span2">
            <h4>Прогноз аптайма до 2077 года</h4>
            <LineChart series={[{ name: 'Аптайм, %', data: Array.from({ length: 50 }, () => 100), color: 'var(--green)' }]} min={90} max={101} labels={['2026', '2040', '2055', '2077']} />
            <p className="muted small">Линия прямая, потому что мы уверены.</p>
          </div>
          <div className="panel slop-border">
            <h4>Количество графиков на этой странице</h4>
            <BarChart data={[{ label: 'было', value: 1 }, { label: 'стало', value: 10 }, { label: 'надо', value: 100 }]} />
          </div>
          <div className="panel slop-border">
            <h4>Live: биение сердца дата-центра</h4>
            <Sparkline data={Array.from({ length: 40 }, (_, i) => 50 + Math.sin((i + t) * 0.9) * (i % 8 === 0 ? 40 : 8))} color="#ef4444" height={70} />
          </div>
          <div className="panel slop-border center-col">
            <h4>Не нашли нужный график?</h4>
            <button className="btn btn-orange" onClick={() => app.openChat('Нарисуй график синергии')}>
              Попросить AI нарисовать ✨
            </button>
          </div>
        </div>
        <RateWidget what="графики" />
      </section>
    </>
  )
}
