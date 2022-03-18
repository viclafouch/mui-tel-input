import type { TextFieldProps } from '@mui/material/TextField'

import type { Country } from './shared/constants/countries'
import type { Iso3166Alpha2Code } from './shared/constants/iso'

export type { Country, Iso3166Alpha2Code }

type BaseTextFieldProps = Omit<
  TextFieldProps,
  'onChange' | 'select' | 'type' | 'multiline'
>

export interface MuiTelInputValues {
  value: string
  formattedInt: number | null
  country: Country
}

export type MuiTelInputReason = 'country' | 'input'

export interface MuiTelInputProps extends BaseTextFieldProps {
  excludeCountries?: Iso3166Alpha2Code[]
  onlyCountries?: Iso3166Alpha2Code[]
  defaultCountry?: Iso3166Alpha2Code
  isIsoCodeEditable?: boolean
  focusOnSelectCountry?: boolean
  disableDropdown?: boolean
  langOfCountryName?: Iso3166Alpha2Code
  disableFormatting?: boolean
  onChange?: (values: MuiTelInputValues, reason: MuiTelInputReason) => void
  value?: string
}

export interface State {
  formattedInt: number | null
  value: string
  country: Country
  hasSelectCountry: boolean
}
