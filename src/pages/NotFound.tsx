import { useApp } from '../state'
import { go } from '../lib/router'

export default function NotFound() {
  const app = useApp()
  return (
    <section className="container section notfound">
      <div className="nf-code">
        4<span className="nf-o">é</span>4
      </div>
      <h1>Страница не найдена. Но найдена синергия.</h1>
      <p className="muted">Эта страница находится в разработке нового поколения. Или в другом дата-центре. Или в облаке. Или в вашем сердце. 💗</p>
      <div className="row gap8 wrap center">
        <button className="btn btn-orange" onClick={() => go('/')}>
          На главную
        </button>
        <button className="btn btn-black" onClick={() => app.openChat('Найди мне страницу, которой нет')}>
          Найти с помощью AI ✨
        </button>
        <button className="btn btn-peach" onClick={() => go('/nowhere-' + Math.floor(Math.random() * 999))}>
          Ещё одна 404
        </button>
      </div>
    </section>
  )
}
