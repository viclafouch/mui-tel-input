import type { TextFieldProps } from '@mui/material/TextField'

import type { Iso3166Alpha2Code } from './shared/constants/iso'

type BaseTextFieldProps = Omit<
  TextFieldProps,
  'onChange' | 'select' | 'type' | 'multiline'
>

export type MuiPhoneNumberProps = BaseTextFieldProps & {
  excludeCountries?: Iso3166Alpha2Code[]
  onlyCountries?: Iso3166Alpha2Code[]
  defaultCountry?: Iso3166Alpha2Code
}

export type CurrentValue = {
  formattedInt: number
  value: string
}
