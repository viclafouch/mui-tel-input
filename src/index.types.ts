import type { TextFieldProps } from '@mui/material/TextField'

import type { Iso3166Alpha2Code } from './shared/constants/iso'

type BaseTextFieldProps = Omit<TextFieldProps, 'InputProps'>

export type MuiPhoneNumberProps = BaseTextFieldProps & {
  excludeCountries?: Iso3166Alpha2Code[]
  defaultCountry?: Iso3166Alpha2Code
}
