import type { MenuProps } from '@mui/material/Menu'
import type { TextFieldProps } from '@mui/material/TextField'
import { ContinentCode } from '@shared/constants/continents'
import { Iso3166Alpha2Code } from '@shared/constants/countries'

type BaseTextFieldProps = Omit<
  TextFieldProps,
  'onChange' | 'select' | 'type' | 'multiline' | 'defaultValue'
>

export interface MuiTelInputValues {
  value: string
  formattedInt: number | null
}

export type MuiTelInputReason = 'country' | 'input'

export interface MuiTelInputProps extends BaseTextFieldProps {
  excludedCountries?: Iso3166Alpha2Code[]
  onlyCountries?: Iso3166Alpha2Code[]
  preferredCountries?: Iso3166Alpha2Code[]
  defaultCountry?: Iso3166Alpha2Code
  forceCallingCode?: boolean
  focusOnSelectCountry?: boolean
  disableDropdown?: boolean
  langOfCountryName?: string
  disableFormatting?: boolean
  continents?: ContinentCode[]
  onChange?: (value: string) => void
  value: string
  MenuProps?: Partial<MenuProps>
}

export interface State {
  value: string
  isoCode: Iso3166Alpha2Code | null
  callingCode: string | null
}
