import React from 'react'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import SvgIcon from '@mui/material/SvgIcon'
import Flags from 'country-flag-icons/react/3x2'

const defaultLang = 'US'

const Adornment = () => {
  const FlagComponent = Flags[defaultLang]

  return (
    <InputAdornment position="start">
      <IconButton>
        {FlagComponent ? (
          <SvgIcon
            component={FlagComponent}
            inheritViewBox
            fontSize="small"
            title="United States"
          />
        ) : null}
      </IconButton>
    </InputAdornment>
  )
}

export default Adornment
