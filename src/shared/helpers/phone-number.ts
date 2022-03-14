import * as R from '@ramda'
import { Country } from '@shared/constants/countries'

import { matchIsNumeric } from './string'

export function matchIsValidCallingCode(callingCode: number) {
  return (
    R.identical(R.length(String(callingCode)), 2) && matchIsNumeric(callingCode)
  )
}

export function getCallingCode(value: string | number): number | null {
  let callingCode: number | null = null
  if (R.is(String, value) && value.startsWith('+')) {
    callingCode = R.pipe(String, R.slice(1, 3), Number)(value)
  } else {
    callingCode = R.pipe(String, R.slice(0, 2), Number)(value)
  }
  return matchIsValidCallingCode(callingCode) ? callingCode : null
}

export function matchStartsWithCallingCode(
  value: number,
  callingCode: Country['callingCode']
): boolean {
  return String(value).startsWith(String(callingCode))
}

export function applyMaskToInputValue(
  number: number,
  format: NonNullable<Country['format']>
): string {
  const lettersSplitted = R.pipe(String, R.split(''))(number)
  const maskCharacters = R.split('', format)

  return R.reduce(
    (accumulator, currentCharacter) => {
      return R.cond([
        [
          () => {
            return R.isEmpty(accumulator.remainingLetters)
          },
          R.always(accumulator)
        ],
        [
          () => {
            return currentCharacter !== '.'
          },
          R.always({
            ...accumulator,
            formattedText: accumulator.formattedText + currentCharacter
          })
        ],
        [
          R.T,
          () => {
            const [firstLetter, ...letters] = accumulator.remainingLetters
            return {
              formattedText: accumulator.formattedText + firstLetter,
              remainingLetters: letters
            }
          }
        ]
      ])()
    },
    {
      formattedText: '',
      remainingLetters: lettersSplitted
    },
    maskCharacters
  ).formattedText
}

export function numberToInputValue(
  number: number | null,
  country: Country
): string {
  if (number === null) {
    return country.format
      ? applyMaskToInputValue(country.callingCode, country.format)
      : `${country.callingCode}`
  }
  return country.format
    ? applyMaskToInputValue(number, country.format)
    : `${number}`
}
