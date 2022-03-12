import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { COUNTRIES, Country } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'
import { getCountryByIsoCode, getDefaultCountry } from '@shared/helpers/country'
import { putCursorAtEnd } from '@shared/helpers/dom'
import { buildValue } from '@shared/helpers/phone-number'
import { assocRefToPropRef } from '@shared/helpers/ref'
import { getOnlyNumbers } from '@shared/helpers/string'
import { useStateWithCallback } from '@shared/hooks/useStateWithCallback'
import * as R from 'ramda'

import FlagButton from './components/FlagButton/FlagButton'
import FlagsMenu from './components/FlagsMenu/FlagsMenu'
import type { CurrentValue, MuiPhoneNumberProps } from './index.types'

function getInitialCountry(
  defaultCountry: MuiPhoneNumberProps['defaultCountry']
) {
  return () => {
    return defaultCountry
      ? getCountryByIsoCode(defaultCountry)
      : getDefaultCountry()
  }
}

const MuiPhoneNumber = (props: MuiPhoneNumberProps) => {
  const {
    onlyCountries,
    excludeCountries,
    defaultCountry,
    onDoubleClick,
    onFocus,
    onCopy,
    inputProps,
    InputProps,
    ref: propRef,
    inputRef: inputRefFromProps,
    disabled,
    ...restTextFieldProps
  } = props
  const textFieldRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(
    getInitialCountry(defaultCountry)
  )
  const [currentValue, setCurrentValue] = useStateWithCallback<CurrentValue>({
    value: `+${selectedCountry.callingCode}`,
    formattedInt: Number(getOnlyNumbers(selectedCountry.callingCode))
  })

  const countriesFiltered = React.useMemo<readonly Country[]>(() => {
    if (matchIsArray(onlyCountries)) {
      return R.filter((item) => {
        return R.includes(item.isoCode, onlyCountries)
      }, COUNTRIES)
    }
    if (matchIsArray(excludeCountries)) {
      return R.filter((item) => {
        return !R.includes(item.isoCode, excludeCountries)
      }, COUNTRIES)
    }
    return COUNTRIES
  }, [excludeCountries, onlyCountries])

  const handleOpenFlagsMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    event.preventDefault()
    if (!disabled) {
      setAnchorEl(textFieldRef.current)
    }
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target
    const formattedInt = getOnlyNumbers(value)

    if (!formattedInt.startsWith(R.toString(selectedCountry.callingCode))) {
      setCurrentValue({
        value: `+${selectedCountry.callingCode}`,
        formattedInt: selectedCountry.callingCode
      })
    } else {
      setCurrentValue({
        value: buildValue(formattedInt, selectedCountry),
        formattedInt: Number(getOnlyNumbers(value))
      })
    }
  }

  const handleSelectCountry = React.useCallback(
    (country: Country) => {
      if (R.identical(country, selectedCountry)) {
        setAnchorEl(null)
        return
      }
      setSelectedCountry(country)
      setCurrentValue(
        {
          value: `+${country.callingCode}`,
          formattedInt: Number(getOnlyNumbers(country.callingCode))
        },
        () => {
          putCursorAtEnd(inputRef.current as HTMLInputElement)
        }
      )
      setAnchorEl(null)
    },
    [setCurrentValue, selectedCountry]
  )

  const handleFocus = (
    event: React.FocusEvent<HTMLInputElement, Element>
  ): void => {
    requestAnimationFrame(() => {
      return putCursorAtEnd(inputRef.current as HTMLInputElement)
    })
    onFocus?.(event)
  }

  const handleDoubleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    const inputElement = inputRef.current as HTMLInputElement
    inputElement.setSelectionRange(0, inputElement.value.length)
    onDoubleClick?.(event)
  }

  const handleCopy = (event: React.ClipboardEvent<HTMLInputElement>): void => {
    if (onCopy) {
      onCopy(event)
      return
    }
    const currentSelection = window.getSelection()
    if (currentSelection) {
      const valueWithoutSpaces = R.pipe((sel: Selection) => {
        return sel.toString()
      }, R.replace(/\s/g, ''))(currentSelection)
      event.clipboardData.setData('text/plain', valueWithoutSpaces)
      event.preventDefault()
    }
  }

  const handleRefInput = (ref: React.RefObject<HTMLInputElement>) => {
    // @ts-ignore
    inputRef.current = ref
    if (InputProps?.inputRef) {
      assocRefToPropRef(ref, InputProps.inputRef)
    }
    if (inputRefFromProps) {
      assocRefToPropRef(ref, inputRefFromProps)
    }
  }

  const handleRef = (ref: HTMLDivElement | null) => {
    // @ts-ignore
    textFieldRef.current = ref
    if (propRef) {
      assocRefToPropRef(ref, propRef)
    }
  }

  const handleCloseFlagsMenu = (): void => {
    setAnchorEl(null)
  }

  return (
    <>
      <TextField
        type="tel"
        disabled={disabled}
        value={currentValue.value}
        ref={handleRef}
        onDoubleClick={handleDoubleClick}
        inputRef={handleRefInput}
        onChange={handleInputChange}
        inputProps={{
          onCopy: handleCopy,
          ...inputProps
        }}
        onFocus={handleFocus}
        InputProps={{
          ...InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <FlagButton
                isFlagsMenuOpened={Boolean(anchorEl)}
                selectedCountry={selectedCountry}
                onClick={handleOpenFlagsMenu}
                disabled={disabled}
              />
            </InputAdornment>
          )
        }}
        {...restTextFieldProps}
      />
      <FlagsMenu
        countries={countriesFiltered}
        anchorEl={anchorEl}
        selectedCountry={selectedCountry}
        onClose={handleCloseFlagsMenu}
        onSelectCountry={handleSelectCountry}
      />
    </>
  )
}

export default MuiPhoneNumber
