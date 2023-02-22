import React from 'react'
import { matchSorter } from 'match-sorter'
import Flag from '@components/Flag/Flag'
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
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
import { FlagSize } from '../../index.types'
import { Styled } from './FlagsAutocomplete.styled'

interface PopperComponentProps {
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

  const countriesFilteredOptions = countriesFiltered.map((countryCode) => {
    return {
      countryCode,
      label: displayNames.of(countryCode) ?? countryCode
    }
  })

  return (
    <Styled.Popper
      id="select-country-autocomplete"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      className={`MuiTelInput-Autocomplete-Popover ${className || ''}`}
      placement="bottom-start"
    >
      <ClickAwayListener onClickAway={onClose}>
        <Autocomplete
          open
          PopperComponent={PopperComponent}
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
          options={countriesFilteredOptions}
          filterOptions={(options, { inputValue }) => {
            return matchSorter(options, inputValue, {
              keys: ['countryCode', 'label']
            })
          }}
          renderInput={(params) => {
            return (
              <Styled.Input
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                autoFocus
                placeholder="Search for a country"
              />
            )
          }}
          renderOption={(optionProps, option) => {
            return (
              <ListItem
                {...optionProps}
                alignItems="flex-start"
                secondaryAction={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="MuiTelInput-Typography-calling-code"
                  >
                    +{COUNTRIES[option.countryCode]?.[0]}
                  </Typography>
                }
              >
                <Styled.ListItemIcon className="MuiTelInput-ListItemIcon-flag">
                  <Flag
                    size={flagSize}
                    isoCode={option.countryCode}
                    countryName={option.label}
                  />
                </Styled.ListItemIcon>
                <Styled.ListItemText className="MuiTelInput-ListItemText-country">
                  {option.label}
                </Styled.ListItemText>
              </ListItem>
            )
          }}
        />
      </ClickAwayListener>
    </Styled.Popper>
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
