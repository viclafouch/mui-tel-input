import React from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Flag from '@components/Flag/Flag'
import type { Country } from '@shared/constants/countries'

export type FlagButtonProps = IconButtonProps & {
  selectedCountry: Country
  isFlagsMenuOpened: boolean
}

const FlagButton = (props: FlagButtonProps) => {
  const { selectedCountry, isFlagsMenuOpened, ...iconButtonProps } = props

  return (
    <IconButton
      {...iconButtonProps}
      aria-label="Select country"
      aria-haspopup="listbox"
      aria-controls={isFlagsMenuOpened ? 'select-country' : undefined}
      aria-expanded={isFlagsMenuOpened ? 'true' : 'false'}
    >
      <Flag isoCode={selectedCountry.isoCode} />
    </IconButton>
  )
}

export default FlagButton
