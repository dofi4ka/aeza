import { useEffect, useRef, useState } from 'react'
import { useApp, type MockServer } from '../state'
import { confetti } from '../lib/confetti'
import { int, pick, walk } from '../lib/rand'
import { LineChart, Sparkline, Gauge } from '../components/Charts'
import { Badge } from '../components/ui'

const TABS = ['🖥️ Серверы', '💸 Финансы', '🎫 Тикеты', '🤖 AI-ассистент', '⚙️ Настройки', '⚙️ Настройки настроек'] as const
type Tab = (typeof TABS)[number]

const STATUS: Record<MockServer['status'], { label: string; cls: string }> = {
  running: { label: 'Работает', cls: 'ok' },
  thinking: { label: 'Думает', cls: 'think' },
  sad: { label: 'Грустит', cls: 'sad' },
  quantum: { label: 'Включён и выключен', cls: 'quantum' },
}

function useLive(n = 30, start = 40) {
  const [data, setData] = useState(() => walk(n, Math.floor(Math.random() * 1e6), start, 9, 2, 100))
  useEffect(() => {
    const id = setInterval(() => setData((d) => [...d.slice(1), Math.max(2, Math.min(100, d[d.length - 1] + (Math.random() - 0.5) * 22))]), 900)
    return () => clearInterval(id)
  }, [])
  return data
}

function ServerRow({ s }: { s: MockServer }) {
  const app = useApp()
  const cpu = useLive(24, 30 + (s.name.length % 40))
  const st = STATUS[s.status]
  const act = (label: string, msg: string, patch?: Partial<MockServer>) => (
    <button
      className="btn btn-outline btn-xs"
      onClick={() => {
        app.toast(msg, '🖥️')
        if (patch) app.updateServer(s.id, patch)
      }}
    >
      {label}
    </button>
  )
  return (
    <div className="srv-row slop-border">
      <div className="srv-main">
        <div className="srv-name">
          <span className={`status-dot ${st.cls}`} /> <b>{s.name}</b>
          <Badge b={s.plan} />
        </div>
        <div className="muted small">
          {s.os} · {s.location} · IP {s.ip} · {st.label}
        </div>
      </div>
      <div className="srv-spark">
        <Sparkline data={cpu} color={s.status === 'sad' ? '#3b82f6' : 'var(--accent)'} min={0} max={100} />
        <span className="small muted">CPU {Math.round(cpu[cpu.length - 1])}%</span>
      </div>
      <div className="srv-actions">
        {act('Перезагрузить', `${s.name}: перезагружен`)}
        {act('…с чувством', `${s.name}: перезагружен с чувством 💗`, { status: 'running' })}
        {act('Поговорить', `${s.name}: «Я в порядке. Просто устал.» 🫠`, { status: 'thinking' })}
        {act('Подбодрить', `${s.name}: настроение +20% 🌈`, { status: 'running' })}
        <button className="btn btn-ghost btn-xs" onClick={() => {
            app.removeServer(s.id)
            app.toast(`${s.name} отпущен в облако ☁️`, '🕊️')
          }}
        >
          Отпустить
        </button>
      </div>
    </div>
  )
}

const OS_LIST = ['Ubuntu 24.04', 'Debian 12', 'AezaOS AI ✨', 'Windows 95', 'TempleOS', 'Ваша ОС мечты']

function CreateWizard() {
  const app = useApp()
  const [step, setStep] = useState(0)
  const [os, setOs] = useState(OS_LIST[0])
  const [name, setName] = useState('synergy-' + int(100, 999))
  const [pct, setPct] = useState(0)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => {
    if (step !== 2) return
    timer.current = window.setInterval(() => {
      setPct((p) => {
        if (p >= 99) {
          clearInterval(timer.current)
          setTimeout(() => setStep(3), 2200)
          return 99
        }
        return p + int(3, 12)
      })
    }, 220)
    return () => clearInterval(timer.current)
  }, [step])
  useEffect(() => {
    if (step === 3) {
      app.addServer({ id: 'n' + Date.now(), name, os, location: pick(['🇫🇮 Хельсинки', '🇳🇱 Амстердам', '☁️ Облако', '🌕 Луна']), ip: `${int(10, 250)}.${int(0, 255)}.${int(0, 255)}.${int(1, 254)}`, status: 'running', plan: 'Shared START++' })
      app.award('server', 'Создал сервер в облаке надежд', 30)
      confetti(80)
    }
  }, [step])
  if (step === 0)
    return (
      <div className="wizard">
        <p>Шаг 1 из 47: выберите ОС</p>
        <div className="os-grid">
          {OS_LIST.map((o) => (
            <button key={o} className={`os ${o === os ? 'sel' : ''}`} onClick={() => setOs(o)}>
              {o}
            </button>
          ))}
        </div>
        <button className="btn btn-orange" onClick={() => setStep(1)}>
          Далее
        </button>
      </div>
    )
  if (step === 1)
    return (
      <div className="wizard">
        <p>Шаг 2 из 47 (шаги 3–46 пропущены для вашего удобства)</p>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} aria-label="Имя сервера" />
        <button className="btn btn-black btn-sm" onClick={() => setName(pick(['synergy-prod', 'nvme-dreams', 'oranzhevyi', 'test-test-final', 'server-mc-serverface']) + '-' + int(1, 99))}>
          Придумать имя с AI ✨
        </button>
        <button className="btn btn-orange" onClick={() => setStep(2)}>
          Создать
        </button>
      </div>
    )
  if (step === 2)
    return (
      <div className="wizard">
        <p>Разворачиваем за 60 секунд… {pct >= 99 ? 'Почти… почти… почти…' : ''}</p>
        <div className="progress">
          <i style={{ width: `${Math.min(99, pct)}%` }} />
        </div>
        <p className="muted small">{Math.min(99, pct)}% · {pct >= 99 ? 'Последний 1% — самый важный' : 'Закачиваем синергию в NVMe'}</p>
      </div>
    )
  return (
    <div className="wizard center-col">
      <div className="big-emoji">🎉</div>
      <h3>Сервер «{name}» создан в облаке надежд</h3>
      <p className="muted">Ничего не создано по-настоящему. Но в списке он есть — а это главное.</p>
      <button className="btn btn-orange" onClick={app.closeModal}>
        Ура
      </button>
    </div>
  )
}

function ServersTab() {
  const app = useApp()
  const cpu = useLive(40, 50)
  const ram = useLive(40, 30)
  const vibes = useLive(40, 70)
  return (
    <>
      <div className="dash-kpis">
        <div className="kpi slop-border">
          <span className="muted small">Баланс</span>
          <b>1 337 ₽</b>
          <span className="muted small">+0 ₽ за сегодня, +∞ синергии</span>
        </div>
        <div className="kpi slop-border">
          <span className="muted small">Синергобаллы</span>
          <b>9 001</b>
          <span className="muted small">It's over 9000!</span>
        </div>
        <div className="kpi slop-border">
          <span className="muted small">Серверов</span>
          <b>{app.servers.length}</b>
          <span className="muted small">из них думают: {app.servers.filter((s) => s.status === 'thinking').length}</span>
        </div>
        <div className="kpi slop-border">
          <Gauge value={vibes[vibes.length - 1] + 40} label="Вайб инфраструктуры" />
        </div>
      </div>
      <div className="panel slop-border">
        <div className="row between wrap gap8">
          <h3>Нагрузка в реальном времени (почти)</h3>
          <span className="live-pill">
            <i className="dot-live" /> LIVE · обновляется каждые 0.9 с · смысла: 0
          </span>
        </div>
        <LineChart
          series={[
            { name: 'CPU, %', data: cpu, color: 'var(--accent)' },
            { name: 'RAM, %', data: ram, color: '#111' },
            { name: 'Вайбы, %', data: vibes, color: '#7c3aed' },
          ]}
          min={0}
          max={100}
        />
      </div>
      <div className="row between wrap gap8 mt24">
        <h3>Мои серверы</h3>
        <div className="row gap8 wrap">
          <button className="btn btn-orange" onClick={() => app.openModal({ title: 'Создание сервера 🚀', body: <CreateWizard /> })}>
            + Создать сервер
          </button>
          <button className="btn btn-black" onClick={() => app.toast('Все серверы перезагружены одновременно. Земля слегка качнулась 🌍', '🔄')}>
            Перезагрузить всё
          </button>
        </div>
      </div>
      <div className="srv-list">
        {app.servers.map((s) => (
          <ServerRow key={s.id} s={s} />
        ))}
        {app.servers.length === 0 && <p className="muted">Серверов нет. Все отпущены в облако. Это красиво. 🕊️</p>}
      </div>
    </>
  )
}

function FinanceTab() {
  const app = useApp()
  const rows = [
    ['26.10.2026', 'Списание за синергию', '−0 ₽'],
    ['25.10.2026', 'Пополнение вайбами', '+0 ₽'],
    ['24.10.2026', 'Кэшбэк за то, что вы есть', '+1 ₽'],
    ['23.10.2026', 'Налог на новое поколение', '−0.01 ₽'],
    ['22.10.2026', 'Возврат возврата', '±0 ₽'],
  ]
  return (
    <div className="panel slop-border">
      <h3>Финансы 💸</h3>
      <div className="row gap8 wrap mt16">
        {[100, 500, 1000, 7000].map((v) => (
          <button key={v} className="btn btn-peach" onClick={() => app.toast(`Это мок: ${v} ₽ пополнены мысленно 💭`, '💸')}>
            +{v} ₽ (мысленно)
          </button>
        ))}
      </div>
      <table className="vs-table mt16">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Операция</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[1]}>
              {r.map((c) => (
                <td key={c}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TicketsTab() {
  const app = useApp()
  const [tickets, setTickets] = useState([
    { id: 101, t: 'Сервер грустит', s: 'Решено: подбодрили' },
    { id: 102, t: 'Пинг слишком стабильный, это подозрительно', s: 'В работе' },
    { id: 103, t: 'Кнопка «Попробовать» слишком оранжевая', s: 'Отклонено: это невозможно' },
    { id: 104, t: 'Можно ещё AI?', s: 'Решено: добавили ещё AI' },
  ])
  const [text, setText] = useState('')
  return (
    <div className="panel slop-border">
      <h3>Тикеты 🎫</h3>
      <form
        className="row gap8 mt16"
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return
          setTickets((t) => [{ id: 105 + t.length, t: text, s: 'AI уже ответил: «Отличный вопрос!»' }, ...t])
          setText('')
          app.toast('Тикет создан. AI ответил раньше, чем вы нажали кнопку ⚡', '🎫')
        }}
      >
        <input className="input grow" value={text} onChange={(e) => setText(e.target.value)} placeholder="Опишите проблему (или чувства)" />
        <button className="btn btn-orange">Создать</button>
      </form>
      <div className="ticket-list">
        {tickets.map((t) => (
          <div key={t.id} className="ticket">
            <b>#{t.id}</b> {t.t}
            <span className="muted small">{t.s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab({ meta }: { meta?: boolean }) {
  const app = useApp()
  const opts = meta
    ? ['Показывать настройки', 'Показывать настройки настроек', 'Настраивать настройки автоматически (AI)', 'Не настраивать ничего (дзен)']
    : ['Двухфакторная синергия', 'Уведомлять о каждом уведомлении', 'Тёмная тема для сервера', 'AI-автопилот', 'Добавлять ✨ в логи']
  const [on, setOn] = useState<boolean[]>(opts.map((_, i) => i % 2 === 0))
  return (
    <div className="panel slop-border">
      <h3>{meta ? 'Настройки настроек ⚙️⚙️' : 'Настройки ⚙️'}</h3>
      {opts.map((o, i) => (
        <label key={o} className="toggle-row">
          <span>{o}</span>
          <button
            className={`toggle ${on[i] ? 'on' : ''}`}
            role="switch"
            aria-checked={on[i]}
            onClick={() => {
              setOn((a) => a.map((x, k) => (k === i ? !x : x)))
              app.toast(`«${o}» — ${on[i] ? 'выключено' : 'включено'}. Разницы нет, но приятно.`, '⚙️')
            }}
          >
            <i />
          </button>
        </label>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const app = useApp()
  const [tab, setTab] = useState<Tab>(TABS[0])
  return (
    <div className="container dash">
      <aside className="dash-side slop-border">
        <div className="dash-user">
          <span className="dash-ava">🧑‍🚀</span>
          <div>
            <b>{app.loggedIn ? 'Вы (настоящий)' : 'Гость нового поколения'}</b>
            <div className="muted small">Ур. {app.level} · {app.xp} XP</div>
          </div>
        </div>
        {TABS.map((t) => (
          <button key={t} className={`dash-tab ${t === tab ? 'active' : ''}`} onClick={() => (t.includes('AI') ? app.openChat('Я в личном кабинете, помоги') : setTab(t))}>
            {t}
          </button>
        ))}
        <div className="dash-promo">
          <b>Upgrade до PRO MAX ULTRA</b>
          <p className="small">Всё то же самое, но с надписью PRO MAX ULTRA.</p>
          <button className="btn btn-orange btn-sm btn-block" onClick={() => app.toast('Вы теперь PRO MAX ULTRA. Ничего не изменилось 🏅', '🏅')}>
            Улучшить
          </button>
        </div>
      </aside>
      <main className="dash-main">
        <div className="dash-head">
          <h1>Личный кабинет</h1>
          <span className="muted">Добро пожаловать обратно. Добро пожаловать обратно обратно. 👋</span>
        </div>
        {tab === TABS[0] && <ServersTab />}
        {tab === TABS[1] && <FinanceTab />}
        {tab === TABS[2] && <TicketsTab />}
        {tab === TABS[4] && <SettingsTab />}
        {tab === TABS[5] && <SettingsTab meta />}
      </main>
    </div>
  )
}
