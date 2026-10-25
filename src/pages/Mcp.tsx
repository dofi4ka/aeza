import { useState } from 'react'
import { useApp } from '../state'
import { PageHero } from '../components/PageHero'
import { Badge, SectionTitle } from '../components/ui'
import { RateWidget } from '../components/Overlays'

// Конфиг специально нерабочий: команда — echo, чтобы никто случайно ничего не установил.
const CONFIG = `{
  "mcpServers": {
    "aeza": {
      "command": "echo",
      "args": ["синергия"],
      "env": { "AEZA_SYNERGY": "max", "AEZA_AI": "true" }
    },
    "aeza-2": {
      "command": "echo",
      "args": ["синергия", "синергия"]
    },
    "aeza-final": {
      "command": "echo",
      "args": ["синергия", "синергия", "синергия"]
    }
  }
}`

type Tool = { name: string; desc: string; args: string; result: () => object }

const TOOLS: Tool[] = [
  { name: 'get_server', desc: 'Получить сервер.', args: '{ "id": "synergy-prod-01" }', result: () => ({ id: 'synergy-prod-01', status: 'running', mood: 'хорошее', nvme: true }) },
  { name: 'get_server_v2', desc: 'Получить сервер, но v2.', args: '{ "id": "synergy-prod-01" }', result: () => ({ id: 'synergy-prod-01', status: 'running', mood: 'хорошее', nvme: true, v: 2 }) },
  { name: 'get_server_final', desc: 'Получить сервер окончательно.', args: '{ "id": "synergy-prod-01" }', result: () => ({ id: 'synergy-prod-01', status: 'running', final: true }) },
  { name: 'get_server_final_FINAL', desc: 'Это точно последняя версия.', args: '{ "id": "synergy-prod-01", "really": true }', result: () => ({ id: 'synergy-prod-01', status: 'running', final: 'FINAL', note: 'будет v3' }) },
  { name: 'feel_server_vibes', desc: 'Почувствовать вайбы сервера через MCP.', args: '{ "depth": "deep" }', result: () => ({ vibes: Math.round(Math.random() * 100) + '%', aura: 'оранжевая' }) },
  { name: 'reboot_with_empathy', desc: 'Перезагрузить сервер, предварительно извинившись.', args: '{ "sorry": true }', result: () => ({ rebooted: true, forgiven: Math.random() > 0.2 }) },
  { name: 'ask_server_how_it_feels', desc: 'Спросить сервер, как он себя чувствует.', args: '{}', result: () => ({ answer: ['Нормально', 'Устал', 'Я — NVMe', 'Почему ты спрашиваешь?'][Math.floor(Math.random() * 4)] }) },
  { name: 'generate_synergy', desc: 'Сгенерировать синергию. Детерминированно случайно.', args: '{ "amount": "∞" }', result: () => ({ synergy: '∞', generated_at: new Date().toISOString() }) },
  { name: 'summon_admin', desc: 'Призвать администратора. Работает в полнолуние.', args: '{ "ritual": "basic" }', result: () => ({ admin: 'в пути', eta: '60 секунд (или 61)' }) },
  { name: 'call_mcp_from_mcp', desc: 'Вызвать MCP из MCP. Рекурсия нового поколения.', args: '{ "depth": 9999 }', result: () => ({ error: 'Maximum synergy depth exceeded', hint: 'попробуйте depth: 9998' }) },
]

export default function Mcp() {
  const app = useApp()
  const [log, setLog] = useState<string[]>(['$ aeza-mcp --synergy=max', '✓ MCP-сервер запущен (в воображении)', '✓ Подключено 10 инструментов, 3 из которых — get_server'])
  const [busy, setBusy] = useState(false)
  const call = (t: Tool) => {
    if (busy) return
    setBusy(true)
    setLog((l) => [...l, `→ tools/call ${t.name} ${t.args}`, '… думаю через протокол …'])
    setTimeout(() => {
      setLog((l) => [...l.slice(0, -1), `← ${JSON.stringify(t.result())}`])
      setBusy(false)
      app.award('mcp', 'Вызвал MCP-инструмент. Протокол доволен', 20)
    }, 700)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONFIG)
      app.toast('Конфиг скопирован. Он печатает «синергия» и больше ничего 📋', '📋')
    } catch {
      app.toast('Буфер обмена не готов к такому MCP 📋', '⚠️')
    }
  }
  return (
    <>
      <PageHero emoji="🧩" title="Aéza MCP" sub="Model Context Protocol для вашего Context Protocol. Подключите Aéza к любой нейросети — и нейросеть подключится к Aéza. Бесшовно. 🧵" badges={['NEW', 'AI', 'BETA', 'MCP']}>
        <div className="compat">
          Совместимо с:
          {['Claude', 'Cursor', 'VS Code', 'Блокнот', 'Калькулятор', 'Холодильник', 'Тостер'].map((c) => (
            <span key={c} className="compat-chip">
              {c}
            </span>
          ))}
        </div>
      </PageHero>
      <section className="container section grid-2">
        <div className="panel slop-border">
          <div className="row between">
            <h3>⚙️ Конфигурация</h3>
            <button className="btn btn-peach btn-sm" onClick={copy}>
              Копировать
            </button>
          </div>
          <pre className="code">{CONFIG}</pre>
          <p className="muted small">Команда — <code>echo</code>: конфиг безопасен и абсолютно бесполезен. Как и задумано.</p>
        </div>
        <div className="panel slop-border terminal-panel">
          <h3>🖥️ Живой лог протокола</h3>
          <div className="terminal">
            {log.slice(-14).map((l, i) => (
              <div key={i} className={l.startsWith('←') ? 'ok' : l.startsWith('→') ? 'req' : ''}>
                {l}
              </div>
            ))}
            <span className="caret">▋</span>
          </div>
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Инструменты (tools)" sub="10 инструментов. 4 из них — get_server. Это называется обратной совместимостью." />
        <div className="tool-grid">
          {TOOLS.map((t) => (
            <div key={t.name} className="tool slop-hover">
              <div className="row between">
                <code className="tool-name">{t.name}</code>
                {t.name.startsWith('get_server') && <Badge b="x4" />}
              </div>
              <p>{t.desc}</p>
              <code className="tool-args">{t.args}</code>
              <button className="btn btn-orange btn-sm" onClick={() => call(t)} disabled={busy}>
                Вызвать
              </button>
            </div>
          ))}
        </div>
        <RateWidget what="MCP" />
      </section>
    </>
  )
}
