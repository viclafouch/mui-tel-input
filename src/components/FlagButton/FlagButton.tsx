import React from 'react'
import Flag from '@components/Flag/Flag'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'
import { getCallingCodeOfCountry } from '@shared/helpers/country'
import { getDefaultImgProps } from '@shared/helpers/flag'
import { getDisplayNames } from '@shared/helpers/intl'
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import type { GetFlagElement } from '../../index.types'
import { Styled } from './FlagButton.styled'

export type FlagButtonProps = IconButtonProps & {
  isoCode: MuiTelInputCountry | null
  forceCallingCode?: boolean
  isFlagsMenuOpened: boolean
  langOfCountryName?: string
  disableDropdown?: boolean
  getFlagElement: GetFlagElement
  unknownFlagElement: React.ReactNode
}

export const flagButtonClass = 'MuiTelInput-IconButton'

const FlagButton = ({
  disableDropdown = false,
  forceCallingCode = false,
  langOfCountryName = DEFAULT_LANG,
  isFlagsMenuOpened,
  getFlagElement,
  unknownFlagElement,
  isoCode,
  ...iconButtonProps
}: FlagButtonProps) => {
  const displayNames = React.useMemo(() => {
    return getDisplayNames(langOfCountryName)
  }, [langOfCountryName])

  const flagElement = (
    <Flag isoCode={isoCode}>
      {isoCode
        ? getFlagElement(isoCode, {
            countryName: displayNames.of(isoCode) || '',
            isSelected: true,
            imgProps: getDefaultImgProps({
              isoCode,
              countryName: displayNames.of(isoCode) || ''
            })
          })
        : unknownFlagElement}
    </Flag>
  )

  return (
    <>
      {disableDropdown ? (
        <IconButton
          tabIndex={-1}
          className={flagButtonClass}
          // eslint-disable-next-line jsx-a11y/aria-role
          role=""
          disableRipple
          // @ts-ignore
          sx={{ pointerEvents: 'none', aspectRatio: '1 / 1' }}
          component="span"
        >
          {flagElement}
        </IconButton>
      ) : (
        <IconButton
          {...iconButtonProps}
          aria-label="Select country"
          className={flagButtonClass}
          aria-haspopup="listbox"
          sx={{ aspectRatio: '1 / 1' }}
          aria-controls={isFlagsMenuOpened ? 'select-country' : undefined}
          aria-expanded={isFlagsMenuOpened ? 'true' : 'false'}
        >
          {flagElement}
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
