import React from 'react'
import parsePhoneNumberFromString, { AsYouType } from 'libphonenumber-js'
import { MuiTelInputContinent } from '@shared/constants/continents'
import { COUNTRIES, MuiTelInputCountry } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'
import {
  getCallingCodeOfCountry,
  matchContinentsIncludeCountry
} from '@shared/helpers/country'
import {
  appendExtension,
  isValidExtension,
  removeExtension
} from '@shared/helpers/ext'
import { removeOccurrence } from '@shared/helpers/string'
import {
  MuiTelInputChangeHandler,
  MuiTelInputInfo,
  MuiTelInputReason
} from '../../index.types'

type UsePhoneDigitsParams = {
  value: string
  onChange?: MuiTelInputChangeHandler
  defaultCountry?: MuiTelInputCountry
  forceCallingCode: boolean
  disableFormatting: boolean
  enableExtensions: boolean
  excludedCountries?: MuiTelInputCountry[]
  onlyCountries?: MuiTelInputCountry[]
  continents?: MuiTelInputContinent[]
}

type State = {
  inputValue: string
  isoCode: MuiTelInputCountry | null
  extensionValue: string | null
}

type GetInitialStateParams = {
  defaultCountry?: MuiTelInputCountry
  rawInputValue: string
  initialValue: string
  forceCallingCode: boolean
  disableFormatting: boolean
}

export function getInitialState(params: GetInitialStateParams): State {
  const {
    defaultCountry,
    rawInputValue,
    initialValue,
    disableFormatting,
    forceCallingCode
  } = params

  const fallbackValue = defaultCountry
    ? `+${COUNTRIES[defaultCountry]?.[0] as string}`
    : ''

  const asYouType = new AsYouType(defaultCountry)
  let inputValue = asYouType.input(initialValue)

  const ext = parsePhoneNumberFromString(rawInputValue, defaultCountry)?.ext

  if (forceCallingCode && inputValue === '+' && defaultCountry) {
    inputValue = `+${COUNTRIES[defaultCountry]?.[0] as string}`
  }

  const phoneNumberValue = asYouType.getNumberValue()

  if (disableFormatting && phoneNumberValue) {
    inputValue = phoneNumberValue
  }

  return {
    inputValue: inputValue || fallbackValue,
    isoCode: asYouType.getCountry() || defaultCountry || null,
    extensionValue: ext || null
  }
}

type Filters = {
  excludedCountries?: MuiTelInputCountry[]
  onlyCountries?: MuiTelInputCountry[]
  continents?: MuiTelInputContinent[]
}

function matchIsIsoCodeAccepted(
  isoCode: MuiTelInputCountry,
  filters: Filters
): boolean {
  const { excludedCountries, onlyCountries, continents } = filters

  if (
    matchIsArray(excludedCountries, true) &&
    excludedCountries.includes(isoCode)
  ) {
    return false
  }

  if (matchIsArray(onlyCountries) && !onlyCountries.includes(isoCode)) {
    return false
  }

  if (
    matchIsArray(continents) &&
    !matchContinentsIncludeCountry(continents, isoCode)
  ) {
    return false
  }

  return true
}

export default function usePhoneDigits({
  value,
  onChange,
  defaultCountry,
  onlyCountries,
  excludedCountries,
  continents,
  disableFormatting,
  enableExtensions,
  forceCallingCode
}: UsePhoneDigitsParams) {
  const previousCountryRef = React.useRef<MuiTelInputCountry | null>(
    defaultCountry || null
  )
  const asYouTypeRef = React.useRef<AsYouType>(new AsYouType(defaultCountry))
  const inputRef = React.useRef<HTMLInputElement>(null)
  const extensionInputRef = React.useRef<HTMLInputElement>(null)

  // const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [previousDefaultCountry, setPreviousDefaultCountry] = React.useState<
    MuiTelInputCountry | undefined
  >(defaultCountry)

  const _value = React.useMemo(() => {
    return removeExtension(value)
  }, [value])

  const [state, setState] = React.useState<State>(() => {
    return getInitialState({
      rawInputValue: value,
      initialValue: _value,
      defaultCountry,
      disableFormatting,
      forceCallingCode
    })
  })

  const [previousValue, setPreviousValue] = React.useState(_value)

  const buildOnChangeInfo = React.useCallback(
    (reason: MuiTelInputReason): MuiTelInputInfo => {
      return {
        countryCallingCode: asYouTypeRef.current.getCallingCode() || null,
        countryCode: asYouTypeRef.current.getCountry() || null,
        nationalNumber: asYouTypeRef.current.getNationalNumber(),
        extension: state.extensionValue || null,
        numberType: asYouTypeRef.current.getNumber()?.getType() ?? null,
        numberValue: asYouTypeRef.current.getNumberValue() || null,
        reason
      }
    },
    [state.extensionValue]
  )

  const matchIsIsoCodeValid = (isoCode: MuiTelInputCountry | null) => {
    return (
      isoCode &&
      matchIsIsoCodeAccepted(isoCode, {
        onlyCountries,
        excludedCountries,
        continents
      })
    )
  }

  const typeNewValue = (inputValue: string): string => {
    asYouTypeRef.current.reset()

    return asYouTypeRef.current.input(inputValue)
  }

  const makeSureStartWithPlusOrEmpty = (inputValue: string): string => {
    return inputValue.startsWith('+') || inputValue === ''
      ? inputValue
      : `+${inputValue}`
  }

  const makeSureStartWithPlusIsoCode = (
    inputValue: string,
    country: MuiTelInputCountry
  ): string => {
    return inputValue.startsWith('+') || inputValue === ''
      ? inputValue
      : `+${getCallingCodeOfCountry(country)}${inputValue}`
  }

  // * a wrapper for the onChange callback where we can handle formatting logic
  const _onChange = React.useCallback<MuiTelInputChangeHandler>(
    (num, info) => {
      if (enableExtensions && info.extension && num) {
        const numWithExt = appendExtension(num, info.extension)

        onChange?.(numWithExt, info)
      } else {
        onChange?.(num, info)
      }
    },
    [enableExtensions, onChange]
  )

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = forceCallingCode
      ? makeSureStartWithPlusIsoCode(
          event.target.value,
          state.isoCode as MuiTelInputCountry
        )
      : makeSureStartWithPlusOrEmpty(event.target.value)

    // formatted : e.g: +33 6 26 92..
    const formattedValue = typeNewValue(inputValue)
    const newCountryCode = asYouTypeRef.current.getCountry()
    const country =
      newCountryCode ||
      (forceCallingCode
        ? (state.isoCode as MuiTelInputCountry)
        : previousCountryRef.current)
    // Not formatted : e.g: +336269226..
    const numberValue = asYouTypeRef.current.getNumberValue() || ''

    previousCountryRef.current = country

    const phoneInfo = buildOnChangeInfo('input')

    // Check if the country is excluded, or not part on onlyCountries, etc..
    if (numberValue && (!country || !matchIsIsoCodeValid(country))) {
      _onChange(numberValue, {
        ...phoneInfo,
        // we show the input value but without any formatting, or country..
        countryCode: null,
        countryCallingCode: null,
        nationalNumber: null
      })
      setPreviousValue(numberValue)
      setState({
        isoCode: null,
        inputValue: numberValue,
        extensionValue: null
      })
    } else {
      const valueToSet = disableFormatting ? numberValue : formattedValue
      _onChange(valueToSet, phoneInfo)
      setPreviousValue(valueToSet)
      setState({
        isoCode: country,
        inputValue: valueToSet,
        extensionValue: phoneInfo.extension
      })
    }
  }

  React.useEffect(() => {
    if (_value !== previousValue) {
      setPreviousValue(_value)
      const newState = getInitialState({
        rawInputValue: value,
        initialValue: _value,
        defaultCountry,
        forceCallingCode,
        disableFormatting
      })
      previousCountryRef.current = newState.isoCode
      setState(newState)
    }
  }, [
    value,
    _value,
    previousValue,
    defaultCountry,
    forceCallingCode,
    disableFormatting
  ])

  React.useEffect(() => {
    if (defaultCountry !== previousDefaultCountry) {
      setPreviousDefaultCountry(defaultCountry)
      asYouTypeRef.current = new AsYouType(defaultCountry)
      const { inputValue, isoCode, extensionValue } = getInitialState({
        rawInputValue: '',
        initialValue: '',
        defaultCountry,
        forceCallingCode,
        disableFormatting
      })
      setPreviousValue(inputValue)
      asYouTypeRef.current.input(inputValue)
      previousCountryRef.current = asYouTypeRef.current.getCountry() || null
      _onChange?.(inputValue, buildOnChangeInfo('country'))
      setState({
        inputValue,
        isoCode,
        extensionValue
      })
    }
  }, [
    defaultCountry,
    previousDefaultCountry,
    _onChange,
    forceCallingCode,
    disableFormatting,
    buildOnChangeInfo
  ])

  const onCountryChange = (newCountry: MuiTelInputCountry): void => {
    if (newCountry === state.isoCode) {
      return
    }

    const callingCode = COUNTRIES[newCountry]?.[0] as string
    const { inputValue, isoCode } = state

    let inputValueWithoutCallingCode = inputValue

    if (isoCode) {
      const callingCodeOfPreviousCountry = getCallingCodeOfCountry(isoCode)
      const callingCodeWithPlus = `+${callingCodeOfPreviousCountry}`
      // if the input value start with wrong calling code, set it to empty string
      inputValueWithoutCallingCode = inputValue.startsWith(callingCodeWithPlus)
        ? removeOccurrence(inputValue, callingCodeWithPlus)
        : ''
    }

    // replace the old calling code with the new one, keeping the rest of the number
    let newValue = `+${callingCode}${inputValueWithoutCallingCode}`

    if (!disableFormatting) {
      newValue = typeNewValue(newValue)
    }

    _onChange(newValue, {
      ...buildOnChangeInfo('country'),
      // Some country have the same calling code, so we choose what the user has selected
      countryCode: newCountry
    })

    previousCountryRef.current = newCountry
    setPreviousValue(newValue)
    setState((prev) => {
      return {
        ...prev,
        isoCode: newCountry,
        inputValue: newValue
      }
    })
  }

  const onExtensionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const extInputVal = event.target.value

    if (!isValidExtension(extInputVal)) {
      return
    }

    setState((prev) => {
      return { ...prev, extensionValue: extInputVal }
    })

    const { inputValue } = state
    _onChange(inputValue, {
      ...buildOnChangeInfo('extension'),
      extension: extInputVal
    })
  }

  return {
    inputValue: state.inputValue,
    isoCode: state.isoCode,
    extensionValue: state.extensionValue,
    onInputChange,
    onCountryChange,
    onExtensionChange,
    inputRef,
    extensionInputRef
  }
}
