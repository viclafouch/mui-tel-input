import React from 'react'
import { render, screen } from '@testing-library/react'

import FlagsMenu from './FlagsMenu'

import '@testing-library/jest-dom'

function getAnchorEl() {
  return screen.getByText('My textfield')
}

describe('components/FlagsMenu', () => {
  beforeAll(() => {
    document.body.innerHTML = `<div>My textfield</div>`
  })
  test('should render correctly', () => {
    render(<FlagsMenu isoCode="FR" onSelectCountry={() => {}} />)
  })

  test('should displayed when anchorEl is valid', () => {
    render(
      <FlagsMenu
        anchorEl={getAnchorEl()}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
  })
})
