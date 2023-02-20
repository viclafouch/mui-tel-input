import React from 'react'
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import InputBase from '@mui/material/InputBase'
import Popper from '@mui/material/Popper'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import { ISO_CODES, MuiTelInputCountry } from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'
import {
  filterCountries,
  sortAlphabeticallyCountryCodes
} from '@shared/helpers/country'
import { getDisplayNames } from '@shared/helpers/intl'
import { FlagSize } from '../../index.types'

export type FlagsAutocompleteProps = Partial<
  AutocompleteProps<
    unknown,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >
> & {
  anchorEl: HTMLElement | null
  isoCode: MuiTelInputCountry | null
  onlyCountries?: MuiTelInputCountry[]
  excludedCountries?: MuiTelInputCountry[]
  preferredCountries?: MuiTelInputCountry[]
  langOfCountryName?: string
  flagSize?: FlagSize
  continents?: MuiTelInputContinent[]
  onSelectCountry: (isoCode: MuiTelInputCountry) => void
  onClose: () => void
}

const FlagsAutocomplete = (props: FlagsAutocompleteProps) => {
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
    onClose
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

  // TODO: Figure out ARIA label stuff
  // TODO: Figure out the individual menu item
  // TODO: Figure out styling
  return (
    <Popper
      id="select-country"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      className={`MuiTelInput-Autocomplete-Popover ${className || ''}`}
      placement="bottom-start"
    >
      <ClickAwayListener onClickAway={onClose}>
        <Autocomplete
          open
          value={isoCode}
          onChange={(event, newValue, reason) => {
            if (
              event.type === 'keydown' &&
              (event as React.KeyboardEvent).key === 'Backspace' &&
              reason === 'removeOption'
            ) {
              return
            }

            onSelectCountry(newValue as MuiTelInputCountry)
          }}
          onClose={onClose}
          options={countriesFiltered}
          renderInput={(params) => {
            return (
              <InputBase
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                autoFocus
                placeholder="Search for a country"
              />
            )
          }}
          renderOption={(optionProps, option) => {
            return (
              <li {...optionProps}>
                <Box>{displayNames.of(option)}</Box>
              </li>
            )
          }}
        />
      </ClickAwayListener>
    </Popper>
  )
}

FlagsAutocomplete.defaultProps = {
  onlyCountries: [],
  excludedCountries: [],
  continents: [],
  preferredCountries: [],
  flagSize: 'small' as FlagSize,
  langOfCountryName: DEFAULT_LANG
}

export default FlagsAutocomplete
