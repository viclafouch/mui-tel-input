import React from 'react'
import { render } from '@testing-library/react'

import FlagButton from './FlagButton'

import '@testing-library/jest-dom'

describe('Running Test for FlagButton', () => {
  test('Test flag button', () => {
    render(<FlagButton />)
  })
})
