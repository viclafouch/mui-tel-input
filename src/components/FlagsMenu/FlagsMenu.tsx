import React from 'react'
import Menu, { MenuProps } from '@mui/material/Menu'
import FlagMenuItem from '@components/FlagMenuItem/FlagMenuItem'
import type { Country } from '@shared/constants/countries'

export type FlagsMenuProps = Pick<MenuProps, 'anchorEl' | 'onClose'> & {
  countries: readonly Country[]
  onSelectCountry: (country: Country) => void
}

const FlagsMenu = (props: FlagsMenuProps) => {
  const { anchorEl, countries, onSelectCountry, ...rest } = props

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} {...rest}>
      {countries.map((country) => {
        return (
          <FlagMenuItem
            onSelectCountry={onSelectCountry}
            key={country.isoCode}
            country={country}
          />
        )
      })}
    </Menu>
  )
}

export default FlagsMenu
