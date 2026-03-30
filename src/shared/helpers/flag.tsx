import React from 'react'
import unknownFlag from '@assets/unknown-flag.png'
import { FLAGS_SVG } from '@shared/constants/flags'
import type { GetFlagElement, MuiTelInputCountry } from '../../index.types'

const getDefaultImageSrc = (isoCode: MuiTelInputCountry) => {
  if (isoCode === 'TA' || isoCode === 'AC') {
    return {
      TA: FLAGS_SVG.TA,
      AC: FLAGS_SVG.AC
    }[isoCode]
  }

  // see https://flagpedia.net/download/api
  return `https://flagcdn.com/w40/${isoCode.toLowerCase()}.webp`
}

export const flagImgClass = 'MuiTelInput-FlagImg'

export const getDefaultImgProps = ({
  isoCode
}: {
  isoCode: MuiTelInputCountry
  countryName: string
}) => {
  return {
    src: getDefaultImageSrc(isoCode),
    loading: 'lazy',
    width: 26,
    alt: '',
    className: flagImgClass
  } satisfies React.ComponentPropsWithoutRef<'img'>
}

export const getDefaultFlagElement: GetFlagElement = (
  isoCode,
  { countryName }
) => {
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is spread from getDefaultImgProps
  return <img {...getDefaultImgProps({ isoCode, countryName })} />
}

export const defaultUnknownFlagElement = (
  <img
    src={unknownFlag}
    loading="lazy"
    width={26}
    alt=""
    className={flagImgClass}
  />
)
