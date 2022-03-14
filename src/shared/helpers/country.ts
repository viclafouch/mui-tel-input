import * as R from '@ramda'
import { COUNTRIES, Country } from '@shared/constants/countries'
import type { Iso3166Alpha2Code } from '@shared/constants/iso'
import { DEFAULT_ISO_CODE } from '@shared/constants/iso'
import { matchIsArray } from '@shared/helpers/array'
import { getCallingCode } from '@shared/helpers/phone-number'

export function getFallbackCountry(isoCode = DEFAULT_ISO_CODE): Country {
  return R.find((country) => {
    return country.isoCode === isoCode
  }, COUNTRIES) as Country
}

export function getCountryByIsoCode(
  isoCode: Iso3166Alpha2Code,
  countries: readonly Country[]
): Country | null {
  return (
    R.find((country) => {
      return R.identical(country.isoCode, isoCode)
    }, countries) || null
  )
}

export function getCountryByCallingCode(
  callingCode: Country['callingCode'],
  countries: readonly Country[]
): Country | null {
  return (
    R.find((country) => {
      return R.identical(country.callingCode, callingCode)
    }, countries) || null
  )
}

export function getCountryByValue(
  value: string,
  countries: readonly Country[]
): Country | null {
  const callingCode = getCallingCode(value)
  return callingCode ? getCountryByCallingCode(callingCode, countries) : null
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
  if (matchIsArray(onlyCountries) && R.gt(R.length(onlyCountries), 0)) {
    return R.filter((item) => {
      return onlyCountries.includes(item.isoCode)
    }, countries)
  }
  if (matchIsArray(excludeCountries) && R.gt(R.length(excludeCountries), 0)) {
    return R.filter((item) => {
      return !excludeCountries.includes(item.isoCode)
    }, countries)
  }
  return countries
}
