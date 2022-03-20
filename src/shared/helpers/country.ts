import { COUNTRIES, Iso3166Alpha2Code } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'

type FilterCountriesOptions = {
  onlyCountries?: readonly Iso3166Alpha2Code[]
  excludeCountries?: readonly Iso3166Alpha2Code[]
}

export function getCallingCodeOfCountry(isoCode: Iso3166Alpha2Code): string {
  return COUNTRIES[isoCode][0] as string
}

export function filterCountries(
  countries: readonly Iso3166Alpha2Code[],
  options: FilterCountriesOptions
): readonly Iso3166Alpha2Code[] {
  const { onlyCountries, excludeCountries } = options
  if (matchIsArray(onlyCountries) && onlyCountries.length > 0) {
    return countries.filter((isoCode) => {
      return onlyCountries.includes(isoCode)
    })
  }
  if (matchIsArray(excludeCountries) && excludeCountries.length > 0) {
    return countries.filter((isoCode) => {
      return !excludeCountries.includes(isoCode)
    })
  }
  return countries
}
