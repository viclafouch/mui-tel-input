import { MuiTelInputContinent } from 'index.types'
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js'
import { MuiTelInputCountry } from '@shared/constants/countries'
import {
  excludeCountries,
  getOnlyCountries,
  matchContinentsIncludeCountry
} from '@shared/helpers/country'

export function matchIsValidTel(
  text: string,
  options?: {
    excludedCountries?: MuiTelInputCountry[]
    onlyCountries?: MuiTelInputCountry[]
    continents?: MuiTelInputContinent[]
  }
): boolean {
  const phone = new AsYouType()
  phone.input(text)
  const country = phone.getCountry()

  if (!country) {
    return false
  }

  if (options?.continents && options.continents.length > 0) {
    if (!matchContinentsIncludeCountry(options.continents, country)) {
      return false
    }
  }

  if (options?.onlyCountries && options.onlyCountries.length > 0) {
    const [countryExists] = getOnlyCountries([country], options.onlyCountries)

    if (!countryExists) {
      return false
    }
  }

  if (options?.excludedCountries && options.excludedCountries.length > 0) {
    const [countryExists] = excludeCountries(
      [country],
      options.excludedCountries
    )

    if (!countryExists) {
      return false
    }
  }

  return isValidPhoneNumber(text)
}
