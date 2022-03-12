import React from 'react'
import TextField from '@mui/material/TextField'

import Adornment from './components/Adornment/Adornment'
import type { MuiPhoneNumberProps } from './index.types'

const MuiPhoneNumber = (props: MuiPhoneNumberProps) => {
  const { title, ...textFieldProps } = props
  return (
    <TextField
      type="tel"
      InputProps={{
        startAdornment: <Adornment />
      }}
      {...textFieldProps}
    />
  )
}

export default MuiPhoneNumber
