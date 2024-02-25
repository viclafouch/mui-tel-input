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

export const menuItemClass = 'MuiTelInput-MenuItem'
export const listItemIconFlagClass = 'MuiTelInput-ListItemIcon-flag'
export const listItemTextCountryClass = 'MuiTelInput-ListItemText-country'
export const callingCodeClass = 'MuiTelInput-Typography-calling-code'

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
      className={menuItemClass}
    >
      <Styled.ListItemIcon className={listItemIconFlagClass}>
        <Flag isoCode={isoCode}>
          {getFlagElement(isoCode, {
            countryName,
            isSelected: false,
            imgProps: getDefaultImgProps({ isoCode, countryName })
          })}
        </Flag>
      </Styled.ListItemIcon>
      <Styled.ListItemText className={listItemTextCountryClass}>
        {countryName}
      </Styled.ListItemText>
      <Typography
        variant="body2"
        color="text.secondary"
        className={callingCodeClass}
      >
        +{COUNTRIES[isoCode]?.[10] != '0' &&
        COUNTRIES[isoCode]?.[0] == '1' &&
        !COUNTRIES[isoCode]?.[10]?.includes('[') &&
        !COUNTRIES[isoCode]?.[10]?.includes('|')
          ? `${COUNTRIES[isoCode]?.[0]}-${COUNTRIES[isoCode]?.[10]}`
          : COUNTRIES[isoCode]?.[0]}
      </Typography>
    </MenuItem>
  )
}

export default React.memo(FlagMenuItem)
