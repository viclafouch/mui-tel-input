import React from 'react'
import { AsYouType } from 'libphonenumber-js'
import { MuiTelInputContinent } from '@shared/constants/continents'
import { COUNTRIES, MuiTelInputCountry } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'
import {
  getCallingCodeOfCountry,
  matchContinentsIncludeCountry
} from '@shared/helpers/country'
import { removeOccurrence } from '@shared/helpers/string'
import { MuiTelInputInfo, MuiTelInputReason } from '../../index.types'

type UsePhoneDigitsParams = {
  value: string
  onChange?: (value: string, info: MuiTelInputInfo) => void
  defaultCountry?: MuiTelInputCountry
  forceCallingCode?: boolean
  splitCallingCode?: boolean
  disableFormatting?: boolean
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
  disableFormatting?: boolean
  splitCallingCode?: boolean
}

export function getInitialState(params: GetInitialStateParams): State {
  const { defaultCountry, initialValue, disableFormatting, splitCallingCode } =
    params

  const fallbackValue =
    defaultCountry && !splitCallingCode
      ? `+${COUNTRIES[defaultCountry]?.[0] as string}`
      : ''

  const asYouType = new AsYouType(defaultCountry)
  let inputValue = asYouType.input(initialValue)

  const phoneNumberValue = asYouType.getNumberValue()

  if (disableFormatting && phoneNumberValue) {
    inputValue = phoneNumberValue
  }

  const callingCode = asYouType.getCallingCode()
  if (splitCallingCode && callingCode) {
    inputValue = inputValue.replace(`+${callingCode}`, '').trim()
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
  forceCallingCode,
  splitCallingCode,
  onlyCountries,
  excludedCountries,
  continents,
  disableFormatting
}: UsePhoneDigitsParams) {
  const previousCountryRef = React.useRef<MuiTelInputCountry | null>(
    defaultCountry || null
  )
  const asYouTypeRef = React.useRef<AsYouType>(new AsYouType(defaultCountry))
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [previousDefaultCountry, setPreviousDefaultCountry] = React.useState<
    MuiTelInputCountry | undefined
  >(defaultCountry)
  const [state, setState] = React.useState<State>(() => {
    return getInitialState({
      initialValue: value,
      defaultCountry,
      disableFormatting,
      splitCallingCode
    })
  })
  const [previousValue, setPreviousValue] = React.useState(value)

  const buildOnChangeInfo = (reason: MuiTelInputReason): MuiTelInputInfo => {
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

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let inputVal = event.target.value
    if (splitCallingCode) {
      const cleanInputValue = removeOccurrence(inputVal, '+')
      // defaultCountry must be set by the user if `splitCallingCode`
      const isoCode = state.isoCode || (defaultCountry as MuiTelInputCountry)
      // use the currently selected country calling code
      inputVal = `+${getCallingCodeOfCountry(isoCode)}${cleanInputValue}`
    } else {
      // make the start of the number a calling code if it's not already one
      inputVal =
        inputVal.startsWith('+') || inputVal === '' ? inputVal : `+${inputVal}`
    }
    const formattedValue = typeNewValue(inputVal)
    const country =
      inputVal === '+' || !inputVal
        ? null
        : asYouTypeRef.current.getCountry() ||
          previousCountryRef.current ||
          null
    if (!splitCallingCode) {
      previousCountryRef.current = country
    }
    const phoneNumber = asYouTypeRef.current.getNumber() || null
    const numberValue = asYouTypeRef.current.getNumberValue() || ''

    if (splitCallingCode) {
      const valueWithoutCallingCode = (
        disableFormatting ? numberValue : formattedValue
      )
        .replace(
          `+${getCallingCodeOfCountry(
            state.isoCode || (defaultCountry as MuiTelInputCountry)
          )}`,
          ''
        )
        .trim()
      onChange?.(valueWithoutCallingCode, buildOnChangeInfo('input'))
      setPreviousValue(valueWithoutCallingCode)
      setState({
        isoCode: previousCountryRef.current,
        inputValue: valueWithoutCallingCode
      })
    } else if (
      forceCallingCode &&
      !phoneNumber &&
      (state.isoCode || defaultCountry)
    ) {
      const inputValueIsoCode = `+${getCallingCodeOfCountry(
        state.isoCode || (defaultCountry as MuiTelInputCountry)
      )}`
      onChange?.(inputValueIsoCode, buildOnChangeInfo('input'))
      setPreviousValue(inputValueIsoCode)
      setState({
        isoCode: state.isoCode || defaultCountry || null,
        inputValue: inputValueIsoCode
      })
    } else if (numberValue && (!country || !matchIsIsoCodeValid(country))) {
      // Do not format when isoCode is not valid
      onChange?.(numberValue, {
        ...buildOnChangeInfo('input'),
        countryCode: null,
        countryCallingCode: null,
        nationalNumber: null
      })
      setPreviousValue(numberValue)
      setState({
        isoCode: null,
        inputValue: numberValue
      })
    } else if (disableFormatting) {
      onChange?.(numberValue, buildOnChangeInfo('input'))
      setPreviousValue(numberValue)
      setState({
        isoCode: country || null,
        inputValue: numberValue
      })
    } else {
      onChange?.(formattedValue, buildOnChangeInfo('input'))
      setPreviousValue(formattedValue)
      setState({
        isoCode: country || null,
        inputValue: formattedValue
      })
    }
  }

  React.useEffect(() => {
    if (value !== previousValue) {
      setPreviousValue(value)
      const newState = getInitialState({
        initialValue: value,
        defaultCountry,
        splitCallingCode
      })

      if (splitCallingCode) {
        // keep the selected flag country if we are splitting the calling code
        newState.isoCode = previousCountryRef.current
      } else {
        // otherwise, update the country as it might have changed with the number
        previousCountryRef.current = newState.isoCode
      }
      setState(newState)
    }
  }, [value, previousValue, defaultCountry, splitCallingCode])

  React.useEffect(() => {
    if (defaultCountry !== previousDefaultCountry) {
      setPreviousDefaultCountry(defaultCountry)
      asYouTypeRef.current = new AsYouType(defaultCountry)
      const { inputValue, isoCode } = getInitialState({
        initialValue: '',
        defaultCountry,
        splitCallingCode
      })
      setPreviousValue(inputValue)
      asYouTypeRef.current.input(inputValue)
      previousCountryRef.current = asYouTypeRef.current.getCountry() || null
      onChange?.(inputValue, buildOnChangeInfo('country'))
      setState({
        inputValue,
        isoCode
      })
    }
  }, [defaultCountry, previousDefaultCountry, splitCallingCode, onChange])

  const onCountryChange = (newCountry: MuiTelInputCountry): void => {
    if (newCountry === state.isoCode) {
      return
    }
    const callingCode = COUNTRIES[newCountry]?.[0] as string
    const { inputValue, isoCode } = state
    const inputValueWithoutCallingCode = isoCode
      ? removeOccurrence(inputValue, `+${getCallingCodeOfCountry(isoCode)}`)
      : inputValue
    // replace the old calling code with the new one, keeping the rest of the number
    let newValue = `+${callingCode}${inputValueWithoutCallingCode}`

    if (!disableFormatting) {
      newValue = typeNewValue(newValue)
    }
    if (splitCallingCode) {
      newValue = removeOccurrence(newValue, `+${callingCode}`).trim()
    }

    onChange?.(newValue, {
      ...buildOnChangeInfo('country'),
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
    inputRef
  }
}
