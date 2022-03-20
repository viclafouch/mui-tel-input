/* eslint-disable no-console */
import React from 'react'
import { getFirstIntersection } from '@shared/helpers/array'

import { MuiTelInputProps } from '../../index.types'

export function useMismatchProps(props: MuiTelInputProps) {
  const { defaultCountry, onlyCountries, excludeCountries } = props

  React.useEffect(() => {
    if (onlyCountries && excludeCountries) {
      const intersection = getFirstIntersection(onlyCountries, excludeCountries)
      if (intersection) {
        console.error(
          `[mui-tel-input] Not expected to have the country ${intersection} to be included in the 'onlyCountries' AND 'excludeCountries' props`
        )
      }
    }
  }, [onlyCountries, excludeCountries])

  React.useEffect(() => {
    if (defaultCountry) {
      if (onlyCountries && !onlyCountries.includes(defaultCountry)) {
        console.error(
          `[mui-tel-input] Not expected to have a 'defaultCountry' prop (${defaultCountry}) and a 'onlyCountries' prop but without included the 'defaultCountry' (${defaultCountry})`
        )
      }
      if (excludeCountries && excludeCountries.includes(defaultCountry)) {
        console.error(
          `[mui-tel-input] Not expected to have the 'defaultCountry' (${defaultCountry}) prop excluded by the 'excludeCountries' prop`
        )
      }
    }
  }, [defaultCountry, onlyCountries, excludeCountries])
}
