import React from 'react'
import { MuiTelInputContinent } from '@shared/constants/continents'
import { COUNTRIES, MuiTelInputCountry } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'
import {
  getCallingCodeOfCountry,
  matchContinentsIncludeCountry
} from '@shared/helpers/country'
import { AsYouType } from 'libphonenumber-js'

import { MuiTelInputInfo, MuiTelInputReason } from '../../index.types'

type UsePhoneDigitsParams = {
  value: string
  onChange?: (value: string, info: MuiTelInputInfo) => void
  defaultCountry?: MuiTelInputCountry
  forceCallingCode?: boolean
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
}

export function getInitialState(params: GetInitialStateParams): State {
  const { defaultCountry, initialValue, disableFormatting } = params

  const fallbackValue = defaultCountry
    ? `+${COUNTRIES[defaultCountry][0] as string}`
    : ''

  const asYouType = new AsYouType(defaultCountry)
  let inputValue = asYouType.input(initialValue)

  const phoneNumberValue = asYouType.getNumberValue()

  if (defaultCountry && asYouType.getCountry() === undefined) {
    inputValue = fallbackValue
  } else if (disableFormatting && phoneNumberValue) {
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
  forceCallingCode,
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
      disableFormatting
    })
  })
  const [previousValue, setPreviousValue] = React.useState(value)

  const buildOnChangeInfo = (reason: MuiTelInputReason): MuiTelInputInfo => {
    return {
      countryCallingCode: asYouTypeRef.current.getCallingCode() || null,
      countryCode: asYouTypeRef.current.getCountry() || null,
      nationalNumber: asYouTypeRef.current.getNationalNumber(),
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
    inputVal =
      inputVal.startsWith('+') || inputVal === '' ? inputVal : `+${inputVal}`
    const formattedValue = typeNewValue(inputVal)
    const country =
      inputVal === '+' || !inputVal
        ? null
        : asYouTypeRef.current.getCountry() ||
          previousCountryRef.current ||
          null
    previousCountryRef.current = country
    const phoneNumber = asYouTypeRef.current.getNumber() || null
    const numberValue = asYouTypeRef.current.getNumberValue() || ''

    if (forceCallingCode && !phoneNumber && (state.isoCode || defaultCountry)) {
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
        defaultCountry
      })
      previousCountryRef.current = newState.isoCode
      setState(newState)
    }
  }, [value, previousValue, defaultCountry])

  React.useEffect(() => {
    if (defaultCountry !== previousDefaultCountry) {
      setPreviousDefaultCountry(defaultCountry)
      asYouTypeRef.current = new AsYouType(defaultCountry)
      const { inputValue, isoCode } = getInitialState({
        initialValue: '',
        defaultCountry
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
  }, [defaultCountry, previousDefaultCountry, onChange])

  const onCountryChange = (newCountry: MuiTelInputCountry): void => {
    if (newCountry === state.isoCode) {
      return
    }
    const callingCode = COUNTRIES[newCountry][0] as string
    const formattedValue = typeNewValue(`+${callingCode}`)
    onChange?.(formattedValue, {
      ...buildOnChangeInfo('country'),
      // Some country have the same calling code, so we choose what the user has selected
      countryCode: newCountry
    })
    previousCountryRef.current = newCountry
    setPreviousValue(formattedValue)
    setState({
      isoCode: newCountry,
      inputValue: formattedValue
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
