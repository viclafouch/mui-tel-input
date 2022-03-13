import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { Country } from '@shared/constants/countries'
import {
  getCountryByCallingCode,
  getCountryByIsoCode,
  getDefaultCountry
} from '@shared/helpers/country'
import { putCursorAtEndOfInput } from '@shared/helpers/dom'
import {
  buildValue,
  getCallingCode,
  matchStartsWithCallingCode
} from '@shared/helpers/phone-number'
import { assocRefToPropRef } from '@shared/helpers/ref'
import { getOnlyNumbers, numericToNumber } from '@shared/helpers/string'
import { usePrevious } from '@shared/hooks/usePrevious'
import { useStateWithCallback } from '@shared/hooks/useStateWithCallback'
import * as R from 'ramda'

import FlagButton from './components/FlagButton/FlagButton'
import FlagsMenu from './components/FlagsMenu/FlagsMenu'
import type { MuiPhoneNumberProps, State } from './index.types'

function getInitialCountry(
  defaultCountry: MuiPhoneNumberProps['defaultCountry']
) {
  return defaultCountry
    ? getCountryByIsoCode(defaultCountry)
    : getDefaultCountry()
}

const MuiPhoneNumber = React.forwardRef(
  (props: MuiPhoneNumberProps, propRef: MuiPhoneNumberProps['ref']) => {
    const {
      isIsoCodeEditable,
      onlyCountries,
      excludeCountries,
      defaultCountry,
      onDoubleClick,
      onFocus,
      onCopy,
      inputProps,
      InputProps,
      inputRef: inputRefFromProps,
      disabled,
      ...restTextFieldProps
    } = props
    const textFieldRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
    const [state, setState] = useStateWithCallback<State>(() => {
      const initialCountry = getInitialCountry(defaultCountry)
      return {
        value: `+${initialCountry.callingCode}`,
        formattedInt: initialCountry.callingCode,
        country: getInitialCountry(defaultCountry),
        hasSelectCountry: false
      }
    })
    const previousFormattedInt = usePrevious(state.formattedInt)

    React.useEffect(() => {
      const country = getInitialCountry(defaultCountry)
      setState((prevState) => {
        const isEmpty = prevState.formattedInt === prevState.country.callingCode
        if (
          prevState.hasSelectCountry ||
          prevState.country === country ||
          !isEmpty
        ) {
          return prevState
        }
        return {
          hasSelectCountry: false,
          value: `+${country.callingCode}`,
          formattedInt: country.callingCode,
          country
        }
      })
    }, [defaultCountry, setState])

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
      const value = getOnlyNumbers(event.target.value)
      const { country } = state

      if (
        !isIsoCodeEditable &&
        !matchStartsWithCallingCode(Number(value), country.callingCode)
      ) {
        setState((prevState) => {
          return {
            ...prevState,
            value: `+${country.callingCode}`,
            formattedInt: country.callingCode
          }
        })
      } else {
        const newFormattedInt = numericToNumber(value) || null
        const previousCallingCode = previousFormattedInt
          ? getCallingCode(previousFormattedInt)
          : null
        const currentCallingCode = getCallingCode(value)
        if (currentCallingCode && currentCallingCode === previousCallingCode) {
          setState((prevState) => {
            return {
              ...prevState,
              value: buildValue(value, country),
              formattedInt: newFormattedInt
            }
          })
        } else {
          const newCountry = currentCallingCode
            ? getCountryByCallingCode(currentCallingCode)
            : null
          setState((prevState) => {
            return {
              ...prevState,
              country: newCountry || prevState.country,
              value: buildValue(value, newCountry || prevState.country),
              formattedInt: newFormattedInt
            }
          })
        }
      }
    }

    const handleSelectCountry = React.useCallback(
      (country: Country) => {
        if (R.identical(country, state.country)) {
          setAnchorEl(null)
          return
        }
        setState(
          {
            country,
            value: `+${country.callingCode}`,
            formattedInt: Number(getOnlyNumbers(country.callingCode)),
            hasSelectCountry: true
          },
          () => {
            putCursorAtEndOfInput(inputRef.current as HTMLInputElement)
          }
        )
        setAnchorEl(null)
      },
      [setState, state.country]
    )

    const handleFocus = (
      event: React.FocusEvent<HTMLInputElement, Element>
    ): void => {
      requestAnimationFrame(() => {
        return putCursorAtEndOfInput(inputRef.current as HTMLInputElement)
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

    const handleCopy = (
      event: React.ClipboardEvent<HTMLInputElement>
    ): void => {
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
          value={state.value}
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
                  selectedCountry={state.country}
                  onClick={handleOpenFlagsMenu}
                  disabled={disabled}
                />
              </InputAdornment>
            )
          }}
          {...restTextFieldProps}
        />
        <FlagsMenu
          onlyCountries={onlyCountries}
          excludeCountries={excludeCountries}
          anchorEl={anchorEl}
          selectedCountry={state.country}
          onClose={handleCloseFlagsMenu}
          onSelectCountry={handleSelectCountry}
        />
      </>
    )
  }
)

export default MuiPhoneNumber
