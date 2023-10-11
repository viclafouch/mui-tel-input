/* eslint-disable react/require-default-props */

import React from 'react'
import { matchSorter } from 'match-sorter'
import Flag from '@components/Flag/Flag'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import {
  COUNTRIES,
  ISO_CODES,
  MuiTelInputCountry
} from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'
import {
  filterCountries,
  sortAlphabeticallyCountryCodes
} from '@shared/helpers/country'
import { getDisplayNames } from '@shared/helpers/intl'
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import type { FilterOptionsState } from '@mui/material/useAutocomplete'
import { FlagSize } from '../../index.types'
import { Styled } from './FlagsAutocomplete.styled'

type PopperComponentProps = {
  anchorEl?: unknown
  disablePortal?: boolean
  open: boolean
}

const PopperComponent = (props: PopperComponentProps) => {
  const { disablePortal, anchorEl, open, ...other } = props

  return <Styled.AutocompletePopper {...other} />
}

PopperComponent.defaultProps = {
  anchorEl: null,
  disablePortal: false
}

export type FlagsAutocompleteProps = Partial<
  AutocompleteProps<
    unknown,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >
> & {
  anchorEl: HTMLElement | null
  continents?: MuiTelInputContinent[]
  excludedCountries?: MuiTelInputCountry[]
  flagSize?: FlagSize
  isoCode: MuiTelInputCountry | null
  langOfCountryName?: string
  onClose: () => void
  onlyCountries?: MuiTelInputCountry[]
  onSelectCountry: (isoCode: MuiTelInputCountry) => void
  preferredCountries?: MuiTelInputCountry[]
}

export type MuiTelAutocompleteOption = {
  countryCode: MuiTelInputCountry
  callingCode: string
  displayName: string
}

const FlagsAutocomplete = (props: FlagsAutocompleteProps) => {
  const {
    anchorEl,
    onSelectCountry,
    excludedCountries,
    onlyCountries,
    langOfCountryName,
    continents,
    preferredCountries,
    className,
    flagSize,
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

  const countriesFilteredOptions: MuiTelAutocompleteOption[] =
    countriesFiltered.map((countryCode) => {
      return {
        countryCode,
        callingCode: COUNTRIES[countryCode]?.[0] as string,
        displayName: displayNames.of(countryCode) ?? countryCode
      }
    })

  const filterOptions = (
    options: MuiTelAutocompleteOption[],
    { inputValue }: FilterOptionsState<MuiTelAutocompleteOption>
  ) => {
    if (inputValue === '') {
      return options
    }

    return matchSorter(options, inputValue, {
      keys: ['callingCode', 'countryCode', 'displayName']
    })
  }

  const getOptionLabel = (option: MuiTelAutocompleteOption) => {
    return option.countryCode
  }

  return (
    <Styled.FlagsAutocompletePopper
      anchorEl={anchorEl}
      className={`MuiTelInput-FlagsAutocomplete-Popover ${className || ''}`}
      id="muitelinput-flagsautocomplete"
      open={Boolean(anchorEl)}
      placement="bottom-start"
    >
      <ClickAwayListener onClickAway={onClose}>
        <Autocomplete
          autoHighlight
          filterOptions={filterOptions}
          getOptionLabel={getOptionLabel}
          onChange={(event, newValue, reason) => {
            if (
              event.type === 'keydown' &&
              (event as React.KeyboardEvent).key === 'Backspace' &&
              reason === 'removeOption'
            ) {
              return
            }

            if (newValue !== null) {
              onSelectCountry(newValue.countryCode)
            }
          }}
          onClose={onClose}
          open
          options={countriesFilteredOptions}
          PopperComponent={PopperComponent}
          renderInput={(params) => {
            return (
              <Styled.Input
                className="MuiTelInput-FlagsAutocomplete-Input"
                inputProps={{
                  ...params.inputProps,
                  'data-testid': 'flagsautocomplete-input'
                }}
                placeholder="Search for a country"
                ref={params.InputProps.ref}
              />
            )
          }}
          renderOption={(optionProps, option) => {
            return (
              <ListItem
                {...optionProps}
                alignItems="flex-start"
                className="MuiTelInput-FlagsAutocomplete-ListItem"
                data-testid={`option-${option.countryCode}`}
                role="option"
              >
                <ListItemButton dense>
                  <ListItemIcon className="MuiTelInput-ListItemIcon-flag">
                    <Flag
                      countryName={option.displayName}
                      isoCode={option.countryCode}
                      size={flagSize}
                    />
                  </ListItemIcon>
                  <ListItemText className="MuiTelInput-ListItemText-country">
                    {option.displayName}
                  </ListItemText>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="MuiTelInput-Typography-calling-code"
                  >
                    +{option.callingCode}
                  </Typography>
                </ListItemButton>
              </ListItem>
            )
          }}
        />
      </ClickAwayListener>
    </Styled.FlagsAutocompletePopper>
  )
}

FlagsAutocomplete.defaultProps = {
  continents: [],
  excludedCountries: [],
  flagSize: 'small' as FlagSize,
  langOfCountryName: DEFAULT_LANG,
  onlyCountries: [],
  preferredCountries: []
}

export default FlagsAutocomplete
