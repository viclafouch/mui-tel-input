import type { TextFieldProps } from '@mui/material/TextField'

import type { Country } from './shared/constants/countries'
import type { Iso3166Alpha2Code } from './shared/constants/iso'

export type { Country, Iso3166Alpha2Code }

type BaseTextFieldProps = Omit<
  TextFieldProps,
  'onChange' | 'select' | 'type' | 'multiline'
>

export interface MuiPhoneNumberValues {
  value: string
  formattedInt: number | null
  country: Country
}

export type MuiPhoneNumberReason = 'country' | 'input'

export interface MuiPhoneNumberProps extends BaseTextFieldProps {
  excludeCountries?: Iso3166Alpha2Code[]
  onlyCountries?: Iso3166Alpha2Code[]
  defaultCountry?: Iso3166Alpha2Code
  isIsoCodeEditable?: boolean
  onChange?: (
    values: MuiPhoneNumberValues,
    reason: MuiPhoneNumberReason
  ) => void
  value?: string
}

export interface State {
  formattedInt: number | null
  value: string
  country: Country
  hasSelectCountry: boolean
}
