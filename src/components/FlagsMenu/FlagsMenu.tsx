import React from 'react'
import FlagMenuItem from '@components/FlagMenuItem/FlagMenuItem'
import Menu, { MenuProps } from '@mui/material/Menu'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import { ISO_CODES, MuiTelInputCountry } from '@shared/constants/countries'
import {
  filterCountries,
  sortAlphabeticallyCountryCodes
} from '@shared/helpers/country'
import { FlagSize } from '../../index.types'

export type FlagsMenuProps = Partial<MenuProps> & {
  isoCode: MuiTelInputCountry | null
  onlyCountries?: MuiTelInputCountry[]
  excludedCountries?: MuiTelInputCountry[]
  preferredCountries?: MuiTelInputCountry[]
  displayNames: Intl.DisplayNames
  flagSize?: FlagSize
  continents?: MuiTelInputContinent[]
  onSelectCountry: (isoCode: MuiTelInputCountry) => void
}

const FlagsMenu = ({
  anchorEl,
  isoCode,
  onSelectCountry,
  excludedCountries = [],
  onlyCountries = [],
  displayNames,
  continents = [],
  preferredCountries = [],
  className,
  flagSize = 'small',
  ...rest
}: FlagsMenuProps) => {
  const ISO_CODES_SORTED = sortAlphabeticallyCountryCodes(
    ISO_CODES,
    displayNames
  )

  const countriesFiltered = filterCountries(ISO_CODES_SORTED, {
    onlyCountries,
    excludedCountries,
    continents,
    preferredCountries
  })

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      id="select-country"
      className={`MuiTelInput-Menu ${className || ''}`}
      MenuListProps={{
        role: 'listbox',
        'aria-activedescendant': isoCode ? `country-${isoCode}` : '',
        'aria-labelledby': 'select-country'
      }}
      {...rest}
    >
      {countriesFiltered.map((isoCodeItem) => {
        return (
          <FlagMenuItem
            onSelectCountry={onSelectCountry}
            key={isoCodeItem}
            isoCode={isoCodeItem}
            countryName={displayNames.of(isoCodeItem)}
            selected={isoCodeItem === isoCode}
            id={`country-${isoCodeItem}`}
            flagSize={flagSize}
          />
        )
      })}
    </Menu>
  )
}

export default FlagsMenu
