import React from 'react'
import Menu, { MenuProps } from '@mui/material/Menu'
import FlagMenuItem from '@components/FlagMenuItem/FlagMenuItem'
import { ISO_CODES, Iso3166Alpha2Code } from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'
import { filterCountries } from '@shared/helpers/country'
import { getDisplayNames } from '@shared/helpers/intl'

export type FlagsMenuProps = Partial<MenuProps> & {
  isoCode: Iso3166Alpha2Code | null
  onlyCountries?: Iso3166Alpha2Code[]
  excludeCountries?: Iso3166Alpha2Code[]
  langOfCountryName?: string
  onSelectCountry: (isoCode: Iso3166Alpha2Code) => void
}

const FlagsMenu = (props: FlagsMenuProps) => {
  const {
    anchorEl,
    isoCode,
    onSelectCountry,
    excludeCountries,
    onlyCountries,
    langOfCountryName,
    ...rest
  } = props

  const countriesFiltered = React.useMemo(() => {
    return filterCountries(ISO_CODES, {
      onlyCountries,
      excludeCountries
    })
  }, [excludeCountries, onlyCountries])

  const displayNames = getDisplayNames(langOfCountryName)

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      id="select-country"
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
            displayNames={displayNames}
            selected={isoCodeItem === isoCode}
            id={`country-${isoCodeItem}`}
          />
        )
      })}
    </Menu>
  )
}

FlagsMenu.defaultProps = {
  onlyCountries: [],
  excludeCountries: [],
  langOfCountryName: DEFAULT_LANG
}

export default FlagsMenu
