/* eslint-disable react/hook-use-state */
import React from 'react'
import type { FlagStyle } from '@components/Flag/Flag'
import FlagMenuItem from '@components/FlagMenuItem/FlagMenuItem'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import { ISO_CODES, MuiTelInputCountry } from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'
import {
  filterCountries,
  sortAlphabeticallyCountryCodes
} from '@shared/helpers/country'
import { getDisplayNames } from '@shared/helpers/intl'

export type FlagsListProps = {
  isoCode: MuiTelInputCountry | null
  onlyCountries?: MuiTelInputCountry[]
  excludedCountries?: MuiTelInputCountry[]
  preferredCountries?: MuiTelInputCountry[]
  langOfCountryName?: string
  flagStyle?: FlagStyle
  continents?: MuiTelInputContinent[]
  onSelectCountry: (isoCode: MuiTelInputCountry) => void
}

const FlagsList = (props: FlagsListProps) => {
  const {
    isoCode,
    onSelectCountry,
    excludedCountries,
    onlyCountries,
    langOfCountryName,
    flagStyle,
    continents,
    preferredCountries
  } = props

  // Idem for the translations
  const [displayNames] = React.useState(() => {
    return getDisplayNames(langOfCountryName)
  })

  // Don't need to refilter when the list is already displayed
  const [countriesFiltered] = React.useState(() => {
    const ISO_CODES_SORTED = sortAlphabeticallyCountryCodes(
      ISO_CODES,
      displayNames
    )

    return filterCountries(ISO_CODES_SORTED, {
      onlyCountries,
      excludedCountries,
      continents,
      preferredCountries
    })
  })

  // Same for the callback, we don't trust the parent for useCallback or not
  const [onSelectCountryMemo] = React.useState(() => {
    return onSelectCountry
  })

  return (
    <>
      {countriesFiltered.map((isoCodeItem) => {
        return (
          <FlagMenuItem
            onSelectCountry={onSelectCountryMemo}
            key={isoCodeItem}
            isoCode={isoCodeItem}
            displayNames={displayNames}
            flagStyle={flagStyle}
            selected={isoCodeItem === isoCode}
            id={`country-${isoCodeItem}`}
          />
        )
      })}
    </>
  )
}

FlagsList.defaultProps = {
  onlyCountries: [],
  excludedCountries: [],
  continents: [],
  preferredCountries: [],
  langOfCountryName: DEFAULT_LANG,
  flagStyle: {}
}

// For performance reasons, we don't need to rerender all items when closing the list
export default FlagsList
