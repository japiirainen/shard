export function memoize<T>(fn: (...xs: any[]) => T, ttl: number): (...xs: any[]) => T {
   const cache = new Map()
   return (...xs: any[]): T => {
      const args = JSON.stringify(xs)

      if (cache.has(args)) {
         const cached = cache.get(args)!
         if (Date.now() - cached.requested > ttl) return cached.result
      }

      const result = fn.apply(null, xs)
      cache.set(args, { requested: Date.now(), result })
      return result
   }
}
