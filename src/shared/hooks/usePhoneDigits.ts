import React from 'react'
import { ContinentCode } from '@shared/constants/continents'
import { COUNTRIES, Iso3166Alpha2Code } from '@shared/constants/countries'
import { matchIsArray } from '@shared/helpers/array'
import {
  getCallingCodeOfCountry,
  matchContinentsIncludeCountry
} from '@shared/helpers/country'
import { AsYouType } from 'libphonenumber-js'

type UsePhoneDigitsParams = {
  value: string
  onChange?: (value: string) => void
  defaultCountry?: Iso3166Alpha2Code
  forceCallingCode?: boolean
  excludedCountries?: Iso3166Alpha2Code[]
  onlyCountries?: Iso3166Alpha2Code[]
  continents?: ContinentCode[]
}

type State = {
  inputValue: string
  isoCode: Iso3166Alpha2Code | null
}

type GetInitialStateParams = {
  defaultCountry?: Iso3166Alpha2Code
  initialValue: string
  disableFormatting?: boolean
}

export function getInitialState(params: GetInitialStateParams): State {
  const { defaultCountry, initialValue } = params

  const fallbackValue = defaultCountry
    ? `+${COUNTRIES[defaultCountry][0] as string}`
    : ''

  const asYouType = new AsYouType(defaultCountry)
  let inputValue = asYouType.input(initialValue)

  if (defaultCountry && asYouType.getCountry() === undefined) {
    inputValue = fallbackValue
  }

  return {
    inputValue: inputValue || fallbackValue,
    isoCode: asYouType.getCountry() || defaultCountry || null
  }
}

type Filters = {
  excludedCountries?: Iso3166Alpha2Code[]
  onlyCountries?: Iso3166Alpha2Code[]
  continents?: ContinentCode[]
}

function matchIsIsoCodeAccepted(
  isoCode: Iso3166Alpha2Code,
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
  continents
}: UsePhoneDigitsParams) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [previousDefaultCountry, setPreviousDefaultCountry] = React.useState<
    Iso3166Alpha2Code | undefined
  >(defaultCountry)
  const [state, setState] = React.useState<State>(() => {
    return getInitialState({
      initialValue: value,
      defaultCountry
    })
  })
  const [previousValue, setPreviousValue] = React.useState(value)

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let inputVal = event.target.value
    inputVal =
      inputVal.startsWith('+') || inputVal === '' ? inputVal : `+${inputVal}`
    const asYouType = new AsYouType()
    let newValue = asYouType.input(inputVal)
    let newIsoCode = asYouType.getCountry() || null
    if (forceCallingCode && !newIsoCode && state.isoCode) {
      newValue = `+${getCallingCodeOfCountry(state.isoCode)}`
      newIsoCode = state.isoCode
    }
    if (
      newIsoCode &&
      !matchIsIsoCodeAccepted(newIsoCode, {
        onlyCountries,
        excludedCountries,
        continents
      })
    ) {
      newValue = state.inputValue
      newIsoCode = state.isoCode
    }
    setPreviousValue(newValue)
    onChange?.(newValue)
    setState({
      isoCode: newIsoCode,
      inputValue: newValue
    })
  }

  React.useEffect(() => {
    if (value !== previousValue) {
      setPreviousValue(value)
      setState(
        getInitialState({
          initialValue: value,
          defaultCountry
        })
      )
    }
  }, [value, previousValue, defaultCountry])

  React.useEffect(() => {
    if (defaultCountry !== previousDefaultCountry) {
      setPreviousDefaultCountry(defaultCountry)
      const { inputValue, isoCode } = getInitialState({
        initialValue: '',
        defaultCountry
      })
      setPreviousValue(inputValue)
      onChange?.(inputValue)
      setState({
        inputValue,
        isoCode
      })
    }
  }, [defaultCountry, previousDefaultCountry, onChange])

  const onCountryChange = (newCountry: Iso3166Alpha2Code): void => {
    if (newCountry === state.isoCode) {
      return
    }
    const callingCode = COUNTRIES[newCountry][0] as string
    const newValue = `+${callingCode}`
    onChange?.(newValue)
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
