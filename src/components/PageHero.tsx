import type { ReactNode } from 'react'
import { Badge } from './ui'

export function PageHero({ title, sub, badges, children, emoji }: { title: string; sub?: string; badges?: string[]; children?: ReactNode; emoji?: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero-glow" aria-hidden />
      <div className="container page-hero-inner">
        {badges && (
          <div className="badges">
            {badges.map((b) => (
              <Badge key={b} b={b} />
            ))}
          </div>
        )}
        <h1>
          {emoji && <span className="ph-emoji">{emoji}</span>}
          {title}
        </h1>
        <div className="ph-echo" aria-hidden>
          {title}
        </div>
        {sub && <p className="ph-sub">{sub}</p>}
        {children}
      </div>
    </section>
  )
}
