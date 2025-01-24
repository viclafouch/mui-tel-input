import React from 'react'
import { AsYouType } from 'libphonenumber-js'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import { COUNTRIES, type MuiTelInputCountry } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'
import {
  getCallingCodeOfCountry,
  matchContinentsIncludeCountry
} from '@shared/helpers/country'
import { removeOccurrence } from '@shared/helpers/string'
import type { MuiTelInputInfo, MuiTelInputReason } from '../../index.types'

type UsePhoneDigitsParams = {
  value: string
  onChange?: (value: string, info: MuiTelInputInfo) => void
  defaultCountry?: MuiTelInputCountry
  forceCallingCode: boolean
  disableFormatting: boolean
  excludedCountries?: MuiTelInputCountry[]
  onlyCountries?: MuiTelInputCountry[]
  continents?: MuiTelInputContinent[]
}

type State = {
  inputValue: string
  isoCode: MuiTelInputCountry | null
}

type GetInitialStateParams = {
  defaultCountry?: MuiTelInputCountry
  initialValue: string
  forceCallingCode: boolean
  disableFormatting: boolean
}

export function getInitialState(params: GetInitialStateParams): State {
  const { defaultCountry, initialValue, disableFormatting, forceCallingCode } =
    params

  const fallbackValue = defaultCountry
    ? `+${COUNTRIES[defaultCountry]?.[0] as string}`
    : ''

  const asYouType = new AsYouType(defaultCountry)
  let inputValue = asYouType.input(initialValue)

  if (forceCallingCode && inputValue === '+' && defaultCountry) {
    inputValue = `+${COUNTRIES[defaultCountry]?.[0] as string}`
  }

  const phoneNumberValue = asYouType.getNumberValue()

  if (disableFormatting && phoneNumberValue) {
    inputValue = phoneNumberValue
  }

  return {
    inputValue: inputValue || fallbackValue,
    isoCode: asYouType.getCountry() || defaultCountry || null
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
  forceCallingCode
}: UsePhoneDigitsParams) {
  const previousCountryRef = React.useRef<MuiTelInputCountry | null>(
    defaultCountry || null
  )
  const asYouTypeRef = React.useRef<AsYouType>(new AsYouType(defaultCountry))
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [previousDefaultCountry, setPreviousDefaultCountry] = React.useState<
    MuiTelInputCountry | undefined
  >(defaultCountry)
  const [state, setState] = React.useState<State>(() => {
    return getInitialState({
      initialValue: value,
      defaultCountry,
      disableFormatting,
      forceCallingCode
    })
  })

  const [previousValue, setPreviousValue] = React.useState(value)

  const buildInputInfo = (reason: MuiTelInputReason): MuiTelInputInfo => {
    return {
      countryCallingCode: asYouTypeRef.current.getCallingCode() || null,
      countryCode: asYouTypeRef.current.getCountry() || null,
      nationalNumber: asYouTypeRef.current.getNationalNumber(),
      numberType: asYouTypeRef.current.getNumber()?.getType() ?? null,
      numberValue: asYouTypeRef.current.getNumberValue() || null,
      reason
    }
  }

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

  const resetCursorPositionIfNeeded = (
    event: React.ChangeEvent<HTMLInputElement>,
    notFormattedValue: string,
    formattedValue: string
  ) => {
    const inputValue = event.target.value
    const prefix = notFormattedValue.replace(inputValue, '')
    const formattedInputValue = formattedValue.replace(prefix, '').trimStart()
    const caretIndex = event.target.selectionStart || 0
    const inputPartBeforeCaret = inputValue.substring(0, caretIndex)
    const numbersBeforeCaret = inputPartBeforeCaret.replace(/\D/g, '').length

    // Example of values while typing, if the user types 06 32, then clicks between 3 and 2, and types 1
    // notFormattedValue: +3306 312
    // formattedValue: +33 06 31 2
    // formattedInputValue: 06 31 2
    // inputValue: 06 312
    // prefix: +33

    if (
      // Cursor is at the end of the input
      caretIndex >= inputValue.length ||
      // The typed value is the same as the formatted one
      inputValue === formattedInputValue ||
      // There is a difference between the input value and the formatted one, this situation is not handled
      formattedInputValue.replace(/\D/g, '') !== inputValue.replace(/\D/g, '')
    ) {
      return
    }

    let newIndex,
      numbersBeforeNewIndex = 0

    // Find the corresponding index of the caret in the formatted value
    for (newIndex = 0; newIndex < formattedInputValue.length; newIndex++) {
      if (
        formattedInputValue[newIndex].match(/\d/) &&
        ++numbersBeforeNewIndex >= numbersBeforeCaret
      ) {
        break
      }
    }

    window.requestAnimationFrame(() => {
      event.target.setSelectionRange(newIndex + 1, newIndex + 1)
    })
  }

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

    const phoneInfo = buildInputInfo('input')

    // Check if the country is excluded, or not part on onlyCountries, etc..
    if (numberValue && (!country || !matchIsIsoCodeValid(country))) {
      onChange?.(numberValue, {
        ...phoneInfo,
        // we show the input value but without any formatting, or country..
        countryCode: null,
        countryCallingCode: null,
        nationalNumber: null
      })
      setPreviousValue(numberValue)
      setState({
        isoCode: null,
        inputValue: numberValue
      })
    } else {
      const valueToSet = disableFormatting ? numberValue : formattedValue
      onChange?.(valueToSet, phoneInfo)
      setPreviousValue(valueToSet)
      setState({
        isoCode: country,
        inputValue: valueToSet
      })

      if (!disableFormatting) {
        // By default, if the input value is not the one the user has typed, the cursor will be set at the end
        resetCursorPositionIfNeeded(event, inputValue, valueToSet)
      }
    }
  }

  React.useEffect(() => {
    if (value !== previousValue) {
      setPreviousValue(value)
      const newState = getInitialState({
        initialValue: value,
        defaultCountry,
        forceCallingCode,
        disableFormatting
      })
      previousCountryRef.current = newState.isoCode
      setState(newState)
    }
  }, [
    value,
    previousValue,
    defaultCountry,
    forceCallingCode,
    disableFormatting
  ])

  React.useEffect(() => {
    if (defaultCountry !== previousDefaultCountry) {
      setPreviousDefaultCountry(defaultCountry)
      asYouTypeRef.current = new AsYouType(defaultCountry)
      const { inputValue, isoCode } = getInitialState({
        initialValue: '',
        defaultCountry,
        forceCallingCode,
        disableFormatting
      })
      setPreviousValue(inputValue)
      asYouTypeRef.current.input(inputValue)
      previousCountryRef.current = asYouTypeRef.current.getCountry() || null
      onChange?.(inputValue, buildInputInfo('country'))
      setState({
        inputValue,
        isoCode
      })
    }
  }, [
    defaultCountry,
    previousDefaultCountry,
    onChange,
    forceCallingCode,
    disableFormatting
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

    onChange?.(newValue, {
      ...buildInputInfo('country'),
      // Some country have the same calling code, so we choose what the user has selected
      countryCode: newCountry
    })
    previousCountryRef.current = newCountry
    setPreviousValue(newValue)
    setState({
      isoCode: newCountry,
      inputValue: newValue
    })
  }

  return {
    inputValue: state.inputValue,
    isoCode: state.isoCode,
    onInputChange,
    onCountryChange,
    inputRef,
    buildInputInfo
  }
}
