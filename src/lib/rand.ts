// Детерминированный рандом нового поколения. Seed — это не просто число, а образ мышления.
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashStr(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export type Rng = () => number

export function pick<T>(arr: readonly T[], r: Rng = Math.random): T {
  return arr[Math.floor(r() * arr.length)]
}

export function between(min: number, max: number, r: Rng = Math.random) {
  return min + (max - min) * r()
}

export function int(min: number, max: number, r: Rng = Math.random) {
  return Math.floor(between(min, max + 1, r))
}

/** Случайное блуждание — как карьера сервера. */
export function walk(n: number, seed: number, start = 50, vol = 8, min = 0, max = 100) {
  const r = mulberry32(seed)
  const out: number[] = []
  let v = start
  for (let i = 0; i < n; i++) {
    v += (r() - 0.5) * vol * 2
    v = Math.max(min, Math.min(max, v))
    out.push(v)
  }
  return out
}

export function fmt(n: number) {
  return Math.round(n).toLocaleString('ru-RU')
}
