import React from 'react'
import { Country } from '@shared/constants/countries'
import { render, screen } from '@testing-library/react'

import FlagButton from './FlagButton'

import '@testing-library/jest-dom'

const theCountry = {
  name: 'Belgium',
  isoCode: 'BE',
  callingCode: 32,
  format: '+.. . .. .. .. ..',
  regions: ['europe', 'european-union']
} as Country

describe('components/FlagButton', () => {
  test('should have aria-expanded to true', () => {
    render(<FlagButton isFlagsMenuOpened selectedCountry={theCountry} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  test('should have aria-expanded to false', () => {
    render(
      <FlagButton isFlagsMenuOpened={false} selectedCountry={theCountry} />
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  test('should be disabled', () => {
    render(
      <FlagButton
        disabled
        isFlagsMenuOpened={false}
        selectedCountry={theCountry}
      />
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
