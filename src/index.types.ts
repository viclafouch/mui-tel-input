import type { NumberType } from 'libphonenumber-js'
import type { MuiTelInputContinent } from '@shared/constants/continents'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { MenuProps } from '@mui/material/Menu'
import type { TextFieldProps } from '@mui/material/TextField'

type BaseTextFieldProps = Omit<
  TextFieldProps,
  | 'onChange'
  | 'select'
  | 'type'
  | 'multiline'
  | 'defaultValue'
  | 'inputProps'
  | 'InputProps'
>

export type { MuiTelInputContinent, MuiTelInputCountry }

export type MuiTelInputReason = 'country' | 'input' | 'blur'

export type MuiTelInputFlagElement = React.ReactNode

export type GetFlagElement = (
  isoCode: MuiTelInputCountry,
  {
    countryName,
    isSelected,
    imgProps
  }: {
    countryName: string
    isSelected: boolean
    imgProps: React.ComponentPropsWithRef<'img'>
  }
) => MuiTelInputFlagElement

export interface MuiTelInputInfo {
  countryCode: MuiTelInputCountry | null
  countryCallingCode: string | null
  nationalNumber: string | null
  numberType: Exclude<NumberType, undefined> | null
  numberValue: string | null
  reason: MuiTelInputReason
}

type ForceCallingCodeWithDefaultCountry =
  | {
      forceCallingCode: true
      defaultCountry: MuiTelInputCountry
    }
  | {
      forceCallingCode?: false | undefined
      defaultCountry?: MuiTelInputCountry
    }

export type MuiTelInputProps = BaseTextFieldProps &
  ForceCallingCodeWithDefaultCountry & {
    excludedCountries?: MuiTelInputCountry[]
    onlyCountries?: MuiTelInputCountry[]
    preferredCountries?: MuiTelInputCountry[]
    focusOnSelectCountry?: boolean
    disableDropdown?: boolean
    langOfCountryName?: string
    disableFormatting?: boolean
    continents?: MuiTelInputContinent[]
    onChange?: (value: string, info: MuiTelInputInfo) => void
    onBlur?: (
      event: React.FocusEvent<HTMLInputElement>,
      info: MuiTelInputInfo
    ) => void
    value?: string | undefined
    MenuProps?: Partial<MenuProps>
    getFlagElement?: GetFlagElement
    unknownFlagElement?: MuiTelInputFlagElement
    FlagIconButtonProps?: Partial<IconButtonProps>
  }
