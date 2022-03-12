import React from 'react'
import { COUNTRIES } from '@shared/constants/countries'
import { render } from '@testing-library/react'

import FlagsMenu from './FlagsMenu'

import '@testing-library/jest-dom'

describe('Running Test for FlagsMenu', () => {
  test('Test FlagsMenu', () => {
    render(<FlagsMenu countries={COUNTRIES} />)
  })
})
