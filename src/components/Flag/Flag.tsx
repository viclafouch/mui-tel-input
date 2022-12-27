import React from 'react'
import unknownFlag from '@assets/unknown-flag.png'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import { FLAGS_SVG } from '@shared/constants/flags'
import { Styled } from './Flag.styled'

export type FlagStyle = {
  width?: number
  height?: number
  variant?: 'waving' | 'original'
}

export type FlagProps = {
  isoCode: MuiTelInputCountry | null
  countryName?: string
  style?: FlagStyle
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
  const { isoCode, countryName, style } = props

  const isoCodeFormatted = isoCode ? isoCode.toLowerCase() : ''
  const sourceFound = getSourceByIsoCode(isoCode)

  return (
    <Styled.Flag data-testid={isoCode} className="MuiTelInput-Flag">
      {sourceFound ? (
        <img
          src={sourceFound}
          alt={countryName || 'unknown'}
          width={style?.width}
          height={style?.height}
        />
      ) : (
        <Styled.Picture>
          <source
            type="image/webp"
            srcSet={`https://flagcdn.com/${
              style?.variant === 'waving' ? '28x21' : 'w40'
            }/${isoCodeFormatted}.webp,
        https://flagcdn.com/${
          style?.variant === 'waving' ? '56x42' : 'w80'
        }/${isoCodeFormatted}.webp 2x,
        https://flagcdn.com/${
          style?.variant === 'waving' ? '84x63' : 'w160'
        }/${isoCodeFormatted}.webp 3x`}
          />
          <source
            type="image/png"
            srcSet={`https://flagcdn.com/${
              style?.variant === 'waving' ? '28x21' : 'w40'
            }/${isoCodeFormatted}.png,
        https://flagcdn.com/${
          style?.variant === 'waving' ? '56x42' : 'w80'
        }/${isoCodeFormatted}.png 2x,
        https://flagcdn.com/${
          style?.variant === 'waving' ? '84x63' : 'w160'
        }/${isoCodeFormatted}.png 3x`}
          />
          <img
            src={`https://flagcdn.com/${
              style?.variant === 'waving' ? '28x21' : 'w40'
            }/${isoCodeFormatted}.png`}
            width={style?.width}
            height={style?.height}
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
  countryName: '',
  style: {
    width: 28,
    height: 21,
    variant: 'original'
  }
}

export default Flag
