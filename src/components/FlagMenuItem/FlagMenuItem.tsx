import React from 'react'
import Flag from '@components/Flag/Flag'
import { COUNTRIES, MuiTelInputCountry } from '@shared/constants/countries'
import { getDefaultImgProps } from '@shared/helpers/flag'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import type { GetFlagElement } from '../../index.types'
import { Styled } from './FlagsMenuItem.styled'

export type FlagMenuItemProps = MenuItemProps & {
  isoCode: MuiTelInputCountry
  onSelectCountry: (isoCode: MuiTelInputCountry) => void
  countryName: string
  getFlagElement: GetFlagElement
}

const FlagMenuItem = ({
  isoCode,
  onSelectCountry,
  countryName,
  getFlagElement,
  ...restMenuItemProps
}: FlagMenuItemProps) => {
  const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.preventDefault()
    onSelectCountry(isoCode)
  }

  return (
    <MenuItem
      {...restMenuItemProps}
      onClick={handleClick}
      role="option"
      data-testid={`option-${isoCode}`}
      className="MuiTelInput-MenuItem"
    >
      <Styled.ListItemIcon className="MuiTelInput-ListItemIcon-flag">
        <Flag isoCode={isoCode}>
          {getFlagElement(isoCode, {
            countryName,
            isSelected: false,
            imgProps: getDefaultImgProps({ isoCode, countryName })
          })}
        </Flag>
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

export default React.memo(FlagMenuItem)
