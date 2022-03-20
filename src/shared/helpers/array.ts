export function matchIsArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
