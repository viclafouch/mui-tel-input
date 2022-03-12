import React from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

import { Styled } from './FlagsButton.styled'

export type FlagButtonProps = IconButtonProps

const FlagButton = (props: FlagButtonProps) => {
  return (
    <IconButton {...props}>
      <Styled.Flag />
    </IconButton>
  )
}

export default FlagButton
