import React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import FlagButton from './components/FlagButton/FlagButton'
import FlagsMenu from './components/FlagsMenu/FlagsMenu'
import type { MuiPhoneNumberProps } from './index.types'

const MuiPhoneNumber = (props: MuiPhoneNumberProps) => {
  const { title, ...textFieldProps } = props
  const textFieldRef = React.useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)

  const handleOpenFlagsMenu = () => {
    setAnchorEl(textFieldRef.current)
  }

  const handleCloseFlagsMenu = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <TextField
        type="tel"
        ref={textFieldRef}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FlagButton onClick={handleOpenFlagsMenu} />
            </InputAdornment>
          )
        }}
        {...textFieldProps}
      />
      <FlagsMenu anchorEl={anchorEl} onClose={handleCloseFlagsMenu} />
    </>
  )
}

export default MuiPhoneNumber
