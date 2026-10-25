import { useState } from 'react'
import { useApp } from '../state'
import { fmt } from '../lib/rand'
import { PageHero } from '../components/PageHero'
import { SectionTitle } from '../components/ui'

export default function Referral() {
  const app = useApp()
  const [friends, setFriends] = useState(3)
  const levels = 5
  const total = Array.from({ length: levels }, (_, i) => friends ** (i + 1)).reduce((a, b) => a + b, 0)
  const link = 'aeza.ru/?ref=синергия-синергия'
  return (
    <>
      <PageHero emoji="🔺" title="Реферальная программа" sub="Рекомендуй сервис знакомым и зарабатывай с каждого клиента. Знакомые рекомендуют знакомым. Это не пирамида — это треугольник доверия. 🔺" badges={['HOT', 'x∞']} />
      <section className="container section grid-2">
        <div className="panel slop-border">
          <h3>Ваша реферальная ссылка</h3>
          <div className="ref-link">
            <code>{link}</code>
            <button className="btn btn-orange btn-sm" onClick={() => app.toast('Ссылка скопирована в сердце (буфер не трогали) 🔗', '🔗')}>
              Копировать
            </button>
          </div>
          <label className="slider mt24">
            <div className="slider-head">
              <span>Каждый приглашает друзей</span>
              <b>{friends}</b>
            </div>
            <input type="range" min={1} max={12} value={friends} onChange={(e) => setFriends(+e.target.value)} />
          </label>
          <div className="ref-total">
            <span className="muted">Через {levels} уровней у вас будет</span>
            <b>{fmt(total)} рефералов</b>
            <span className="muted">и {fmt(total * 0.07)} ₽ (мысленно)</span>
          </div>
        </div>
        <div className="panel slop-border center-col">
          <h3>Треугольник доверия</h3>
          <div className="triangle">
            {Array.from({ length: levels }, (_, i) => (
              <div key={i} className="tri-row">
                {Array.from({ length: Math.min(i + 1, 9) }, (_, k) => (
                  <span key={k}>{i === 0 ? '🧑' : '🙂'}</span>
                ))}
                {i >= 9 && '…'}
              </div>
            ))}
          </div>
          <p className="muted small">Это не пирамида. У пирамиды 4 грани, а у нас — синергия.</p>
        </div>
      </section>
      <section className="container section">
        <SectionTitle title="Уровни партнёрства" />
        <div className="plans plans-3">
          {[
            ['Бронза', '5%', 'Друг'],
            ['Серебро', '7%', 'Друг друга'],
            ['Синергия', '∞%', 'Друг друга друга'],
          ].map(([n, p, d]) => (
            <div key={n} className="plan slop-hover">
              <h3>{n}</h3>
              <div className="plan-price">{p}</div>
              <p className="muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
