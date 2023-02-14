import React from 'react'
import FlagMenuItem from '@components/FlagMenuItem/FlagMenuItem'
import Menu, { MenuProps } from '@mui/material/Menu'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import { ISO_CODES, MuiTelInputCountry } from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'
import {
  filterCountries,
  sortAlphabeticallyCountryCodes
} from '@shared/helpers/country'
import { getDisplayNames } from '@shared/helpers/intl'
import { FlagSize } from '../../index.types'

export type FlagsMenuProps = Partial<MenuProps> & {
  isoCode: MuiTelInputCountry | null
  onlyCountries?: MuiTelInputCountry[]
  excludedCountries?: MuiTelInputCountry[]
  preferredCountries?: MuiTelInputCountry[]
  langOfCountryName?: string
  flagSize?: FlagSize
  continents?: MuiTelInputContinent[]
  onSelectCountry: (isoCode: MuiTelInputCountry) => void
}

const FlagsMenu = (props: FlagsMenuProps) => {
  const {
    anchorEl,
    isoCode,
    onSelectCountry,
    excludedCountries,
    onlyCountries,
    langOfCountryName,
    continents,
    preferredCountries,
    className,
    flagSize,
    ...rest
  } = props

  // Idem for the translations
  const displayNames = React.useMemo(() => {
    return getDisplayNames(langOfCountryName)
  }, [langOfCountryName])

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

FlagsMenu.defaultProps = {
  onlyCountries: [],
  excludedCountries: [],
  continents: [],
  preferredCountries: [],
  flagSize: 'small' as FlagSize,
  langOfCountryName: DEFAULT_LANG
}

export default FlagsMenu
