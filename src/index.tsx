import React from 'react'
import ReactDOM from 'react-dom'
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

const MuiTelInput = (props: MuiTelInputProps) => {
  const {
    forceCallingCode = false,
    onlyCountries,
    excludedCountries,
    defaultCountry,
    onDoubleClick,
    onFocus,
    onCopy,
    onBlur,
    value = '',
    ref: propRef,
    slotProps,
    inputRef: inputRefFromProps,
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
    FlagIconButtonProps,
    ...restTextFieldProps
  } = props
  const validDefaultCountry = forceCallingCode
    ? getValidCountry(defaultCountry)
    : defaultCountry

  useMismatchProps(props)

  const {
    onInputChange,
    onCountryChange,
    inputRef,
    isoCode,
    inputValue,
    buildInputInfo
  } = usePhoneDigits({
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
    ReactDOM.flushSync(() => {
      closeMenu()
      onCountryChange(newCountry)
    })

    if (focusOnSelectCountry && inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event, buildInputInfo('blur'))
  }

  const isoCodeWithPlus = isoCode ? `+${getCallingCodeOfCountry(isoCode)}` : ''
  const validInputValue = forceCallingCode
    ? removeOccurrence(inputValue, isoCodeWithPlus).trimStart()
    : inputValue

  return (
    <>
      <TextField
        type="tel"
        disabled={disabled}
        value={validInputValue}
        ref={refToRefs([propRef])}
        onDoubleClick={handleDoubleClick}
        inputRef={refToRefs([inputRef, inputRefFromProps])}
        className={`${textFieldClass} ${className || ''}`}
        onChange={onInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        slotProps={{
          htmlInput: {
            onCopy: handleCopy,
            // eslint-disable-next-line @typescript-eslint/no-misused-spread
            ...slotProps?.htmlInput
          },
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
                  {...FlagIconButtonProps}
                />
              </InputAdornment>
            ),
            ref: anchorRef,
            // eslint-disable-next-line @typescript-eslint/no-misused-spread
            ...slotProps?.input
          }
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
