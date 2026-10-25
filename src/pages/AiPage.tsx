import { useApp } from '../state'
import { ChatPanel } from '../components/AiChat'

const HISTORY = [
  'Как перезагрузить сервер',
  'Как перезагрузить сервер (2)',
  'Как перезагрузить сервер (финал)',
  'Как перезагрузить сервер (финал) (2)',
  'Что такое синергия',
  'Что такое синергия на самом деле',
  'Почему кнопка оранжевая',
  'Напиши стих про NVMe',
  'Новый чат',
  'Новый чат',
  'Новый чат',
]

export default function AiPage() {
  const app = useApp()
  return (
    <div className="ai-page container">
      <aside className="ai-side slop-border">
        <button className="btn btn-orange btn-block" onClick={() => app.toast('Новый чат создан. Он такой же, как старый ✨', '💬')}>
          + Новый чат
        </button>
        <button className="btn btn-peach btn-block" onClick={() => app.toast('Ещё один новый чат создан ✨✨', '💬')}>
          + Ещё новее чат
        </button>
        <div className="ai-hist-title muted small">Сегодня</div>
        {HISTORY.slice(0, 4).map((h, i) => (
          <button key={i} className="ai-hist" onClick={() => app.toast(`Чат «${h}» загружен из облака воспоминаний`, '🗂️')}>
            {h}
          </button>
        ))}
        <div className="ai-hist-title muted small">Вчера</div>
        {HISTORY.slice(4).map((h, i) => (
          <button key={i} className="ai-hist" onClick={() => app.toast(`Чат «${h}» загружен из облака воспоминаний`, '🗂️')}>
            {h}
          </button>
        ))}
        <div className="ai-plan slop-border">
          <b>Aéza AI Plus Plus</b>
          <p className="small muted">Те же ответы, но быстрее появляются эмодзи.</p>
          <button className="btn btn-black btn-sm btn-block" onClick={() => app.toast('Подписка оформлена в вашем воображении 💭', '⭐')}>
            Оформить за 0 ₽
          </button>
        </div>
      </aside>
      <div className="ai-main">
        <div className="ai-hero">
          <h1>
            Aéza AI <span className="grad-text">нового поколения</span>
          </h1>
          <p className="muted">Ассистент, который отвечает уверенно. Всегда. На всё. Одинаково.</p>
          <div className="ai-stats">
            <span>🧠 175 трлн параметров (примерно)</span>
            <span>⚡ 7000 МБ/с мыслей</span>
            <span>🎯 Точность: «Отличный вопрос!»</span>
            <span>🌡️ Температура: 36.6</span>
          </div>
        </div>
        <ChatPanel mode="page" />
      </div>
    </div>
  )
}
