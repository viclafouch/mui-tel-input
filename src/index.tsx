import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import FlagButton from '@components/FlagButton/FlagButton'
import FlagsMenu from '@components/FlagsMenu/FlagsMenu'
import { putCursorAtEndOfInput } from '@shared/helpers/dom'
import { assocRefToPropRef } from '@shared/helpers/ref'
import { useMismatchProps } from '@shared/hooks/useMissmatchProps'
import usePhoneDigits from '@shared/hooks/usePhoneDigits'

import type {
  MuiTelInputContinent,
  MuiTelInputCountry,
  MuiTelInputInfo,
  MuiTelInputProps,
  MuiTelInputReason
} from './index.types'

export { isValidPhoneNumber, AsYouType } from 'libphonenumber-js'

export type {
  MuiTelInputProps,
  MuiTelInputReason,
  MuiTelInputInfo,
  MuiTelInputCountry,
  MuiTelInputContinent
}

const MuiTelInput = React.forwardRef(
  (props: MuiTelInputProps, propRef: MuiTelInputProps['ref']) => {
    const {
      forceCallingCode,
      onlyCountries,
      excludedCountries,
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
      continents,
      preferredCountries,
      MenuProps,
      className,
      ...restTextFieldProps
    } = props
    const textFieldRef = React.useRef<HTMLDivElement>(null)
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)

    useMismatchProps(props)

    const { onInputChange, onCountryChange, inputRef, isoCode, inputValue } =
      usePhoneDigits({
        defaultCountry,
        value,
        onChange,
        forceCallingCode,
        excludedCountries,
        onlyCountries,
        disableFormatting,
        continents
      })

    const handleOpenFlagsMenu = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
      event.preventDefault()
      if (!disabled || !disableDropdown) {
        setAnchorEl(textFieldRef.current)
      }
    }

    const focusInputElement = (): void => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    const handleChangeCountry = (newCountry: MuiTelInputCountry): void => {
      setAnchorEl(null)
      onCountryChange(newCountry)
      if (focusOnSelectCountry) {
        focusInputElement()
      }
    }

    const handleFocus = (
      event: React.FocusEvent<HTMLInputElement, Element>
    ): void => {
      queueMicrotask(() => {
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

    const handleRefInput = (ref: React.RefObject<HTMLInputElement>): void => {
      // @ts-ignore
      inputRef.current = ref
      if (InputProps?.inputRef) {
        assocRefToPropRef(ref, InputProps.inputRef)
      }
      if (inputRefFromProps) {
        assocRefToPropRef(ref, inputRefFromProps)
      }
    }

    const handleRef = (ref: HTMLDivElement | null): void => {
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
          className={`MuiTelInput-TextField ${className || ''}`}
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
            excludedCountries={excludedCountries}
            continents={continents}
            anchorEl={anchorEl}
            isoCode={isoCode}
            preferredCountries={preferredCountries}
            onClose={handleCloseFlagsMenu}
            langOfCountryName={langOfCountryName}
            onSelectCountry={handleChangeCountry}
            {...MenuProps}
          />
        ) : null}
      </>
    )
  }
)

export { MuiTelInput }
