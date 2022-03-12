import * as R from 'ramda'

export function matchIsArray(value: unknown): value is unknown[] {
  return R.is(Array, value)
}
