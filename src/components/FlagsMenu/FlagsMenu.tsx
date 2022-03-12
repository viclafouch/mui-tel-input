import React from 'react'
import Menu, { MenuProps } from '@mui/material/Menu'
import FlagMenuItem from '@components/FlagMenuItem/FlagMenuItem'
import type { Country } from '@shared/constants/countries'

export type FlagsMenuProps = Pick<MenuProps, 'anchorEl' | 'onClose'> & {
  countries: readonly Country[]
  selectedCountry: Country
  onSelectCountry: (country: Country) => void
}

const FlagsMenu = (props: FlagsMenuProps) => {
  const { anchorEl, countries, selectedCountry, onSelectCountry, ...rest } =
    props

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      id="select-country"
      MenuListProps={{
        role: 'listbox',
        'aria-activedescendant': `country-${selectedCountry.name}`,
        'aria-labelledby': 'select-country'
      }}
      {...rest}
    >
      {countries.map((country) => {
        return (
          <FlagMenuItem
            onSelectCountry={onSelectCountry}
            key={country.isoCode}
            country={country}
            selected={country === selectedCountry}
            id={`country-${country.name}`}
          />
        )
      })}
    </Menu>
  )
}

export default FlagsMenu
