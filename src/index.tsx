import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { COUNTRIES, Country } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'
import { getCountryByIsoCode, getDefaultCountry } from '@shared/helpers/country'
import * as R from 'ramda'

import FlagButton from './components/FlagButton/FlagButton'
import FlagsMenu from './components/FlagsMenu/FlagsMenu'
import type { MuiPhoneNumberProps } from './index.types'

function getInitialCountry(
  defaultCountry: MuiPhoneNumberProps['defaultCountry']
) {
  return () => {
    return defaultCountry
      ? getCountryByIsoCode(defaultCountry)
      : getDefaultCountry()
  }
}

const MuiPhoneNumber = (props: MuiPhoneNumberProps) => {
  const { excludeCountries, defaultCountry, ...textFieldProps } = props
  const textFieldRef = React.useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(
    getInitialCountry(defaultCountry)
  )

  const countriesFiltered = React.useMemo<readonly Country[]>(() => {
    if (matchIsArray(excludeCountries)) {
      return R.filter((item) => {
        return R.includes(item.isoCode, excludeCountries)
      }, COUNTRIES)
    }
    return COUNTRIES
  }, [excludeCountries])

  const handleOpenFlagsMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault()
    setAnchorEl(textFieldRef.current)
  }

  const handleSelectCountry = React.useCallback((country: Country) => {
    setSelectedCountry(country)
    setAnchorEl(null)
  }, [])

  const handleCloseFlagsMenu = (): void => {
    setAnchorEl(null)
  }

  return (
    <>
      <TextField
        type="tel"
        ref={textFieldRef}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FlagButton
                selectedCountry={selectedCountry}
                onClick={handleOpenFlagsMenu}
              />
            </InputAdornment>
          )
        }}
        {...textFieldProps}
      />
      <FlagsMenu
        countries={countriesFiltered}
        anchorEl={anchorEl}
        onClose={handleCloseFlagsMenu}
        onSelectCountry={handleSelectCountry}
      />
    </>
  )
}

export default MuiPhoneNumber
