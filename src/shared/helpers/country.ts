import { COUNTRIES, Country } from '@shared/constants/countries'
import type { Iso3166Alpha2Code } from '@shared/constants/iso'
import { matchIsArray } from '@shared/helpers/array'
import * as R from 'ramda'

export function getDefaultCountry(): Country {
  return R.find((country) => {
    return country.isoCode === 'FR'
  }, COUNTRIES) as Country
}

export function getCountryByIsoCode(isoCode: Iso3166Alpha2Code): Country {
  return (
    R.find((country) => {
      return R.identical(country.isoCode, isoCode)
    }, COUNTRIES) || getDefaultCountry()
  )
}

export function getCountryByCallingCode(
  callingCode: Country['callingCode']
): Country | null {
  return (
    R.find((country) => {
      return R.identical(country.callingCode, callingCode)
    }, COUNTRIES) || null
  )
}

type FilterCountriesOptions = {
  onlyCountries?: readonly Iso3166Alpha2Code[]
  excludeCountries?: readonly Iso3166Alpha2Code[]
}

export function filterCountries(
  countries: readonly Country[],
  options: FilterCountriesOptions
): readonly Country[] {
  const { onlyCountries, excludeCountries } = options
  if (matchIsArray(onlyCountries)) {
    return R.filter((item) => {
      return R.includes(item.isoCode, onlyCountries)
    }, countries)
  }
  if (matchIsArray(excludeCountries)) {
    return R.filter((item) => {
      return !R.includes(item.isoCode, excludeCountries)
    }, countries)
  }
  return countries
}
