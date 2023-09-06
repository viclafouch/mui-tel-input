import React from 'react'
import FlagMenuItem from '@components/FlagMenuItem/FlagMenuItem'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import { ISO_CODES, MuiTelInputCountry } from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'
import {
  filterCountries,
  sortAlphabeticallyCountryCodes
} from '@shared/helpers/country'
import { getDisplayNames } from '@shared/helpers/intl'
import Menu, { MenuProps } from '@mui/material/Menu'
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

const defaultExcludedCountries: MuiTelInputCountry[] = []
const defaultOnlyCountries: MuiTelInputCountry[] = []
const defaultContinents: MuiTelInputContinent[] = []
const defaultPreferredCountries: MuiTelInputCountry[] = []

const FlagsMenu = ({
  anchorEl,
  isoCode,
  onSelectCountry,
  excludedCountries = defaultExcludedCountries,
  onlyCountries = defaultOnlyCountries,
  langOfCountryName = DEFAULT_LANG,
  continents = defaultContinents,
  preferredCountries = defaultPreferredCountries,
  className,
  flagSize = 'small',
  ...rest
}: FlagsMenuProps) => {
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

export default FlagsMenu
