import React from 'react'
import { render } from '@testing-library/react'
import Flag from './Flag'
import '@testing-library/jest-dom'

describe('components/Flag', () => {
  test('should render correctly', () => {
    render(<Flag isoCode="FR" />)
  })
})
