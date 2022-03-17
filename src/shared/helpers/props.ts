import type { Country } from '@shared/constants/countries'
import { COUNTRIES } from '@shared/constants/countries'
import {
  getCountryByIsoCode,
  getFallbackCountry
} from '@shared/helpers/country'

import type { State } from '../../index.types'
import { numberToInputValue } from './phone-number'

export function updateDefaultCountry(
  prevState: State,
  defaultCountry?: Country['isoCode']
): State {
  if (!defaultCountry) {
    return prevState
  }
  const country =
    getCountryByIsoCode(defaultCountry, COUNTRIES) || getFallbackCountry()
  const isEmpty = prevState.formattedInt === prevState.country.callingCode
  if (prevState.hasSelectCountry || prevState.country === country || !isEmpty) {
    return prevState
  }
  return {
    ...prevState,
    value: numberToInputValue(country.callingCode, country),
    formattedInt: country.callingCode,
    country
  }
}
