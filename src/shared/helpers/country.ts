import { ContinentCode, CONTINENTS } from '@shared/constants/continents'
import { COUNTRIES, Iso3166Alpha2Code } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'

type FilterCountriesOptions = {
  onlyCountries?: readonly Iso3166Alpha2Code[]
  excludedCountries?: readonly Iso3166Alpha2Code[]
  preferredCountries?: readonly Iso3166Alpha2Code[]
  continents?: readonly ContinentCode[]
}

export function getCallingCodeOfCountry(isoCode: Iso3166Alpha2Code): string {
  return COUNTRIES[isoCode][0] as string
}

export function sortedPreferredCountries(
  countries: readonly Iso3166Alpha2Code[],
  preferredCountries: readonly Iso3166Alpha2Code[]
): readonly Iso3166Alpha2Code[] {
  return [...new Set(preferredCountries.concat(countries))]
}

export function getCountriesOfContinents(
  continents: readonly ContinentCode[]
): readonly Iso3166Alpha2Code[] {
  return continents.flatMap((continentCode) => {
    return CONTINENTS[continentCode]
  })
}

export function getOnlyCountries(
  countries: readonly Iso3166Alpha2Code[],
  onlyCountries: readonly Iso3166Alpha2Code[]
): readonly Iso3166Alpha2Code[] {
  return countries.filter((isoCode) => {
    return onlyCountries.includes(isoCode)
  })
}

export function excludeCountries(
  countries: readonly Iso3166Alpha2Code[],
  excludedCountries?: readonly Iso3166Alpha2Code[]
): readonly Iso3166Alpha2Code[] {
  if (matchIsArray(excludedCountries, true)) {
    return countries.filter((isoCode) => {
      return !excludedCountries.includes(isoCode)
    })
  }
  return countries
}

export function filterCountries(
  countries: readonly Iso3166Alpha2Code[],
  options: FilterCountriesOptions
): readonly Iso3166Alpha2Code[] {
  const { onlyCountries, excludedCountries, continents, preferredCountries } =
    options

  if (matchIsArray(onlyCountries, true)) {
    const filteredCountries = getOnlyCountries(countries, onlyCountries)
    return matchIsArray(preferredCountries, true)
      ? sortedPreferredCountries(filteredCountries, preferredCountries)
      : filteredCountries
  }

  const theCountries = matchIsArray(continents, true)
    ? getCountriesOfContinents(continents)
    : countries

  const sortedCountries = matchIsArray(preferredCountries, true)
    ? sortedPreferredCountries(theCountries, preferredCountries)
    : theCountries

  return matchIsArray(excludedCountries, true)
    ? excludeCountries(sortedCountries, excludedCountries)
    : sortedCountries
}

export function matchContinentsIncludeCountry(
  continents: ContinentCode[],
  isoCode: Iso3166Alpha2Code
) {
  return continents.some((continentCode) => {
    return CONTINENTS[continentCode].includes(isoCode)
  })
}
