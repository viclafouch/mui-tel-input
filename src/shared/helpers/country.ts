import { CONTINENTS, MuiTelInputContinent } from '@shared/constants/continents'
import {
  COUNTRIES,
  DEFAULT_ISO_CODE,
  MuiTelInputCountry
} from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'

type FilterCountriesOptions = {
  onlyCountries?: readonly MuiTelInputCountry[]
  excludedCountries?: readonly MuiTelInputCountry[]
  preferredCountries?: readonly MuiTelInputCountry[]
  continents?: readonly MuiTelInputContinent[]
}

export function getCallingCodeOfCountry(isoCode: MuiTelInputCountry): string {
  return COUNTRIES[isoCode]?.[0] as string
}

export function getValidCountry(
  country?: MuiTelInputCountry
): MuiTelInputCountry {
  return country || DEFAULT_ISO_CODE
}

export function sortPreferredCountries(
  countries: readonly MuiTelInputCountry[],
  preferredCountries: readonly MuiTelInputCountry[]
): readonly MuiTelInputCountry[] {
  return [...new Set(preferredCountries.concat(countries))]
}

export function getCountriesOfContinents(
  continents: readonly MuiTelInputContinent[]
): readonly MuiTelInputCountry[] {
  return continents.flatMap((continentCode) => {
    return CONTINENTS[continentCode]
  })
}

export function getOnlyCountries(
  countries: readonly MuiTelInputCountry[],
  onlyCountries: readonly MuiTelInputCountry[]
): readonly MuiTelInputCountry[] {
  return countries.filter((isoCode) => {
    return onlyCountries.includes(isoCode)
  })
}

export function excludeCountries(
  countries: readonly MuiTelInputCountry[],
  excludedCountries?: readonly MuiTelInputCountry[]
): readonly MuiTelInputCountry[] {
  if (matchIsArray(excludedCountries, true)) {
    return countries.filter((isoCode) => {
      return !excludedCountries.includes(isoCode)
    })
  }

  return countries
}

export function sortAlphabeticallyCountryCodes(
  countryCodes: readonly MuiTelInputCountry[],
  displayNames: Intl.DisplayNames
): readonly MuiTelInputCountry[] {
  return [...countryCodes].sort((countryCodeA, countryCodeB) => {
    const countryA = displayNames.of(countryCodeA) as string
    const countryB = displayNames.of(countryCodeB) as string

    return countryA.localeCompare(countryB)
  })
}

export function filterCountries(
  countries: readonly MuiTelInputCountry[],
  displayNames: Intl.DisplayNames,
  options: FilterCountriesOptions
): readonly MuiTelInputCountry[] {
  const { onlyCountries, excludedCountries, continents, preferredCountries } =
    options

  if (matchIsArray(onlyCountries, true)) {
    const filteredCountries = sortAlphabeticallyCountryCodes(
      getOnlyCountries(countries, onlyCountries),
      displayNames
    )

    return matchIsArray(preferredCountries, true)
      ? sortPreferredCountries(filteredCountries, preferredCountries)
      : filteredCountries
  }

  const theCountries = matchIsArray(continents, true)
    ? getCountriesOfContinents(continents)
    : countries

  const sortedCountries = sortAlphabeticallyCountryCodes(
    theCountries,
    displayNames
  )

  const sortedPreferredCountries = matchIsArray(preferredCountries, true)
    ? sortPreferredCountries(sortedCountries, preferredCountries)
    : sortedCountries

  return matchIsArray(excludedCountries, true)
    ? excludeCountries(sortedPreferredCountries, excludedCountries)
    : sortedPreferredCountries
}

export function matchContinentsIncludeCountry(
  continents: MuiTelInputContinent[],
  isoCode: MuiTelInputCountry
) {
  return continents.some((continentCode) => {
    return CONTINENTS[continentCode].includes(isoCode)
  })
}
