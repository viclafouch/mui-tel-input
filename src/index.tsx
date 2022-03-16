import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import * as R from '@ramda'
import { Country } from '@shared/constants/countries'
import { putCursorAtEndOfInput } from '@shared/helpers/dom'
import { assocRefToPropRef } from '@shared/helpers/ref'
import {
  getInitialState,
  updateCountry,
  updateInputValue
} from '@shared/helpers/state'
import { usePrevious } from '@shared/hooks/usePrevious'
import { useStateWithCallback } from '@shared/hooks/useStateWithCallback'

import FlagButton from './components/FlagButton/FlagButton'
import FlagsMenu from './components/FlagsMenu/FlagsMenu'
import type { MuiPhoneNumberProps, State } from './index.types'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

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
    const previousValue = usePrevious(value)
    const previousDefaultCountry = usePrevious(defaultCountry)
    const isControlled = value !== undefined
    const originIsControlledRef = React.useRef(isControlled)
    const textFieldRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
    const onChangeCallback = React.useRef(onChange)
    const currentOptionsRef = React.useRef({
      excludeCountries,
      onlyCountries,
      isIsoCodeEditable
    })
    React.useEffect(() => {
      onChangeCallback.current = onChange
      currentOptionsRef.current = {
        excludeCountries,
        onlyCountries,
        isIsoCodeEditable
      }
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
      if (
        (previousValue && previousValue !== value) ||
        (previousDefaultCountry && previousDefaultCountry !== defaultCountry)
      ) {
        setState((prevState) => {
          if (value === '' || value === undefined) {
            return getInitialState({
              initialValue: '',
              excludeCountries: currentOptionsRef.current.excludeCountries,
              onlyCountries: currentOptionsRef.current.onlyCountries,
              defaultCountry
            })
          }
          return updateInputValue(value, prevState, {
            excludeCountries: currentOptionsRef.current.excludeCountries,
            isIsoCodeEditable: currentOptionsRef.current.isIsoCodeEditable,
            onlyCountries: currentOptionsRef.current.onlyCountries
          })
        })
      }
    }, [value, setState, previousValue, defaultCountry, previousDefaultCountry])

    React.useEffect(() => {
      if (!IS_PRODUCTION && originIsControlledRef.current !== isControlled) {
        // eslint-disable-next-line no-console
        console.error(
          `"Mui Phone Number" is changed from ${
            originIsControlledRef.current
              ? 'uncontrolled to controlled'
              : 'controlled to uncontrolled'
          }.`
        )
      }
    }, [isControlled])

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
          if (newState.value !== value) {
            onChangeCallback.current?.(
              {
                value: newState.value,
                country: newState.country,
                formattedInt: newState.formattedInt
              },
              'input'
            )
          }
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
            onChangeCallback.current?.(
              {
                value: newState.value,
                country: newState.country,
                formattedInt: newState.formattedInt
              },
              'country'
            )
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
