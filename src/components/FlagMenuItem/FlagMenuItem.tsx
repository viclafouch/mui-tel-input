import React from 'react'
import Flag, { FlagStyle } from '@components/Flag/Flag'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { COUNTRIES, MuiTelInputCountry } from '@shared/constants/countries'
import { Styled } from './FlagsMenuItem.styled'

export type FlagMenuItemProps = MenuItemProps & {
  isoCode: MuiTelInputCountry
  onSelectCountry: (isoCode: MuiTelInputCountry) => void
  displayNames: Intl.DisplayNames
  flagStyle?: FlagStyle
}

const FlagMenuItem = (props: FlagMenuItemProps) => {
  const {
    isoCode,
    onSelectCountry,
    displayNames,
    flagStyle,
    ...menuItemProps
  } = props

  const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.preventDefault()
    onSelectCountry(isoCode)
  }

  const countryName = displayNames.of(isoCode)

  return (
    <MenuItem
      {...menuItemProps}
      onClick={handleClick}
      role="option"
      data-testid={`option-${isoCode}`}
      className="MuiTelInput-MenuItem"
    >
      <Styled.ListItemIcon className="MuiTelInput-ListItemIcon-flag">
        <Flag isoCode={isoCode} countryName={countryName} style={flagStyle} />
      </Styled.ListItemIcon>
      <Styled.ListItemText className="MuiTelInput-ListItemText-country">
        {countryName}
      </Styled.ListItemText>
      <Typography
        variant="body2"
        color="text.secondary"
        className="MuiTelInput-Typography-calling-code"
      >
        +{COUNTRIES[isoCode]?.[0]}
      </Typography>
    </MenuItem>
  )
}

FlagMenuItem.defaultProps = {
  flagStyle: {}
}

export default React.memo(FlagMenuItem)
