import { useEffect, useState, type AnchorHTMLAttributes } from 'react'

// Хеш-роутер нового поколения. Никакого бекенда — только синергия решётки.

function read() {
  const h = window.location.hash.replace(/^#/, '')
  return h || '/'
}

export function useRoute() {
  const [path, setPath] = useState(read)
  useEffect(() => {
    const on = () => {
      setPath(read())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return path
}

export function go(to: string) {
  window.location.hash = to
}

export function Link({ to, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={`#${to}`} {...rest} />
}
