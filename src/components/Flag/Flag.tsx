import React from 'react'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import { Styled } from './Flag.styled'

export type FlagProps = {
  isoCode: MuiTelInputCountry | null
  children: React.ReactNode
}

const Flag = ({ isoCode, children }: FlagProps) => {
  return (
    <Styled.Flag data-testid={isoCode} className="MuiTelInput-Flag">
      {children}
    </Styled.Flag>
  )
}

export default Flag
