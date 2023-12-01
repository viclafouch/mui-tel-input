import React from 'react'
import {
  defaultUnknownFlagElement,
  getDefaultFlagElement
} from '@shared/helpers/flag'
import { render } from '@testing-library/react'
import FlagButton from './FlagButton'
import '@testing-library/jest-dom'

describe('components/FlagButton', () => {
  test('should have aria-expanded to true', () => {
    const screen = render(
      <FlagButton
        getFlagElement={getDefaultFlagElement}
        unknownFlagElement={defaultUnknownFlagElement}
        isFlagsMenuOpened
        isoCode="FR"
      />
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  test('should have aria-expanded to false', () => {
    const screen = render(
      <FlagButton
        getFlagElement={getDefaultFlagElement}
        unknownFlagElement={defaultUnknownFlagElement}
        isFlagsMenuOpened={false}
        isoCode="FR"
      />
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  test('should be disabled', () => {
    const screen = render(
      <FlagButton
        getFlagElement={getDefaultFlagElement}
        unknownFlagElement={defaultUnknownFlagElement}
        disabled
        isFlagsMenuOpened={false}
        isoCode="FR"
      />
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('should display unknown flag', () => {
    const screen = render(
      <FlagButton
        getFlagElement={getDefaultFlagElement}
        unknownFlagElement={<img src="/" alt="test" />}
        isFlagsMenuOpened
        isoCode={null}
      />
    )

    expect(screen.getByRole('img')).toHaveAccessibleName('test')
  })

  test('should display element flag', () => {
    const screen = render(
      <FlagButton
        getFlagElement={() => {
          return <img src="/" alt="France" />
        }}
        unknownFlagElement={defaultUnknownFlagElement}
        isFlagsMenuOpened
        isoCode="FR"
      />
    )

    expect(screen.getByRole('img')).toHaveAccessibleName('France')
  })
})
