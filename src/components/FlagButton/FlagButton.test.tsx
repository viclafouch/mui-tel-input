import React from 'react'
import { render, screen } from '@testing-library/react'

import FlagButton from './FlagButton'

import '@testing-library/jest-dom'

describe('components/FlagButton', () => {
  test('should have aria-expanded to true', () => {
    render(<FlagButton isFlagsMenuOpened isoCode="FR" />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  test('should have aria-expanded to false', () => {
    render(<FlagButton isFlagsMenuOpened={false} isoCode="FR" />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  test('should be disabled', () => {
    render(<FlagButton disabled isFlagsMenuOpened={false} isoCode="FR" />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
