import React from 'react'
import Menu, { MenuProps } from '@mui/material/Menu'
import FlagMenuItem from '@components/FlagMenuItem/FlagMenuItem'
import { COUNTRIES, Country } from '@shared/constants/countries'
import { Iso3166Alpha2Code } from '@shared/constants/iso'
import { DEFAULT_LANG, DISPLAY_NAMES_OPTIONS } from '@shared/constants/lang'
import { filterCountries } from '@shared/helpers/country'

export type FlagsMenuProps = Pick<MenuProps, 'anchorEl' | 'onClose'> & {
  selectedCountry: Country
  onlyCountries?: Iso3166Alpha2Code[]
  excludeCountries?: Iso3166Alpha2Code[]
  langOfCountryName?: Iso3166Alpha2Code
  onSelectCountry: (country: Country) => void
}

const getDisplayNames = (
  langOfCountryName?: Iso3166Alpha2Code
): Intl.DisplayNames => {
  try {
    return new Intl.DisplayNames(
      langOfCountryName || DEFAULT_LANG,
      DISPLAY_NAMES_OPTIONS
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return new Intl.DisplayNames(DEFAULT_LANG, DISPLAY_NAMES_OPTIONS)
  }
}

const FlagsMenu = (props: FlagsMenuProps) => {
  const {
    anchorEl,
    selectedCountry,
    onSelectCountry,
    excludeCountries,
    onlyCountries,
    langOfCountryName,
    ...rest
  } = props

  const countriesFiltered = React.useMemo<readonly Country[]>(() => {
    return filterCountries(COUNTRIES, {
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
        'aria-activedescendant': `country-${selectedCountry.isoCode}`,
        'aria-labelledby': 'select-country'
      }}
      {...rest}
    >
      {countriesFiltered.map((country) => {
        return (
          <FlagMenuItem
            onSelectCountry={onSelectCountry}
            key={country.isoCode}
            country={country}
            displayNames={displayNames}
            selected={country.isoCode === selectedCountry.isoCode}
            id={`country-${country.isoCode}`}
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
