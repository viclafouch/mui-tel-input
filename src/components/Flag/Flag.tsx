import React from 'react'
import unknownFlag from '@assets/unknown-flag.png'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import { FLAGS_SVG } from '@shared/constants/flags'
import { FlagSize } from '../../index.types'
import { Styled } from './Flag.styled'

export type FlagProps = {
  isoCode: MuiTelInputCountry | null
  countryName?: string
  size?: FlagSize
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
  const { isoCode, countryName, size } = props

  const isoCodeFormatted = isoCode ? isoCode.toLowerCase() : ''
  const sourceFound = getSourceByIsoCode(isoCode)
  // see https://flagpedia.net/download/api for the valid width
  const width = size === 'small' ? 40 : 80

  return (
    <Styled.Flag data-testid={isoCode} className="MuiTelInput-Flag">
      {sourceFound ? (
        <img
          src={sourceFound}
          alt={countryName || 'unknown'}
          width={width / 2}
        />
      ) : (
        <Styled.Picture>
          <source
            type="image/webp"
            srcSet={`https://flagcdn.com/w${width}/${isoCodeFormatted}.webp`}
          />
          <source
            type="image/png"
            srcSet={`https://flagcdn.com/w${width}/${isoCodeFormatted}.png`}
          />
          <img
            src={`https://flagcdn.com/w${width}/${isoCodeFormatted}.png`}
            width={width / 2}
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
  size: 'small' as FlagSize
}

export default Flag
