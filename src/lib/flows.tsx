import { useApp } from '../state'
import { confetti } from './confetti'

type App = ReturnType<typeof useApp>

const STEPS = [
  { title: 'Вы уверены? 🤔', text: 'Вы собираетесь заказать', yes: 'Да, уверен' },
  { title: 'Абсолютно уверены? 🧐', text: 'Точно-точно хотите заказать', yes: 'Абсолютно' },
  { title: 'Окончательно? 😳', text: 'Это окончательное решение по поводу', yes: 'Окончательно!' },
  { title: 'Последний шанс передумать 🥺', text: 'Нейросеть волнуется за вас. Всё ещё хотите', yes: 'Хочу. Синергируй!' },
]

/** Оформление заказа нового поколения: 4 подтверждения, 0 бекенда. */
export function orderFlow(app: App, what: string, step = 0) {
  if (step >= STEPS.length) {
    app.closeModal()
    confetti(120)
    app.award('order', 'Заказал сервер в параллельной вселенной', 40)
    app.toast(`«${what}» заказан в параллельной вселенной. Счёт: 0 ₽ + синергия 🧾`, '✅')
    return
  }
  const s = STEPS[step]
  app.openModal({
    title: s.title,
    body: (
      <div className="prose">
        <p>
          {s.text} <b>«{what}»</b>?
        </p>
        <div className="progress-dots">
          {STEPS.map((_, i) => (
            <i key={i} className={i <= step ? 'on' : ''} />
          ))}
        </div>
        <p className="muted small">Шаг {step + 1} из {STEPS.length}. Это мок: деньги, серверы и обязательства не создаются.</p>
      </div>
    ),
    actions: [
      { label: s.yes, kind: 'orange', keepOpen: true, onClick: () => orderFlow(app, what, step + 1) },
      { label: 'Спросить AI', kind: 'peach', onClick: () => app.openChat(`Стоит ли заказывать «${what}»?`) },
      { label: 'Передумать', kind: 'ghost', onClick: () => app.toast('Вы передумали. Нейросеть передумала вместе с вами 🫂', '💭') },
    ],
  })
}
