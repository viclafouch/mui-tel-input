import React from 'react'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import { Styled } from './Flag.styled'

export type FlagProps = {
  isoCode: MuiTelInputCountry | null
  children: React.ReactNode
}

export const flagClass = 'MuiTelInput-Flag'

const Flag = ({ isoCode, children }: FlagProps) => {
  return (
    <Styled.Flag data-testid={isoCode} className={flagClass}>
      {children}
    </Styled.Flag>
  )
}

export default Flag
