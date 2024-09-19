import React from 'react'
import { flagContainerClass } from '@components/Flag/Flag'
import FlagButton, { flagButtonClass } from '@components/FlagButton/FlagButton'
import {
  callingCodeClass,
  listItemIconFlagClass,
  listItemTextCountryClass,
  menuItemClass
} from '@components/FlagMenuItem/FlagMenuItem'
import FlagsMenu, { menuClass } from '@components/FlagsMenu/FlagsMenu'
import {
  getCallingCodeOfCountry,
  getValidCountry
} from '@shared/helpers/country'
import {
  defaultUnknownFlagElement,
  flagImgClass,
  getDefaultFlagElement
} from '@shared/helpers/flag'
import { refToRefs } from '@shared/helpers/ref'
import { removeOccurrence } from '@shared/helpers/string'
import { useAnchor } from '@shared/hooks/useAnchor'
import { useEvents } from '@shared/hooks/useEvents'
import { useMismatchProps } from '@shared/hooks/useMissmatchProps'
import usePhoneDigits from '@shared/hooks/usePhoneDigits'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import type {
  MuiTelInputContinent,
  MuiTelInputCountry,
  MuiTelInputFlagElement,
  MuiTelInputInfo,
  MuiTelInputProps,
  MuiTelInputReason
} from './index.types'

export { AsYouType, getNumberType } from 'libphonenumber-js'

export type {
  MuiTelInputContinent,
  MuiTelInputCountry,
  MuiTelInputFlagElement,
  MuiTelInputInfo,
  MuiTelInputProps,
  MuiTelInputReason
}

export { matchIsValidTel } from '@shared/helpers/valid-phone-number'

export const textFieldClass = 'MuiTelInput-TextField'

const MuiTelInput = React.forwardRef(
  (props: MuiTelInputProps, propRef: MuiTelInputProps['ref']) => {
    const {
      forceCallingCode = false,
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
      slotProps = {},
      disabled,
      onChange,
      disableDropdown,
      disableFormatting = false,
      focusOnSelectCountry,
      langOfCountryName,
      continents,
      preferredCountries,
      MenuProps,
      className,
      getFlagElement = getDefaultFlagElement,
      unknownFlagElement = defaultUnknownFlagElement,
      ...restTextFieldProps
    } = props

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

    const { openMenu, anchorEl, anchorRef, closeMenu } = useAnchor({
      disabled,
      disableDropdown
    })

    const { handleDoubleClick, handleCopy, handleFocus } = useEvents({
      onDoubleClick,
      onCopy,
      onFocus,
      inputRef
    })

    const handleChangeCountry = (newCountry: MuiTelInputCountry) => {
      closeMenu()
      onCountryChange(newCountry)

      if (focusOnSelectCountry && inputRef.current) {
        inputRef.current.focus()
      }
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
          ref={refToRefs([propRef, anchorRef])}
          onDoubleClick={handleDoubleClick}
          inputRef={refToRefs([
            inputRef,
            inputRefFromProps,
            InputProps?.inputRef
          ])}
          className={`${textFieldClass} ${className || ''}`}
          onChange={onInputChange}
          inputProps={{
            onCopy: handleCopy,
            ...inputProps
          }}
          onFocus={handleFocus}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ flexShrink: 0 }}>
                <FlagButton
                  isFlagsMenuOpened={Boolean(anchorEl)}
                  isoCode={isoCode}
                  forceCallingCode={forceCallingCode}
                  onClick={openMenu}
                  disabled={disabled}
                  getFlagElement={getFlagElement}
                  unknownFlagElement={unknownFlagElement}
                  disableDropdown={Boolean(disableDropdown)}
                />
              </InputAdornment>
            ),
            ...InputProps
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start" sx={{ flexShrink: 0 }}>
                  <FlagButton
                    isFlagsMenuOpened={Boolean(anchorEl)}
                    isoCode={isoCode}
                    forceCallingCode={forceCallingCode}
                    onClick={openMenu}
                    disabled={disabled}
                    getFlagElement={getFlagElement}
                    unknownFlagElement={unknownFlagElement}
                    disableDropdown={Boolean(disableDropdown)}
                  />
                </InputAdornment>
              ),
              ...slotProps.input
            },
            ...slotProps
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
            onClose={closeMenu}
            langOfCountryName={langOfCountryName}
            onSelectCountry={handleChangeCountry}
            getFlagElement={getFlagElement}
            {...MenuProps}
          />
        ) : null}
      </>
    )
  }
)

export const classes = {
  textField: textFieldClass,
  flagContainer: flagContainerClass,
  flagImg: flagImgClass,
  flagButton: flagButtonClass,
  menu: menuClass,
  menuItem: menuItemClass,
  listItemIconFlag: listItemIconFlagClass,
  listItemTextCountry: listItemTextCountryClass,
  callingCode: callingCodeClass
} as const satisfies Record<string, string>

export { MuiTelInput }
