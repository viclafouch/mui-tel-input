import React from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Flag from '@components/Flag/Flag'
import type { Country } from '@shared/constants/countries'

export type FlagButtonProps = IconButtonProps & {
  selectedCountry: Country
}

const FlagButton = (props: FlagButtonProps) => {
  const { selectedCountry, ...iconButtonProps } = props

  return (
    <IconButton {...iconButtonProps}>
      <Flag isoCode={selectedCountry.isoCode} />
    </IconButton>
  )
}

export default FlagButton
