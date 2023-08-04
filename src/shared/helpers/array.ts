export function matchIsArray(
  value: unknown,
  filled?: boolean
): value is unknown[] {
  const isArray = Array.isArray(value)

  return filled ? isArray && value.length > 0 : isArray
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
