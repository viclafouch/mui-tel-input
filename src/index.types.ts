import type { TextFieldProps } from '@mui/material/TextField'
import { Country } from '@shared/constants/countries'

import type { Iso3166Alpha2Code } from './shared/constants/iso'

type BaseTextFieldProps = Omit<
  TextFieldProps,
  'onChange' | 'select' | 'type' | 'multiline'
>

export type Values = {
  value: string
  formattedInt: number | null
  country: Country
}

export type ReasonChanged = 'country' | 'input'

export type MuiPhoneNumberProps = BaseTextFieldProps & {
  excludeCountries?: Iso3166Alpha2Code[]
  onlyCountries?: Iso3166Alpha2Code[]
  defaultCountry?: Iso3166Alpha2Code
  isIsoCodeEditable?: boolean
  onChange?: (values: Values, reason: ReasonChanged) => void
  value?: string
}

export type State = {
  formattedInt: number | null
  value: string
  country: Country
  hasSelectCountry: boolean
}
