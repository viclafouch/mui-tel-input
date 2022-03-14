import React from 'react'
import { COUNTRIES, Country } from '@shared/constants/countries'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, vi } from 'vitest'

import FlagsMenu from './FlagsMenu'

import '@testing-library/jest-dom'

function getAnchorEl() {
  return screen.getByText('My textfield')
}

const theCountry = {
  name: 'France',
  isoCode: 'FR',
  callingCode: 33,
  format: '+.. ... .. .. ..',
  regions: ['europe', 'european-union']
} as Country

describe('components/FlagsMenu', () => {
  beforeAll(() => {
    document.body.innerHTML = `<div>My textfield</div>`
  })
  test('should render correctly', () => {
    render(
      <FlagsMenu selectedCountry={theCountry} onSelectCountry={() => {}} />
    )
  })

  test('should displayed when anchorEl is valid', () => {
    render(
      <FlagsMenu
        anchorEl={getAnchorEl()}
        selectedCountry={theCountry}
        onSelectCountry={() => {}}
      />
    )
  })

  test('should list all countries without filters props', () => {
    render(
      <FlagsMenu
        anchorEl={getAnchorEl()}
        selectedCountry={theCountry}
        onSelectCountry={() => {}}
      />
    )
    expect(screen.getAllByRole('option').length).toBe(COUNTRIES.length)
  })

  test('should fire onSelectCountry', () => {
    const callback = vi.fn((country: Country) => {
      return country
    })
    render(
      <FlagsMenu
        anchorEl={getAnchorEl()}
        selectedCountry={theCountry}
        onSelectCountry={callback}
      />
    )
    fireEvent.click(screen.getByText('France'))
    expect(callback).toBeCalledTimes(1)
    expect(callback).toHaveBeenLastCalledWith(theCountry)
  })

  test('should list onlyCountries', () => {
    render(
      <FlagsMenu
        onlyCountries={['FR']}
        anchorEl={getAnchorEl()}
        selectedCountry={theCountry}
        onSelectCountry={() => {}}
      />
    )
    const options = screen.getAllByRole('option')
    expect(options.length).toBe(1)
    expect(options[0].id).toBe('country-France')
  })

  test('should exclude countries', () => {
    render(
      <FlagsMenu
        excludeCountries={['FR']}
        anchorEl={getAnchorEl()}
        selectedCountry={theCountry}
        onSelectCountry={() => {}}
      />
    )
    expect(screen.queryByText('France')).toBeNull()
  })
})
