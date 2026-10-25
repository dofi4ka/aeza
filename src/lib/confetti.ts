const COLORS = ['#ff7a00', '#ffb366', '#000000', '#ffe2c7', '#22c55e', '#7c3aed', '#ffffff']
const SHAPES = ['■', '●', '▲', '✦', '✨', 'é', '🚀', '💾']

/** Конфетти — главный инструмент UX нового поколения. */
export function confetti(n = 90) {
  const host = document.createElement('div')
  host.className = 'confetti-host'
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span')
    s.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    s.style.left = `${Math.random() * 100}vw`
    s.style.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    s.style.fontSize = `${10 + Math.random() * 22}px`
    s.style.animationDuration = `${1.6 + Math.random() * 2.2}s`
    s.style.animationDelay = `${Math.random() * 0.4}s`
    s.style.setProperty('--drift', `${(Math.random() - 0.5) * 300}px`)
    s.style.setProperty('--spin', `${(Math.random() - 0.5) * 1440}deg`)
    host.appendChild(s)
  }
  document.body.appendChild(host)
  setTimeout(() => host.remove(), 4800)
}
