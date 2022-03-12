import React from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import SvgIcon from '@mui/material/SvgIcon'
import Flags from 'country-flag-icons/react/3x2'

const defaultLang = 'US'

export type FlagButtonProps = IconButtonProps

const FlagButton = (props: FlagButtonProps) => {
  const FlagComponent = Flags[defaultLang]

  return (
    <IconButton {...props}>
      {FlagComponent ? (
        <SvgIcon
          component={FlagComponent}
          inheritViewBox
          fontSize="small"
          title="United States"
        />
      ) : null}
    </IconButton>
  )
}

export default FlagButton
