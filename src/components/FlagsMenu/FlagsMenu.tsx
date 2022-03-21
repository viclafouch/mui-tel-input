import React from 'react'
import Menu, { MenuProps } from '@mui/material/Menu'
import FlagsList from '@components/FlagsList/FlagsList'
import type { ContinentCode } from '@shared/constants/continents'
import { Iso3166Alpha2Code } from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'

export type FlagsMenuProps = Partial<MenuProps> & {
  isoCode: Iso3166Alpha2Code | null
  onlyCountries?: Iso3166Alpha2Code[]
  excludedCountries?: Iso3166Alpha2Code[]
  preferredCountries?: Iso3166Alpha2Code[]
  langOfCountryName?: string
  continents?: ContinentCode[]
  onSelectCountry: (isoCode: Iso3166Alpha2Code) => void
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
    ...rest
  } = props

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
      <FlagsList
        onlyCountries={onlyCountries}
        excludedCountries={excludedCountries}
        preferredCountries={preferredCountries}
        continents={continents}
        isoCode={isoCode}
        langOfCountryName={langOfCountryName}
        onSelectCountry={onSelectCountry}
      />
    </Menu>
  )
}

FlagsMenu.defaultProps = {
  onlyCountries: [],
  excludedCountries: [],
  continents: [],
  preferredCountries: [],
  langOfCountryName: DEFAULT_LANG
}

export default FlagsMenu
