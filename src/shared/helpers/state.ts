import * as R from '@ramda'
import type { Country } from '@shared/constants/countries'
import { COUNTRIES } from '@shared/constants/countries'
import type { Iso3166Alpha2Code } from '@shared/constants/iso'
import {
  filterCountries,
  getCountryByCallingCode,
  getCountryByIsoCode,
  getCountryByValue,
  getFallbackCountry
} from '@shared/helpers/country'
import {
  getCallingCode,
  numberToInputValue
} from '@shared/helpers/phone-number'
import { stringToNumber } from '@shared/helpers/string'

import type { State } from '../../index.types'

type GetInitialStateParams = {
  defaultCountry?: Iso3166Alpha2Code
  onlyCountries?: Iso3166Alpha2Code[]
  excludeCountries?: Iso3166Alpha2Code[]
  initialValue?: string
  disableFormatting?: boolean
}

export function getInitialState(params: GetInitialStateParams = {}): State {
  const {
    defaultCountry,
    onlyCountries,
    excludeCountries,
    initialValue,
    disableFormatting
  } = params
  const filteredCountries = filterCountries(COUNTRIES, {
    onlyCountries,
    excludeCountries
  })

  // We allow user to force the country by the initialValue
  const countryByValue = initialValue
    ? getCountryByValue(initialValue, COUNTRIES)
    : null

  if (countryByValue) {
    const onlyNumbers = initialValue ? stringToNumber(initialValue) : null
    return {
      value: numberToInputValue(onlyNumbers, countryByValue, {
        disableFormatting
      }),
      formattedInt: onlyNumbers,
      country: countryByValue,
      hasSelectCountry: false
    }
  }

  // Ok so the value doesn't match any country, let's check the default country, but on the filtered ones
  const theDefaultCountry = defaultCountry
    ? getCountryByIsoCode(defaultCountry, filteredCountries)
    : null

  if (theDefaultCountry) {
    return {
      value: numberToInputValue(
        theDefaultCountry.callingCode,
        theDefaultCountry,
        { disableFormatting }
      ),
      formattedInt: theDefaultCountry.callingCode,
      country: theDefaultCountry,
      hasSelectCountry: false
    }
  }

  // We don't have any country selected now, let's get a fallback
  const fallbackCountry = filteredCountries[0] || getFallbackCountry()
  return {
    value: numberToInputValue(fallbackCountry.callingCode, fallbackCountry, {
      disableFormatting
    }),
    formattedInt: fallbackCountry.callingCode,
    country: fallbackCountry,
    hasSelectCountry: false
  }
}

type UpdateInputValueOptions = {
  isIsoCodeEditable: boolean | undefined
  onlyCountries?: Iso3166Alpha2Code[]
  excludeCountries?: Iso3166Alpha2Code[]
  disableFormatting?: boolean
}

export function updateInputValue(
  inputValue: string,
  prevState: State,
  options: UpdateInputValueOptions
): State {
  const {
    isIsoCodeEditable,
    onlyCountries,
    excludeCountries,
    disableFormatting
  } = options

  if (!isIsoCodeEditable) {
    const mustStartsWith = numberToInputValue(
      prevState.country.callingCode,
      prevState.country
    )
    // User cannot remove the first 3 letters (+XX)
    if (!inputValue.startsWith(mustStartsWith)) {
      return {
        ...prevState,
        value: mustStartsWith,
        formattedInt: prevState.country.callingCode
      }
    }
  }

  const onlyNumbers = stringToNumber(inputValue)

  // Force at least '+' in any ways
  if (onlyNumbers === null || inputValue === '') {
    return {
      ...prevState,
      value: '+',
      formattedInt: null
    }
  }

  const currentCallingCode = onlyNumbers ? getCallingCode(onlyNumbers) : null
  const previousCallingCode = prevState.formattedInt
    ? getCallingCode(prevState.formattedInt)
    : null

  // To avoid searching for the new country every time the user types,
  // we check if the calling code is the same as the previous one
  if (currentCallingCode && currentCallingCode === previousCallingCode) {
    return {
      ...prevState,
      value: numberToInputValue(onlyNumbers, prevState.country, {
        disableFormatting
      }),
      formattedInt: onlyNumbers
    }
  }

  // If no calling code, let the user write random numbers, but the country stays
  if (!currentCallingCode) {
    return {
      ...prevState,
      value: `+${onlyNumbers}`,
      formattedInt: null
    }
  }

  // Now that we have a calling code, let's check for the new country,
  const filteredCountries = filterCountries(COUNTRIES, {
    onlyCountries,
    excludeCountries
  })
  const newCountry = currentCallingCode
    ? getCountryByCallingCode(currentCallingCode, filteredCountries)
    : null

  // If no country found, block the user
  if (!newCountry) {
    return prevState
  }

  return {
    ...prevState,
    country: newCountry,
    value: numberToInputValue(onlyNumbers, newCountry, { disableFormatting }),
    formattedInt: onlyNumbers
  }
}

export function updateCountry(
  country: Country,
  prevState: State,
  options: { disableFormatting?: boolean } = {}
): State {
  const { disableFormatting } = options
  if (R.identical(country, prevState.country)) {
    const mustStartsWith = numberToInputValue(country.callingCode, country, {
      disableFormatting
    })
    if (!prevState.value.startsWith(mustStartsWith)) {
      return {
        ...prevState,
        value: mustStartsWith,
        formattedInt: country.callingCode
      }
    }
    return prevState
  }
  return {
    country,
    value: numberToInputValue(country.callingCode, country, {
      disableFormatting
    }),
    formattedInt: country.callingCode,
    hasSelectCountry: true
  }
}
