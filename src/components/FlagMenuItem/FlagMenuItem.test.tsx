import React from 'react'
import { COUNTRIES, Country } from '@shared/constants/countries'
import { getCountryByIsoCode } from '@shared/helpers/country'
import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import FlagMenuItem from './FlagMenuItem'

import '@testing-library/jest-dom'

describe('components/FlagMenuItem', () => {
  test('should have aria-expanded to true', () => {
    const callback = vi.fn(() => {})
    render(
      <FlagMenuItem
        country={getCountryByIsoCode('FR', COUNTRIES) as Country}
        onSelectCountry={callback}
      />
    )
    fireEvent.click(screen.getByRole('option'))
    expect(callback).toHaveBeenCalled()
  })

  test('should contain the correct text and the flag', () => {
    const callback = vi.fn(() => {})
    render(
      <FlagMenuItem
        country={getCountryByIsoCode('FR', COUNTRIES) as Country}
        onSelectCountry={callback}
      />
    )
    expect(screen.getByRole('option')).toHaveTextContent('+33')
    expect(screen.getByRole('option')).toHaveTextContent('France')
    expect(screen.getByTestId('FR')).toBeTruthy()
  })
})
