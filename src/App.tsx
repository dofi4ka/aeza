import { AppProvider } from './state'
import { useRoute } from './lib/router'
import { Header, TopBar } from './components/Header'
import { Footer } from './components/Footer'
import { AiFab } from './components/AiChat'
import { CommandPalette } from './components/CommandPalette'
import { BackToTop, CookieStack, CursorSparkles, HelpPopup, ModalHost, NewsToasts, PingWidget, ScrollProgress, ToastHost } from './components/Overlays'
import Home from './pages/Home'
import Vps from './pages/Vps'
import ServicePage from './pages/ServicePage'
import Dashboard from './pages/Dashboard'
import AiPage from './pages/AiPage'
import Mcp from './pages/Mcp'
import Extension from './pages/Extension'
import MobileApp from './pages/MobileApp'
import Themes from './pages/Themes'
import Analytics from './pages/Analytics'
import Locations from './pages/Locations'
import Status from './pages/Status'
import About from './pages/About'
import Referral from './pages/Referral'
import Labs from './pages/Labs'
import NotFound from './pages/NotFound'

const ROUTES: Record<string, () => JSX.Element> = {
  '/': Home,
  '/vps': Vps,
  '/dashboard': Dashboard,
  '/ai': AiPage,
  '/mcp': Mcp,
  '/extension': Extension,
  '/app': MobileApp,
  '/themes': Themes,
  '/analytics': Analytics,
  '/locations': Locations,
  '/status': Status,
  '/about': About,
  '/referral': Referral,
  '/labs': Labs,
}

function Page({ path }: { path: string }) {
  const svc = path.match(/^\/service\/([\w-]+)$/)
  if (svc) return <ServicePage id={svc[1]} />
  const P = ROUTES[path] ?? NotFound
  return <P />
}

export default function App() {
  const path = useRoute()
  return (
    <AppProvider>
      <ScrollProgress />
      <TopBar />
      <Header />
      <main className="main" key={path}>
        <Page path={path} />
      </main>
      <Footer />
      <NewsToasts />
      <CookieStack />
      <HelpPopup />
      <BackToTop />
      <AiFab />
      <CommandPalette />
      <ModalHost />
      <ToastHost />
      <CursorSparkles />
      <PingWidget />
    </AppProvider>
  )
}
