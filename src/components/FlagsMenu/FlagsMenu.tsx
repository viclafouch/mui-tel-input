import React from 'react'
import { ListItemIcon, ListItemText } from '@mui/material'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Flag from '@components/Flag/Flag'
import type { Country } from '@shared/constants/countries'

export type FlagsMenuProps = Pick<MenuProps, 'anchorEl' | 'onClose'> & {
  countries: readonly Country[]
}

const FlagsMenu = (props: FlagsMenuProps) => {
  const { anchorEl, countries, ...rest } = props

  return (
    <Menu id="lock-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} {...rest}>
      {countries.map((country) => {
        return (
          <MenuItem key={country.isoCode}>
            <ListItemIcon sx={{ marginRight: '10px' }}>
              <Flag isoCode={country.isoCode} />
            </ListItemIcon>
            <ListItemText sx={{ marginRight: '10px' }}>
              {country.name}
            </ListItemText>
            <Typography variant="body2" color="text.secondary">
              +{country.callingCode}
            </Typography>
          </MenuItem>
        )
      })}
    </Menu>
  )
}

export default FlagsMenu
