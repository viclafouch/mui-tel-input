import type { TextFieldProps } from '@mui/material/TextField'
import { Iso3166Alpha2Code } from '@shared/constants/countries'

type BaseTextFieldProps = Omit<
  TextFieldProps,
  'onChange' | 'select' | 'type' | 'multiline'
>

export interface MuiTelInputValues {
  value: string
  formattedInt: number | null
}

export type MuiTelInputReason = 'country' | 'input'

export interface MuiTelInputProps extends BaseTextFieldProps {
  excludeCountries?: Iso3166Alpha2Code[]
  onlyCountries?: Iso3166Alpha2Code[]
  defaultCountry?: Iso3166Alpha2Code
  forceCallingCode?: boolean
  focusOnSelectCountry?: boolean
  disableDropdown?: boolean
  langOfCountryName?: string
  disableFormatting?: boolean
  onChange?: (value: string) => void
  value: string
}

export interface State {
  value: string
  isoCode: Iso3166Alpha2Code | null
  callingCode: string | null
}
