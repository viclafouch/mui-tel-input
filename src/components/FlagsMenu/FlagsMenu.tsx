import React from 'react'
import FlagMenuItem from '@components/FlagMenuItem/FlagMenuItem'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import { ISO_CODES, type MuiTelInputCountry } from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'
import { filterCountries } from '@shared/helpers/country'
import { getDisplayNames } from '@shared/helpers/intl'
import Menu, { type MenuProps } from '@mui/material/Menu'
import type { GetFlagElement } from '../../index.types'

export type FlagsMenuProps = Partial<MenuProps> & {
  isoCode: MuiTelInputCountry | null
  onlyCountries?: MuiTelInputCountry[]
  excludedCountries?: MuiTelInputCountry[]
  preferredCountries?: MuiTelInputCountry[]
  langOfCountryName?: string
  continents?: MuiTelInputContinent[]
  onSelectCountry: (isoCode: MuiTelInputCountry) => void
  getFlagElement: GetFlagElement
}

const defaultExcludedCountries: MuiTelInputCountry[] = []
const defaultOnlyCountries: MuiTelInputCountry[] = []
const defaultContinents: MuiTelInputContinent[] = []
const defaultPreferredCountries: MuiTelInputCountry[] = []

export const menuClass = 'MuiTelInput-Menu'

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
  getFlagElement,
  ...restMenuProps
}: FlagsMenuProps) => {
  const displayNames = React.useMemo(() => {
    return getDisplayNames(langOfCountryName)
  }, [langOfCountryName])

  const countriesFiltered = filterCountries(ISO_CODES, displayNames, {
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
      className={`${menuClass} ${className || ''}`}
      slotProps={{
        list: {
          role: 'listbox',
          'aria-activedescendant': isoCode ? `country-${isoCode}` : '',
          'aria-labelledby': 'select-country'
        }
      }}
      {...restMenuProps}
    >
      {countriesFiltered.map((isoCodeItem) => {
        return (
          <FlagMenuItem
            onSelectCountry={onSelectCountry}
            key={isoCodeItem}
            isoCode={isoCodeItem}
            countryName={displayNames.of(isoCodeItem) || ''}
            selected={isoCodeItem === isoCode}
            id={`country-${isoCodeItem}`}
            getFlagElement={getFlagElement}
          />
        )
      })}
    </Menu>
  )
}

export default FlagsMenu
