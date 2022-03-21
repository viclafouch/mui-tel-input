import { ContinentCode, CONTINENTS } from '@shared/constants/continents'
import { COUNTRIES, Iso3166Alpha2Code } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'

type FilterCountriesOptions = {
  onlyCountries?: readonly Iso3166Alpha2Code[]
  excludeCountries?: readonly Iso3166Alpha2Code[]
  continents?: readonly ContinentCode[]
}

export function getCallingCodeOfCountry(isoCode: Iso3166Alpha2Code): string {
  return COUNTRIES[isoCode][0] as string
}

export function filterCountries(
  countries: readonly Iso3166Alpha2Code[],
  options: FilterCountriesOptions
): readonly Iso3166Alpha2Code[] {
  const { onlyCountries, excludeCountries, continents } = options
  if (matchIsArray(onlyCountries) && onlyCountries.length > 0) {
    return countries.filter((isoCode) => {
      return onlyCountries.includes(isoCode)
    })
  }

  let countriesFiltered = countries

  if (matchIsArray(continents) && continents.length > 0) {
    countriesFiltered = continents.flatMap((continentCode) => {
      return CONTINENTS[continentCode]
    })
  }

  if (matchIsArray(excludeCountries) && excludeCountries.length > 0) {
    return countriesFiltered.filter((isoCode) => {
      return !excludeCountries.includes(isoCode)
    })
  }

  return countriesFiltered
}

export function matchContinentsIncludeCountry(
  continents: ContinentCode[],
  isoCode: Iso3166Alpha2Code
) {
  return continents.some((continentCode) => {
    return CONTINENTS[continentCode].includes(isoCode)
  })
}
