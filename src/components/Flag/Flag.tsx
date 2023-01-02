import React from 'react'
import unknownFlag from '@assets/unknown-flag.png'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import { FLAGS_SVG } from '@shared/constants/flags'
import { Styled } from './Flag.styled'

export type FlagProps = {
  isoCode: MuiTelInputCountry | null
  countryName?: string
}

const getSourceByIsoCode = (isoCode: MuiTelInputCountry | null) => {
  if (!isoCode) {
    return unknownFlag
  }
  // Not exist on https://flagcdn.com
  if (isoCode === 'TA' || isoCode === 'AC') {
    return {
      TA: FLAGS_SVG.TA,
      AC: FLAGS_SVG.AC
    }[isoCode]
  }
  return ''
}

const Flag = (props: FlagProps) => {
  const { isoCode, countryName } = props

  const isoCodeFormatted = isoCode ? isoCode.toLowerCase() : ''
  const sourceFound = getSourceByIsoCode(isoCode)

  return (
    <Styled.Flag data-testid={isoCode} className="MuiTelInput-Flag">
      {sourceFound ? (
        <img
          src={sourceFound}
          alt={countryName || 'unknown'}
          width="28"
          height={21}
        />
      ) : (
        <Styled.Picture>
          <source
            type="image/webp"
            srcSet={`https://flagcdn.com/24x18/${isoCodeFormatted}.webp,
        https://flagcdn.com/56x42/${isoCodeFormatted}.webp 2x,
        https://flagcdn.com/84x63/${isoCodeFormatted}.webp 3x`}
          />
          <source
            type="image/png"
            srcSet={`https://flagcdn.com/24x18/${isoCodeFormatted}.png,
        https://flagcdn.com/56x42/${isoCodeFormatted}.png 2x,
        https://flagcdn.com/84x63/${isoCodeFormatted}.png 3x`}
          />
          <img
            src={`https://flagcdn.com/24x18/${isoCodeFormatted}.png`}
            width="28"
            height="21"
            alt={countryName || 'unknown'}
            loading="lazy"
          />
        </Styled.Picture>
      )}

      {isoCode ? <Styled.Span>{isoCode}</Styled.Span> : null}
    </Styled.Flag>
  )
}

Flag.defaultProps = {
  countryName: ''
}

export default Flag
