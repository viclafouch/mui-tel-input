import React from 'react'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

export type FlagsMenuProps = Pick<MenuProps, 'anchorEl' | 'onClose'>

const FlagsMenu = (props: FlagsMenuProps) => {
  const { anchorEl, ...rest } = props

  return (
    <Menu id="lock-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} {...rest}>
      <MenuItem>option</MenuItem>
    </Menu>
  )
}

export default FlagsMenu
