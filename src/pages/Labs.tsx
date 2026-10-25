import { useState } from 'react'
import { useApp } from '../state'
import { PageHero } from '../components/PageHero'
import { Badge, SectionTitle, Toggle } from '../components/ui'
import { confetti } from '../lib/confetti'

const EXPERIMENTS = [
  { e: '⚛️', t: 'Квантовый пинг', d: 'Пинг измеряется до того, как вы отправили пакет.', b: 'BETA' },
  { e: '🖼️', t: 'NFT-серверы', d: 'Владейте JPEG-изображением сервера. Сам сервер — в комплект не входит.', b: 'WEB3' },
  { e: '🕶️', t: 'AR-дата-центр', d: 'Наденьте очки и смотрите на стойки у себя на кухне.', b: 'NEW' },
  { e: '🧬', t: 'ДНК-хранилище', d: 'Храним бэкапы в ДНК кота из дата-центра.', b: 'BETA' },
  { e: '🛰️', t: 'Орбитальный CDN', d: 'Контент доставляется с орбиты. Пинг: 1 виток.', b: 'СКОРО' },
  { e: '🌐', t: 'Метавселенная Aéza', d: 'Дата-центр в метавселенной. Уже 3 посетителя (все — мы).', b: 'WEB3' },
  { e: '🧠', t: 'Нейроинтерфейс', d: 'Перезагружайте сервер силой мысли. Пока работает только «выключить».', b: 'BETA' },
  { e: '🔮', t: 'Предиктивный аптайм', d: 'Мы знаем, что сервер упадёт, ещё до того, как он упадёт. Но не говорим.', b: 'AI' },
]

export default function Labs() {
  const app = useApp()
  const [on, setOn] = useState<boolean[]>(EXPERIMENTS.map(() => false))
  return (
    <>
      <PageHero emoji="🧪" title="Aéza Labs" sub="Экспериментальные функции, которые никогда не выйдут из беты. Включайте на свой страх и риск (риска нет, это пародия). 🧫" badges={['WEB3', 'BETA', 'AI', 'NFT', 'AR']} />
      <section className="container section">
        <div className="cube-stage" aria-hidden>
          <div className="cube">
            {['front', 'back', 'left', 'right', 'top', 'bottom'].map((f) => (
              <div key={f} className={`face ${f}`}>
                é
              </div>
            ))}
          </div>
        </div>
        <p className="center muted">↑ 3D-сервер в метавселенной. Крутится, потому что может.</p>
      </section>
      <section className="container section">
        <SectionTitle title="Эксперименты" sub="Каждая функция включается. Ни одна — ничего не делает." />
        <div className="labs-grid">
          {EXPERIMENTS.map((x, i) => (
            <div key={x.t} className={`lab slop-border ${on[i] ? 'on' : ''}`}>
              <div className="row between">
                <span className="lab-e">{x.e}</span>
                <Badge b={x.b} />
              </div>
              <h3>{x.t}</h3>
              <p className="muted">{x.d}</p>
              <Toggle
                on={on[i]}
                label={on[i] ? 'Включено (вы не заметите разницы)' : 'Выключено'}
                onChange={(v) => {
                  setOn((a) => a.map((y, k) => (k === i ? v : y)))
                  if (v) app.toast(`«${x.t}» включено. Разница: 0%. Синергия: +5%.`, x.e)
                }}
              />
            </div>
          ))}
        </div>
        <div className="center mt24">
          <button
            className="btn btn-orange btn-xl glow"
            onClick={() => {
              setOn(EXPERIMENTS.map(() => true))
              confetti(150)
              app.toast('Все эксперименты включены. Вселенная стабильна (пока).', '🧪')
            }}
          >
            Включить всё сразу
          </button>
        </div>
      </section>
    </>
  )
}
