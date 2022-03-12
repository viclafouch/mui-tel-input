import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { COUNTRIES, Country } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'
import * as R from 'ramda'

import FlagButton from './components/FlagButton/FlagButton'
import FlagsMenu from './components/FlagsMenu/FlagsMenu'
import type { MuiPhoneNumberProps } from './index.types'

const MuiPhoneNumber = (props: MuiPhoneNumberProps) => {
  const { excludeCountries, ...textFieldProps } = props
  const textFieldRef = React.useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)

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
              <FlagButton onClick={handleOpenFlagsMenu} />
            </InputAdornment>
          )
        }}
        {...textFieldProps}
      />
      <FlagsMenu
        countries={countriesFiltered}
        anchorEl={anchorEl}
        onClose={handleCloseFlagsMenu}
      />
    </>
  )
}

export default MuiPhoneNumber
