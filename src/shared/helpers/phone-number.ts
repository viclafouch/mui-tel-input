import type { Country } from '@shared/constants/countries'
import * as R from 'ramda'

export function applyMaskToInputValue(
  value: string,
  format: NonNullable<Country['format']>
): string {
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
      remainingLetters: R.split('', value)
    },
    maskCharacters
  ).formattedText
}

export function buildValue(inputValue: string, currentCountry: Country) {
  return R.cond([
    [R.isEmpty, R.always('+')],
    [
      () => {
        return R.isNil(currentCountry.format)
      },
      R.always(inputValue)
    ],
    [
      R.T,
      () => {
        return applyMaskToInputValue(
          inputValue,
          currentCountry.format as string
        )
      }
    ]
  ])(inputValue)
}
