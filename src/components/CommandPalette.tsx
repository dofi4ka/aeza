import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../state'
import { go } from '../lib/router'
import { confetti } from '../lib/confetti'
import { THEMES } from '../lib/data'
import { NAV } from './Header'

type Cmd = { label: string; hint: string; run: () => void }

export function CommandPalette() {
  const app = useApp()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        app.setPaletteOpen(!app.paletteOpen)
      }
      if (e.key === 'Escape') app.setPaletteOpen(false)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [app])

  useEffect(() => {
    if (app.paletteOpen) {
      setQ('')
      setSel(0)
      app.award('palette', 'Открыл ⌘K. Теперь вы power-user синергии', 15)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [app.paletteOpen])

  const cmds = useMemo<Cmd[]>(() => {
    const pages: Cmd[] = NAV.flatMap((g) => g.items.filter((i) => i.to).map((i) => ({ label: `${i.emoji ?? ''} ${i.label}`, hint: g.label, run: () => go(i.to!) })))
    const actions: Cmd[] = [
      { label: '🎉 Сгенерировать синергию', hint: 'Действие', run: () => (confetti(), app.toast('Синергия сгенерирована: 1 шт. 🤝', '🎉')) },
      { label: '🔄 Перезагрузить интернет', hint: 'Действие', run: () => app.toast('Интернет перезагружен. Вы не заметили? Так и задумано.', '🔄') },
      { label: '🧠 Спросить AI о смысле жизни', hint: 'AI', run: () => app.openChat('В чём смысл жизни?') },
      { label: '💾 Купить ещё NVMe', hint: 'Действие', run: () => app.toast('NVMe добавлен в корзину вашего сердца 💾', '🛒') },
      { label: '🏠 На главную', hint: 'Навигация', run: () => go('/') },
      { label: '🗂️ Личный кабинет', hint: 'Навигация', run: () => go('/dashboard') },
      ...THEMES.map((t) => ({ label: `🎨 Тема: ${t.name}`, hint: 'Тема', run: () => app.setTheme(t.id) })),
    ]
    return [...actions, ...pages]
  }, [app])

  const list = cmds.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()))

  if (!app.paletteOpen) return null
  const run = (c?: Cmd) => {
    if (!c) {
      app.setPaletteOpen(false)
      app.openChat(q || 'Помоги')
      return
    }
    app.setPaletteOpen(false)
    c.run()
  }
  return (
    <div className="modal-back" onClick={() => app.setPaletteOpen(false)}>
      <div className="palette slop-border" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setSel(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') setSel((s) => Math.min(list.length - 1, s + 1))
            if (e.key === 'ArrowUp') setSel((s) => Math.max(0, s - 1))
            if (e.key === 'Enter') run(list[sel])
          }}
          placeholder="✨ Спросите AI или найдите что угодно… (что угодно не найдётся)"
        />
        <div className="palette-list">
          {list.map((c, i) => (
            <button key={c.label + i} className={`palette-item ${i === sel ? 'sel' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => run(c)}>
              <span>{c.label}</span>
              <span className="muted small">{c.hint}</span>
            </button>
          ))}
          {list.length === 0 && (
            <button className="palette-item sel" onClick={() => run()}>
              <span>🤖 Спросить Aéza AI: «{q}»</span>
              <span className="muted small">Enter</span>
            </button>
          )}
        </div>
        <div className="palette-foot muted small">↑↓ — выбрать · Enter — синергировать · Esc — сбежать</div>
      </div>
    </div>
  )
}
