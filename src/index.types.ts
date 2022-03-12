import type { TextFieldProps } from '@mui/material/TextField'

type BaseTextFieldProps = Omit<TextFieldProps, 'InputProps'>

export type MuiPhoneNumberProps = BaseTextFieldProps & {
  title: 'toto'
}
