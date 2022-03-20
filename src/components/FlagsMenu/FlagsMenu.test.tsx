import React from 'react'
import { ISO_CODES, Iso3166Alpha2Code } from '@shared/constants/countries'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, vi } from 'vitest'

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

  test('should list all countries without filters props', () => {
    render(
      <FlagsMenu
        anchorEl={getAnchorEl()}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    expect(screen.getAllByRole('option').length).toBe(ISO_CODES.length)
  })

  test('should fire onSelectCountry', () => {
    const callback = vi.fn((country: Iso3166Alpha2Code) => {
      return country
    })
    render(
      <FlagsMenu
        anchorEl={getAnchorEl()}
        isoCode="FR"
        onSelectCountry={callback}
      />
    )
    fireEvent.click(screen.getByText('France'))
    expect(callback).toBeCalledTimes(1)
    expect(callback).toHaveBeenLastCalledWith('FR')
  })

  test('should list onlyCountries', () => {
    render(
      <FlagsMenu
        onlyCountries={['FR']}
        anchorEl={getAnchorEl()}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    const options = screen.getAllByRole('option')
    expect(options.length).toBe(1)
    expect(options[0].id).toBe('country-FR')
  })

  test('should exclude countries', () => {
    render(
      <FlagsMenu
        excludeCountries={['FR']}
        anchorEl={getAnchorEl()}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    expect(screen.queryByText('France')).toBeNull()
  })
})
