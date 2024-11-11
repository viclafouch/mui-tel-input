import React from 'react'
import { type MuiTelInputProps } from '../../index.types'

type Options = Pick<MuiTelInputProps, 'disableDropdown' | 'disabled'>

export function useAnchor({ disabled, disableDropdown }: Options) {
  const anchorRef = React.useRef<HTMLDivElement | null>(null)
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null)

  const openMenu = () => {
    if (!disabled || !disableDropdown) {
      setAnchorEl(anchorRef.current)
    }
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return {
    anchorRef,
    anchorEl,
    openMenu,
    closeMenu
  }
}
