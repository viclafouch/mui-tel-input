import * as R from 'ramda'

export function getOnlyNumbers(value: string | number): string {
  return R.pipe(R.toString, R.replace(/\D+/g, ''))(value)
}
