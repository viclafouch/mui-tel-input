import React from 'react'
import Flag from '@components/Flag/Flag'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import { getCallingCodeOfCountry } from '@shared/helpers/country'
import { FlagSize } from '../../index.types'
import { Styled } from './FlagButton.styled'

export type FlagButtonProps = IconButtonProps & {
  isoCode: MuiTelInputCountry | null
  forceCallingCode?: boolean
  isFlagsMenuOpened: boolean
  disableDropdown?: boolean
  flagSize?: FlagSize
}

const FlagButton = ({
  disableDropdown = false,
  forceCallingCode = false,
  flagSize = 'small',
  isFlagsMenuOpened = false,
  isoCode,
  ...iconButtonProps
}: FlagButtonProps) => {
  return (
    <>
      {disableDropdown ? (
        <IconButton
          tabIndex={-1}
          className="MuiTelInput-IconButton"
          // eslint-disable-next-line jsx-a11y/aria-role
          role=""
          disableRipple
          // @ts-ignore
          sx={{ pointerEvents: 'none', aspectRatio: '1 / 1' }}
          component="span"
        >
          <Flag size={flagSize} isoCode={isoCode} />
        </IconButton>
      ) : (
        <IconButton
          {...iconButtonProps}
          aria-label="Select country"
          className="MuiTelInput-IconButton"
          aria-haspopup="listbox"
          sx={{ aspectRatio: '1 / 1' }}
          aria-controls={isFlagsMenuOpened ? 'select-country' : undefined}
          aria-expanded={isFlagsMenuOpened ? 'true' : 'false'}
        >
          <Flag size={flagSize} isoCode={isoCode} />
        </IconButton>
      )}
      {forceCallingCode && isoCode ? (
        <Styled.CallingCodeSplitted>
          +{getCallingCodeOfCountry(isoCode)}
        </Styled.CallingCodeSplitted>
      ) : null}
    </>
  )
}

export default FlagButton
