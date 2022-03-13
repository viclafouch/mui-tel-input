import React from 'react'
import { COUNTRIES, Country } from '@shared/constants/countries'
import { getCountryByIsoCode } from '@shared/helpers/country'
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
    render(
      <FlagsMenu
        selectedCountry={getCountryByIsoCode('FR')}
        onSelectCountry={() => {}}
      />
    )
  })

  test('should displayed when anchorEl is valid', () => {
    render(
      <FlagsMenu
        anchorEl={getAnchorEl()}
        selectedCountry={getCountryByIsoCode('FR')}
        onSelectCountry={() => {}}
      />
    )
  })

  test('should list all countries without filters props', () => {
    render(
      <FlagsMenu
        anchorEl={getAnchorEl()}
        selectedCountry={getCountryByIsoCode('FR')}
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
        selectedCountry={getCountryByIsoCode('FR')}
        onSelectCountry={callback}
      />
    )
    fireEvent.click(screen.getByText('France'))
    expect(callback).toBeCalledTimes(1)
    expect(callback).toHaveBeenLastCalledWith(getCountryByIsoCode('FR'))
  })

  test('should list onlyCountries', () => {
    render(
      <FlagsMenu
        onlyCountries={['FR']}
        anchorEl={getAnchorEl()}
        selectedCountry={getCountryByIsoCode('FR')}
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
        selectedCountry={getCountryByIsoCode('FR')}
        onSelectCountry={() => {}}
      />
    )
    expect(screen.queryByText('France')).toBeNull()
  })
})
