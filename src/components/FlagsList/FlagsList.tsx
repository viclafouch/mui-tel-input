import React from 'react'
import FlagMenuItem from '@components/FlagMenuItem/FlagMenuItem'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import { ISO_CODES, MuiTelInputCountry } from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'
import { filterCountries } from '@shared/helpers/country'
import { getDisplayNames } from '@shared/helpers/intl'

export type FlagsListProps = {
  isoCode: MuiTelInputCountry | null
  onlyCountries?: MuiTelInputCountry[]
  excludedCountries?: MuiTelInputCountry[]
  preferredCountries?: MuiTelInputCountry[]
  langOfCountryName?: string
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
    continents,
    preferredCountries
  } = props

  // Don't need to refilter when the list is already displayed
  const [countriesFiltered] = React.useState(() => {
    return filterCountries(ISO_CODES, {
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

  // Idem for the translations
  const [displayNames] = React.useState(() => {
    return getDisplayNames(langOfCountryName)
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
  langOfCountryName: DEFAULT_LANG
}

// For performance reasons, we don't need to rerender all items when closing the list
export default FlagsList
