import React from 'react'
import unknownFlag from '@assets/unknown-flag.png'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import { FLAGS_SVG } from '@shared/constants/flags'
import { Styled } from './Flag.styled'

export type FlagProps = {
  isoCode: MuiTelInputCountry | null
}

const Flag = (props: FlagProps) => {
  const { isoCode } = props

  const svgFlag =
    isoCode && isoCode in FLAGS_SVG ? `"${FLAGS_SVG[isoCode]}"` : unknownFlag

  return (
    <Styled.Flag
      data-testid={isoCode}
      className="MuiTelInput-Flag"
      style={{
        backgroundImage: `url(${svgFlag})`
      }}
    >
      {isoCode ? <Styled.Span>{isoCode}</Styled.Span> : null}
    </Styled.Flag>
  )
}

export default Flag
