export function matchIsArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

export function getFirstIntersection<T extends unknown[]>(
  arrayA: T,
  arrayB: T
): T[number] | null {
  return (
    arrayA.find((element) => {
      return arrayB.includes(element)
    }) || null
  )
}
