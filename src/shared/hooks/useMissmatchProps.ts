import React from 'react'
import { CONTINENTS } from '@shared/constants/continents'
import { getFirstIntersection } from '@shared/helpers/array'
import { log } from '@shared/helpers/log'
import { MuiTelInputProps } from '../../index.types'

export function useMismatchProps(props: MuiTelInputProps) {
  const {
    defaultCountry,
    onlyCountries,
    excludedCountries,
    continents,
    forceCallingCode
  } = props

  React.useEffect(() => {
    if (onlyCountries && excludedCountries) {
      const intersection = getFirstIntersection(
        onlyCountries,
        excludedCountries
      )
      if (intersection) {
        log(
          `[mui-tel-input] Not expected to have the country ${intersection} to be included in the 'onlyCountries' AND 'excludedCountries' props`
        )
      }
    }
  }, [onlyCountries, excludedCountries])

  React.useEffect(() => {
    if (defaultCountry) {
      if (excludedCountries && excludedCountries.includes(defaultCountry)) {
        log(
          `[mui-tel-input] Not expected to have the 'defaultCountry' (${defaultCountry}) prop excluded by the 'excludedCountries' prop`
        )
      }
    }
  }, [defaultCountry, excludedCountries])

  React.useEffect(() => {
    if (defaultCountry) {
      if (onlyCountries && !onlyCountries.includes(defaultCountry)) {
        log(
          `[mui-tel-input] Not expected to have a 'defaultCountry' prop (${defaultCountry}) and a 'onlyCountries' prop but without included the 'defaultCountry' (${defaultCountry})`
        )
      }
    }
  }, [defaultCountry, onlyCountries])

  React.useEffect(() => {
    if (defaultCountry && continents && continents.length > 0) {
      const continentOfDefaultCountry = continents.some((continentCode) => {
        return CONTINENTS[continentCode].includes(defaultCountry)
      })
      if (!continentOfDefaultCountry) {
        log(
          `[mui-tel-input] Not expected to have a 'defaultCountry' prop (${defaultCountry}) and a 'continents' prop that are not contain the country (${defaultCountry})`
        )
      }
    }
  }, [defaultCountry, continents])

  React.useEffect(() => {
    if (forceCallingCode && !defaultCountry) {
      log(
        `[mui-tel-input] 'forceCallingCode' needs 'defaultCountry' defined. Will default to US.`
      )
    }
  }, [defaultCountry, forceCallingCode])
}
