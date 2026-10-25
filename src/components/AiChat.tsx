import { useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from '../state'
import { aiAnswer, THINKING } from '../lib/slop'
import { go } from '../lib/router'
import { Rich } from './ui'
import { EMark } from './Logo'

type Msg = { id: number; role: 'user' | 'ai'; text: string; thinking?: string; done?: boolean }

export const MODELS = ['Aéza-GPT 5.5 Ultra', 'Aéza-GPT 5.5 Ultra Pro', 'Aéza-GPT 5.5 Ultra Pro Max', 'Aéza-Nano (думает дольше)', 'Aéza-GPT 2 (младший брат)', 'Случайная модель 🎲']

const SUGGEST = ['Какой сервер мне выбрать?', 'Сколько стоит VPS?', 'Ты живой?', 'Расскажи анекдот про NVMe', 'Какой у меня пинг?', 'Это настоящий сайт?']

function useChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, role: 'ai', text: 'Здравствуйте! 👋 Я — **Aéza AI**, ассистент нового поколения нового поколения.\nЗадайте мне любой вопрос — я отвечу на любой другой. ✨', done: true },
  ])
  const timers = useRef<number[]>([])
  const idRef = useRef(1)
  const busy = msgs.some((m) => m.role === 'ai' && !m.done)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const respond = useCallback((q: string, slow: boolean) => {
    const id = idRef.current++
    const answer = aiAnswer(q)
    const stages = [...THINKING].sort(() => Math.random() - 0.5).slice(0, slow ? 5 : 3)
    setMsgs((m) => [...m, { id, role: 'ai', text: '', thinking: stages[0] }])
    stages.forEach((s, i) => later(() => setMsgs((m) => m.map((x) => (x.id === id ? { ...x, thinking: s } : x))), i * (slow ? 900 : 550)))
    const start = stages.length * (slow ? 900 : 550)
    let pos = 0
    const type = () => {
      pos = Math.min(answer.length, pos + 2 + Math.floor(Math.random() * 4))
      const done = pos >= answer.length
      setMsgs((m) => m.map((x) => (x.id === id ? { ...x, thinking: undefined, text: answer.slice(0, pos), done } : x)))
      if (!done) later(type, 16)
    }
    later(type, start)
  }, [])

  const send = useCallback(
    (q: string, slow = false) => {
      const text = q.trim()
      if (!text) return
      setMsgs((m) => [...m, { id: idRef.current++, role: 'user', text, done: true }])
      respond(text, slow)
    },
    [respond],
  )

  const msgsRef = useRef(msgs)
  msgsRef.current = msgs

  const regenerate = useCallback(
    (id: number) => {
      const m = msgsRef.current
      const idx = m.findIndex((x) => x.id === id)
      const q = [...m.slice(0, idx)].reverse().find((x) => x.role === 'user')?.text ?? 'Синергия'
      respond(q, false)
    },
    [respond],
  )

  const clear = () => setMsgs((m) => m.slice(0, 1))
  return { msgs, send, busy, clear, regenerate }
}

export function ChatPanel({ mode, onClose }: { mode: 'float' | 'page'; onClose?: () => void }) {
  const app = useApp()
  const { msgs, send, busy, clear, regenerate } = useChat()
  const [input, setInput] = useState('')
  const [model, setModel] = useState(MODELS[0])
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [msgs])

  useEffect(() => {
    if (mode === 'float' && app.chatPrefill && !busy) {
      send(app.chatPrefill)
      app.consumePrefill()
    }
  }, [mode, app.chatPrefill])

  const submit = () => {
    if (busy) return app.toast('Подождите, нейросеть ещё синергирует 🧠', '⏳')
    send(input, model.includes('Nano'))
    setInput('')
  }

  const copy = async (t: string) => {
    try {
      await navigator.clipboard.writeText(t)
      app.toast('Скопировано. Теперь у вас две синергии 📋', '📋')
    } catch {
      app.toast('Буфер обмена отказался принимать столько смысла 📋', '⚠️')
    }
  }

  return (
    <div className={`chat chat-${mode} slop-border`}>
      <div className="chat-head">
        <span className="chat-ava">
          <EMark size={18} />
        </span>
        <div className="chat-title">
          <b>Aéza AI ✨</b>
          <span className="chat-status">
            <i className="dot-live" /> {busy ? 'печатает… думает… печатает…' : 'онлайн · думает о вас'}
          </span>
        </div>
        <select className="chat-model" value={model} onChange={(e) => setModel(e.target.value)} aria-label="Модель">
          {MODELS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <button className="icon-btn" title="Озвучить" onClick={() => app.toast('Озвучка: «ммм… синергия…» 🔊', '🔊')}>
          🔊
        </button>
        <button className="icon-btn" title="Очистить" onClick={clear}>
          🗑
        </button>
        {mode === 'float' && (
          <>
            <button
              className="icon-btn"
              title="Развернуть"
              onClick={() => {
                onClose?.()
                go('/ai')
              }}
            >
              ⤢
            </button>
            <button className="icon-btn" title="Закрыть" onClick={onClose}>
              ✕
            </button>
          </>
        )}
      </div>
      <div className="chat-list" ref={listRef}>
        {msgs.map((m) => (
          <div key={m.id} className={`msg msg-${m.role}`}>
            {m.role === 'ai' && <span className="msg-ava">✨</span>}
            <div className="msg-bubble">
              {m.thinking ? (
                <span className="thinking">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  {m.thinking}
                </span>
              ) : (
                <Rich text={m.text} />
              )}
              {m.role === 'ai' && m.done && m.id !== 0 && (
                <div className="msg-tools">
                  <button onClick={() => app.toast('Спасибо! Нейросеть стала увереннее на 3% 💪', '👍')}>👍</button>
                  <button onClick={() => app.toast('Нейросеть приняла к сведению и проигнорировала 🙂', '👎')}>👎</button>
                  <button
                    onClick={() => {
                      regenerate(m.id)
                      app.toast('Регенерирую: ответ будет тем же, но с новым смыслом 🔁', '🔁')
                    }}
                  >
                    🔁
                  </button>
                  <button onClick={() => copy(m.text)}>📋</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-suggest">
        {SUGGEST.map((s) => (
          <button key={s} className="chip" onClick={() => !busy && send(s, model.includes('Nano'))}>
            {s}
          </button>
        ))}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <button type="button" className="icon-btn" title="Прикрепить" onClick={() => app.toast('Файл прикреплён к облаку надежд 📎', '📎')}>
          📎
        </button>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Спросите что угодно… или что-нибудь ещё" />
        <button type="button" className="icon-btn" title="Голос" onClick={() => app.toast('Слушаю… слышу синергию 🎙️', '🎙️')}>
          🎙️
        </button>
        <button className="btn btn-orange btn-sm" type="submit">
          ↑
        </button>
      </form>
      <div className="chat-foot">Aéza AI может ошибаться. Aéza AI может ошибаться. Проверяйте важную информацию. Проверяйте её ещё раз.</div>
    </div>
  )
}

export function AiFab() {
  const app = useApp()
  return (
    <>
      {app.chatOpen && <ChatPanel mode="float" onClose={app.closeChat} />}
      {!app.chatOpen && (
        <div className="fab-stack">
          <button className="fab fab-2" onClick={() => app.openChat('Привет, младший брат!')} title="Ещё один AI">
            🤖
          </button>
          <button className="fab" onClick={() => app.openChat()}>
            <span className="fab-glow" />✨ Aéza AI
          </button>
        </div>
      )}
    </>
  )
}
