import { NumberType } from 'libphonenumber-js'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import type { MenuProps } from '@mui/material/Menu'
import type { TextFieldProps } from '@mui/material/TextField'

type BaseTextFieldProps = Omit<
  TextFieldProps,
  'onChange' | 'select' | 'type' | 'multiline' | 'defaultValue'
>

export type { MuiTelInputContinent, MuiTelInputCountry }

export type FlagSize = `small` | 'medium'

export type MuiTelInputReason = 'country' | 'input'

export interface MuiTelInputInfo {
  countryCode: MuiTelInputCountry | null
  countryCallingCode: string | null
  nationalNumber: string | null
  numberType: Exclude<NumberType, undefined> | null
  numberValue: string | null
  reason: MuiTelInputReason
}

export interface MuiTelInputProps extends BaseTextFieldProps {
  excludedCountries?: MuiTelInputCountry[]
  onlyCountries?: MuiTelInputCountry[]
  preferredCountries?: MuiTelInputCountry[]
  // Todo: make it required if `forceCallingCode` is true
  defaultCountry?: MuiTelInputCountry
  forceCallingCode?: boolean
  focusOnSelectCountry?: boolean
  disableDropdown?: boolean
  flagSize?: FlagSize
  langOfCountryName?: string
  disableFormatting?: boolean
  continents?: MuiTelInputContinent[]
  onChange?: (value: string, info: MuiTelInputInfo) => void
  value?: string | undefined
  MenuProps?: Partial<MenuProps>
  allowSearch?: boolean
}
