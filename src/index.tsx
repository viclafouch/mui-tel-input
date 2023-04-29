import React from 'react'
import FlagButton from '@components/FlagButton/FlagButton'
import FlagsAutocomplete, {
  FlagsAutocompleteProps
} from '@components/FlagsAutocomplete/FlagsAutocomplete'
import FlagsMenu, { FlagsMenuProps } from '@components/FlagsMenu/FlagsMenu'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import {
  getCallingCodeOfCountry,
  getValidCountry
} from '@shared/helpers/country'
import { putCursorAtEndOfInput } from '@shared/helpers/dom'
import { assocRefToPropRef } from '@shared/helpers/ref'
import { removeOccurrence } from '@shared/helpers/string'
import { useMismatchProps } from '@shared/hooks/useMissmatchProps'
import usePhoneDigits from '@shared/hooks/usePhoneDigits'
import type {
  MuiTelInputContinent,
  MuiTelInputCountry,
  MuiTelInputInfo,
  MuiTelInputProps,
  MuiTelInputReason
} from './index.types'

export {
  isValidPhoneNumber as matchIsValidTel,
  AsYouType,
  getNumberType
} from 'libphonenumber-js'

export type {
  MuiTelInputProps,
  MuiTelInputReason,
  MuiTelInputInfo,
  MuiTelInputCountry,
  MuiTelInputContinent
}

type FlagsDropdownProps = Pick<
  MuiTelInputProps,
  'allowSearch' | 'MenuProps' | 'FlagsAutocompleteCustomProps'
> &
  FlagsAutocompleteProps &
  FlagsMenuProps

const FlagsDropdown = (props: FlagsDropdownProps) => {
  const { allowSearch, MenuProps, FlagsAutocompleteCustomProps, ...rest } =
    props

  if (allowSearch) {
    return <FlagsAutocomplete {...FlagsAutocompleteCustomProps} {...rest} />
  }

  return <FlagsMenu {...MenuProps} {...rest} />
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
      value = '',
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
      allowSearch,
      flagSize = 'small',
      ...restTextFieldProps
    } = props
    const textFieldRef = React.useRef<HTMLDivElement>(null)
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)
    const validDefaultCountry = forceCallingCode
      ? getValidCountry(defaultCountry)
      : defaultCountry

    useMismatchProps(props)

    const { onInputChange, onCountryChange, inputRef, isoCode, inputValue } =
      usePhoneDigits({
        forceCallingCode,
        defaultCountry: validDefaultCountry,
        value: value ?? '',
        onChange,
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

    const handleChangeCountry = (newCountry: MuiTelInputCountry): void => {
      setAnchorEl(null)
      onCountryChange(newCountry)
      if (focusOnSelectCountry && inputRef.current) {
        inputRef.current.focus()
      }
    }

    const handleFocus = (
      event: React.FocusEvent<HTMLInputElement, Element>
    ): void => {
      setTimeout(() => {
        if (inputRef.current) {
          putCursorAtEndOfInput(inputRef.current)
        }
      }, 0)
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

    const isoCodeWithPlus = isoCode
      ? `+${getCallingCodeOfCountry(isoCode)}`
      : ''
    const validInputValue = forceCallingCode
      ? // We removed the isoCode but no necessarily the space after
        removeOccurrence(inputValue, isoCodeWithPlus).trimStart()
      : inputValue

    return (
      <>
        <TextField
          type="tel"
          disabled={disabled}
          value={validInputValue}
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
              <InputAdornment position="start" sx={{ flexShrink: 0 }}>
                <FlagButton
                  isFlagsMenuOpened={Boolean(anchorEl)}
                  isoCode={isoCode}
                  forceCallingCode={forceCallingCode}
                  onClick={handleOpenFlagsMenu}
                  disabled={disabled}
                  flagSize={flagSize}
                  disableDropdown={Boolean(disableDropdown)}
                />
              </InputAdornment>
            )
          }}
          {...restTextFieldProps}
        />
        {!disableDropdown ? (
          <FlagsDropdown
            onlyCountries={onlyCountries}
            excludedCountries={excludedCountries}
            continents={continents}
            anchorEl={anchorEl}
            isoCode={isoCode}
            preferredCountries={preferredCountries}
            onClose={handleCloseFlagsMenu}
            langOfCountryName={langOfCountryName}
            onSelectCountry={handleChangeCountry}
            flagSize={flagSize}
            allowSearch={allowSearch}
            MenuProps={MenuProps}
          />
        ) : null}
      </>
    )
  }
)

export { MuiTelInput }
