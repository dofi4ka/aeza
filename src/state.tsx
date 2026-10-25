import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export type ToastItem = { id: number; text: string; icon: string; kind: 'info' | 'achievement' | 'xp' }

export type ModalSpec = {
  title: string
  body: ReactNode
  actions?: { label: string; kind?: 'orange' | 'black' | 'peach' | 'ghost'; onClick?: () => void; keepOpen?: boolean }[]
  wide?: boolean
}

export type Flags = {
  sparkleHeadings: boolean
  cursorSparkles: boolean
  slopMode: boolean
  pingWidget: boolean
  comicSans: boolean
}

export type MockServer = {
  id: string
  name: string
  os: string
  location: string
  ip: string
  status: 'running' | 'thinking' | 'sad' | 'quantum'
  plan: string
}

type Ctx = {
  theme: string
  setTheme: (t: string) => void
  toasts: ToastItem[]
  toast: (text: string, icon?: string, kind?: ToastItem['kind']) => void
  xp: number
  level: number
  achievements: string[]
  award: (id: string, title: string, xp?: number) => void
  chatOpen: boolean
  openChat: (prefill?: string) => void
  closeChat: () => void
  chatPrefill: string | null
  consumePrefill: () => void
  modal: ModalSpec | null
  openModal: (m: ModalSpec) => void
  closeModal: () => void
  paletteOpen: boolean
  setPaletteOpen: (v: boolean) => void
  flags: Flags
  setFlag: (k: keyof Flags, v: boolean) => void
  loggedIn: boolean
  setLoggedIn: (v: boolean) => void
  servers: MockServer[]
  addServer: (s: MockServer) => void
  updateServer: (id: string, patch: Partial<MockServer>) => void
  removeServer: (id: string) => void
}

const AppCtx = createContext<Ctx | null>(null)

function safeGet(k: string) {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
function safeSet(k: string, v: string) {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* приватный режим — тоже режим нового поколения */
  }
}

const INITIAL_SERVERS: MockServer[] = [
  { id: 's1', name: 'synergy-prod-01', os: 'Ubuntu 24.04', location: '🇫🇮 Хельсинки', ip: '185.42.0.1', status: 'running', plan: 'Shared START++' },
  { id: 's2', name: 'synergy-prod-01-copy', os: 'Ubuntu 24.04', location: '🇫🇮 Хельсинки', ip: '185.42.0.2', status: 'running', plan: 'Shared START++' },
  { id: 's3', name: 'synergy-prod-01-copy-FINAL', os: 'AezaOS AI ✨', location: '☁️ Облако', ip: '∞.∞.∞.∞', status: 'thinking', plan: 'AI-Ready Ready' },
  { id: 's4', name: 'landing-one-button', os: 'Debian 12', location: '🇳🇱 Амстердам', ip: '77.7.7.7', status: 'sad', plan: 'Dedicated PRO MAX ULTRA' },
  { id: 's5', name: 'schrodinger', os: 'TempleOS', location: '🌕 Луна', ip: '?.?.?.?', status: 'quantum', plan: 'Квантовый VPS' },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState(() => safeGet('aeza-theme') || 'light')
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [xp, setXp] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [chatOpen, setChatOpen] = useState(false)
  const [chatPrefill, setChatPrefill] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalSpec | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [flags, setFlags] = useState<Flags>({
    sparkleHeadings: false,
    cursorSparkles: false,
    slopMode: false,
    pingWidget: false,
    comicSans: false,
  })
  const [loggedIn, setLoggedIn] = useState(false)
  const [servers, setServers] = useState<MockServer[]>(INITIAL_SERVERS)
  const idRef = useRef(1)
  const achRef = useRef(new Set<string>())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    safeSet('aeza-theme', theme)
  }, [theme])

  useEffect(() => {
    const cls = document.body.classList
    cls.toggle('fx-sparkle-headings', flags.sparkleHeadings)
    cls.toggle('fx-slop', flags.slopMode)
    cls.toggle('fx-comic', flags.comicSans)
  }, [flags])

  const toast = useCallback((text: string, icon = '✨', kind: ToastItem['kind'] = 'info') => {
    const id = idRef.current++
    setToasts((t) => [...t.slice(-4), { id, text, icon, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'achievement' ? 5200 : 4200)
  }, [])

  const award = useCallback(
    (id: string, title: string, gain = 10) => {
      if (achRef.current.has(id)) return
      achRef.current.add(id)
      setAchievements((a) => [...a, id])
      setXp((x) => x + gain)
      toast(`Достижение: ${title} · +${gain} XP`, '🏆', 'achievement')
    },
    [toast],
  )

  const setTheme = useCallback(
    (t: string) => {
      setThemeState(t)
      award('theme', 'Сменил тему. Тема сменила вас', 15)
    },
    [award],
  )

  const openChat = useCallback(
    (prefill?: string) => {
      setChatOpen(true)
      if (prefill) setChatPrefill(prefill)
      award('chat', 'Открыл AI-чат нового поколения', 20)
    },
    [award],
  )

  const value = useMemo<Ctx>(
    () => ({
      theme,
      setTheme,
      toasts,
      toast,
      xp,
      level: 1 + Math.floor(xp / 50),
      achievements,
      award,
      chatOpen,
      openChat,
      closeChat: () => setChatOpen(false),
      chatPrefill,
      consumePrefill: () => setChatPrefill(null),
      modal,
      openModal: (m) => setModal(m),
      closeModal: () => setModal(null),
      paletteOpen,
      setPaletteOpen,
      flags,
      setFlag: (k, v) => setFlags((f) => ({ ...f, [k]: v })),
      loggedIn,
      setLoggedIn,
      servers,
      addServer: (s) => setServers((all) => [...all, s]),
      updateServer: (id, patch) => setServers((all) => all.map((s) => (s.id === id ? { ...s, ...patch } : s))),
      removeServer: (id) => setServers((all) => all.filter((s) => s.id !== id)),
    }),
    [theme, setTheme, toasts, toast, xp, achievements, award, chatOpen, openChat, chatPrefill, modal, paletteOpen, flags, loggedIn, servers],
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp вне синергии')
  return c
}

/** Тик каждые ms миллисекунд — пульс экосистемы. */
export function useTick(ms = 1000) {
  const [t, setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), ms)
    return () => clearInterval(id)
  }, [ms])
  return t
}
