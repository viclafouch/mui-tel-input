import React from 'react'
import { vi } from 'vitest'
import { getDisplayNames } from '@shared/helpers/intl'
import { fireEvent, render, screen } from '@testing-library/react'
import FlagMenuItem from './FlagMenuItem'
import '@testing-library/jest-dom'

describe('components/FlagMenuItem', () => {
  test('should have aria-expanded to true', () => {
    const callback = vi.fn(() => {})
    render(
      <FlagMenuItem
        displayNames={getDisplayNames('en')}
        isoCode="FR"
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
        displayNames={getDisplayNames('en')}
        isoCode="FR"
        onSelectCountry={callback}
      />
    )
    expect(screen.getByRole('option')).toHaveTextContent('+33')
    expect(screen.getByRole('option')).toHaveTextContent('France')
    expect(screen.getByTestId('FR')).toBeTruthy()
  })

  test('should display the translated country name', () => {
    const callback = vi.fn(() => {})
    render(
      <FlagMenuItem
        displayNames={getDisplayNames('en')}
        isoCode="BE"
        onSelectCountry={callback}
      />
    )
    expect(screen.getByRole('option')).toHaveTextContent('Belgium')
  })
})
