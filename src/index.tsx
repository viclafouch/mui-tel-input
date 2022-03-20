import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import FlagButton from '@components/FlagButton/FlagButton'
import FlagsMenu from '@components/FlagsMenu/FlagsMenu'
import { Iso3166Alpha2Code } from '@shared/constants/countries'
import { putCursorAtEndOfInput } from '@shared/helpers/dom'
import { assocRefToPropRef } from '@shared/helpers/ref'
import usePhoneDigits from '@shared/hooks/usePhoneDigits'

import type {
  MuiTelInputProps,
  MuiTelInputReason,
  MuiTelInputValues
} from './index.types'

export type { MuiTelInputProps, MuiTelInputValues, MuiTelInputReason }

const MuiTelInput = React.forwardRef(
  (props: MuiTelInputProps, propRef: MuiTelInputProps['ref']) => {
    const {
      forceCallingCode,
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
      disableDropdown,
      disableFormatting,
      focusOnSelectCountry,
      langOfCountryName,
      ...restTextFieldProps
    } = props
    const textFieldRef = React.useRef<HTMLDivElement>(null)
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
    const onChangeCallback = React.useRef(onChange)
    const currentOptionsRef = React.useRef({
      excludeCountries,
      onlyCountries,
      disableFormatting
    })
    React.useEffect(() => {
      onChangeCallback.current = onChange
      currentOptionsRef.current = {
        excludeCountries,
        onlyCountries,
        disableFormatting
      }
    })
    const { onInputChange, onCountryChange, inputRef, isoCode, inputValue } =
      usePhoneDigits({
        defaultCountry,
        value,
        onChange,
        forceCallingCode
      })

    const handleOpenFlagsMenu = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
      event.preventDefault()
      if (!disabled || !disableDropdown) {
        setAnchorEl(textFieldRef.current)
      }
    }

    const focusInputElement = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    const handleChangeCountry = (newCountry: Iso3166Alpha2Code) => {
      setAnchorEl(null)
      onCountryChange(newCountry)
      if (focusOnSelectCountry) {
        focusInputElement()
      }
    }

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
        const valueWithoutSpaces = currentSelection
          .toString()
          .replaceAll(' ', '')
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
          value={inputValue}
          ref={handleRef}
          onDoubleClick={handleDoubleClick}
          inputRef={handleRefInput}
          onChange={onInputChange}
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
                  isoCode={isoCode}
                  onClick={handleOpenFlagsMenu}
                  disabled={disabled}
                  disableDropdown={Boolean(disableDropdown)}
                />
              </InputAdornment>
            )
          }}
          {...restTextFieldProps}
        />
        {!disableDropdown ? (
          <FlagsMenu
            onlyCountries={onlyCountries}
            excludeCountries={excludeCountries}
            anchorEl={anchorEl}
            isoCode={isoCode}
            onClose={handleCloseFlagsMenu}
            langOfCountryName={langOfCountryName}
            onSelectCountry={handleChangeCountry}
          />
        ) : null}
      </>
    )
  }
)

export default MuiTelInput
