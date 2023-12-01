import React from 'react'
import { vi } from 'vitest'
import { getDefaultFlagElement } from '@shared/helpers/flag'
import { getDisplayNames } from '@shared/helpers/intl'
import { fireEvent, render } from '@testing-library/react'
import FlagMenuItem from './FlagMenuItem'
import '@testing-library/jest-dom'

describe('components/FlagMenuItem', () => {
  test('should have aria-expanded to true', () => {
    const callback = vi.fn(() => {})
    const screen = render(
      <FlagMenuItem
        countryName={getDisplayNames('en').of('FR') as string}
        isoCode="FR"
        getFlagElement={getDefaultFlagElement}
        onSelectCountry={callback}
      />
    )
    fireEvent.click(screen.getByRole('option'))
    expect(callback).toHaveBeenCalled()
  })

  test('should contain the correct text and the flag', () => {
    const callback = vi.fn(() => {})
    const screen = render(
      <FlagMenuItem
        countryName={getDisplayNames('en').of('FR') as string}
        getFlagElement={getDefaultFlagElement}
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
    const screen = render(
      <FlagMenuItem
        countryName={getDisplayNames('en').of('BE') as string}
        getFlagElement={getDefaultFlagElement}
        isoCode="BE"
        onSelectCountry={callback}
      />
    )
    expect(screen.getByRole('option')).toHaveTextContent('Belgium')
  })

  test('should display element flag with correct alt property', () => {
    const callback = vi.fn(() => {})
    const screen = render(
      <FlagMenuItem
        countryName={getDisplayNames('en').of('BE') as string}
        getFlagElement={(isoCode, { countryName }) => {
          return <img src="/" alt={countryName} />
        }}
        isoCode="BE"
        onSelectCountry={callback}
      />
    )

    expect(screen.getByRole('img')).toHaveAccessibleName('Belgium')
  })
})
