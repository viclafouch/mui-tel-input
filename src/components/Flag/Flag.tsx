import React from 'react'
import unknownFlag from '@assets/unknown-flag.png'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import { FLAGS_SVG } from '@shared/constants/flags'
import { FlagSize, GetFlagSources } from '../../index.types'
import { Styled } from './Flag.styled'

export type FlagProps = {
  isoCode: MuiTelInputCountry | null
  countryName?: string
  size?: FlagSize
  getFlagSources?: GetFlagSources
}

const getSourceByIsoCode = (
  isoCode: MuiTelInputCountry | null,
  width: number
) => {
  if (!isoCode) {
    return [{ src: unknownFlag, width }]
  }

  // Not exist on https://flagcdn.com
  if (isoCode === 'TA' || isoCode === 'AC') {
    return [
      {
        width,
        src: {
          TA: FLAGS_SVG.TA,
          AC: FLAGS_SVG.AC
        }[isoCode]
      }
    ]
  }

  return false
}

const defaultGetFlagSources: GetFlagSources = (isoCode, size) => {
  // see https://flagpedia.net/download/api for the valid width
  const width = size === 'small' ? 40 : 80
  const isoCodeFormatted = isoCode ? isoCode.toLowerCase() : ''

  return (
    getSourceByIsoCode(isoCode, width) || [
      {
        type: 'image/png',
        srcSet: `https://flagcdn.com/w${width}/${isoCodeFormatted}.png`,
        width
      },
      {
        type: 'image/webp',
        srcSet: `https://flagcdn.com/w${width}/${isoCodeFormatted}.webp`,
        width
      }
    ]
  )
}

const Flag = ({
  size = 'small',
  isoCode,
  countryName = '',
  getFlagSources = defaultGetFlagSources
}: FlagProps) => {
  const sources = getFlagSources(isoCode, size)
  const regularImage = sources.find(({ src }) => {
    return src
  })
  const alt = countryName || 'unknown'

  return (
    <Styled.Flag data-testid={isoCode} className="MuiTelInput-Flag">
      {regularImage ? (
        <img src={regularImage.src} width={regularImage.width / 2} alt={alt} />
      ) : (
        <Styled.Picture>
          {sources.map(({ srcSet, type }) => {
            return <source type={type} srcSet={srcSet} />
          })}
          <img
            src={sources[0].srcSet}
            width={sources[0].width / 2}
            alt={alt}
            loading="lazy"
          />
        </Styled.Picture>
      )}

      {isoCode ? <Styled.Span>{isoCode}</Styled.Span> : null}
    </Styled.Flag>
  )
}

export default Flag
