import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import * as R from '@ramda'
import { Country } from '@shared/constants/countries'
import { putCursorAtEndOfInput } from '@shared/helpers/dom'
import { updateDefaultCountry } from '@shared/helpers/props'
import { assocRefToPropRef } from '@shared/helpers/ref'
import {
  getInitialState,
  updateCountry,
  updateInputValue
} from '@shared/helpers/state'
import { useStateWithCallback } from '@shared/hooks/useStateWithCallback'

import FlagButton from './components/FlagButton/FlagButton'
import FlagsMenu from './components/FlagsMenu/FlagsMenu'
import type { MuiPhoneNumberProps, State } from './index.types'

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
      value,
      inputProps,
      InputProps,
      inputRef: inputRefFromProps,
      disabled,
      onChange,
      ...restTextFieldProps
    } = props
    const textFieldRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
    const onChangeCallback = React.useRef(onChange)
    React.useEffect(() => {
      onChangeCallback.current = onChange
    })
    const [state, setState] = useStateWithCallback<State>(() => {
      return getInitialState({
        initialValue: value,
        onlyCountries,
        excludeCountries,
        defaultCountry
      })
    })

    const handleOpenFlagsMenu = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
      event.preventDefault()
      if (!disabled) {
        setAnchorEl(textFieldRef.current)
      }
    }

    React.useEffect(() => {
      setState(
        (prevState) => {
          return updateDefaultCountry(prevState, defaultCountry)
        },
        (newState) => {
          onChangeCallback.current?.({
            value: newState.value,
            country: newState.country,
            formattedInt: newState.formattedInt
          })
        }
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultCountry, setState])

    const handleInputChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const inputValue = event.target.value
      setState(
        (prevState) => {
          return updateInputValue(inputValue, prevState, {
            isIsoCodeEditable,
            excludeCountries,
            onlyCountries
          })
        },
        (newState) => {
          onChangeCallback.current?.({
            value: newState.value,
            country: newState.country,
            formattedInt: newState.formattedInt
          })
        }
      )
    }

    const handleSelectCountry = React.useCallback(
      (country: Country) => {
        setState(
          (prevState) => {
            return updateCountry(country, prevState)
          },
          (newState) => {
            onChangeCallback.current?.({
              value: newState.value,
              country: newState.country,
              formattedInt: newState.formattedInt
            })
          }
        )
        setAnchorEl(null)
      },
      [setState]
    )

    const handleFocus = (
      event: React.FocusEvent<HTMLInputElement, Element>
    ): void => {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          putCursorAtEndOfInput(inputRef.current)
        }
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
