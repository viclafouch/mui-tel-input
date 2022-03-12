import { COUNTRIES, Country } from '@shared/constants/countries'
import type { Iso3166Alpha2Code } from '@shared/constants/iso'
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
