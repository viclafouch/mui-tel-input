import * as R from 'ramda'

export function getOnlyNumbers(value: string | number): string {
  return R.pipe(R.toString, R.replace(/\D+/g, ''))(value)
}

export function matchIsNumeric(text: unknown): boolean {
  const isNumber = R.is(Number, text)
  const isString = R.is(String, text)
  // eslint-disable-next-line no-restricted-globals
  return (isNumber || (isString && text !== '')) && !isNaN(Number(text))
}

export function numericToNumber(value: string): number | null {
  return matchIsNumeric(value) ? Number(value) : null
}
