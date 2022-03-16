import React from 'react'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Flag from '@components/Flag/Flag'
import type { Country } from '@shared/constants/countries'

import { Styled } from './FlagsMenuItem.styled'

export type FlagMenuItemProps = MenuItemProps & {
  country: Country
  onSelectCountry: (country: Country) => void
}

const FlagMenuItem = (props: FlagMenuItemProps) => {
  const { country, onSelectCountry, ...menuItemProps } = props

  const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.preventDefault()
    onSelectCountry(country)
  }

  return (
    <MenuItem
      {...menuItemProps}
      onClick={handleClick}
      role="option"
      data-testid={`option-${country.isoCode}`}
    >
      <Styled.ListItemIcon>
        <Flag isoCode={country.isoCode} />
      </Styled.ListItemIcon>
      <Styled.ListItemText>{country.name}</Styled.ListItemText>
      <Typography variant="body2" color="text.secondary">
        +{country.callingCode}
      </Typography>
    </MenuItem>
  )
}

export default React.memo(FlagMenuItem)
