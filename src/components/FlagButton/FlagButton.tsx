import React from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Flag from '@components/Flag/Flag'
import type { Iso3166Alpha2Code } from '@shared/constants/countries'

export type FlagButtonProps = IconButtonProps & {
  isoCode: Iso3166Alpha2Code | null
  isFlagsMenuOpened: boolean
  disableDropdown?: boolean
}

const FlagButton = (props: FlagButtonProps) => {
  const { isoCode, isFlagsMenuOpened, disableDropdown, ...iconButtonProps } =
    props

  if (disableDropdown) {
    return (
      <IconButton
        tabIndex={-1}
        // eslint-disable-next-line jsx-a11y/aria-role
        role=""
        disableRipple
        // @ts-ignore
        sx={{ pointerEvents: 'none' }}
        component="span"
      >
        <Flag isoCode={isoCode} />
      </IconButton>
    )
  }

  return (
    <IconButton
      {...iconButtonProps}
      aria-label="Select country"
      aria-haspopup="listbox"
      aria-controls={isFlagsMenuOpened ? 'select-country' : undefined}
      aria-expanded={isFlagsMenuOpened ? 'true' : 'false'}
    >
      <Flag isoCode={isoCode} />
    </IconButton>
  )
}

FlagButton.defaultProps = {
  disableDropdown: false
}

export default FlagButton
