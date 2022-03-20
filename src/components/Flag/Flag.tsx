import React from 'react'
import { FLAGS_SVG } from '@assets/flags-svg'
import unknownFlag from '@assets/unknown-flag.png'
import type { Iso3166Alpha2Code } from '@shared/constants/countries'

import { Styled } from './Flag.styled'

export type FlagProps = {
  isoCode: Iso3166Alpha2Code | null
}

const Flag = (props: FlagProps) => {
  const { isoCode } = props

  const svgFlag =
    isoCode && isoCode in FLAGS_SVG ? `"${FLAGS_SVG[isoCode]}"` : unknownFlag

  return (
    <Styled.Flag
      data-testid={isoCode}
      style={{
        backgroundImage: `url(${svgFlag})`
      }}
    >
      {isoCode ? <Styled.Span>{isoCode}</Styled.Span> : null}
    </Styled.Flag>
  )
}

export default Flag
