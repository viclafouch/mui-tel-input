import React from 'react'
import { expect, vi } from 'vitest'
import { ISO_CODES, MuiTelInputCountry } from '@shared/constants/countries'
import { getDisplayNames } from '@shared/helpers/intl'
import { fireEvent, render, screen } from '@testing-library/react'
import FlagsMenu from './FlagsMenu'
import '@testing-library/jest-dom'

function getAnchorEl() {
  return screen.getByText('My textfield')
}

describe('components/FlagsMenu', () => {
  beforeAll(() => {
    document.body.innerHTML = `<div>My textfield</div>`
  })

  test('should displayed when anchorEl is valid', () => {
    render(
      <FlagsMenu
        displayNames={getDisplayNames()}
        anchorEl={getAnchorEl()}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
  })

  test('should render correctly', () => {
    render(
      <FlagsMenu
        displayNames={getDisplayNames()}
        isoCode="FR"
        excludedCountries={['FR']}
        onSelectCountry={() => {}}
      />
    )
  })

  test('should list all countries without filters props', () => {
    render(
      <FlagsMenu
        displayNames={getDisplayNames()}
        anchorEl={getAnchorEl()}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    expect(screen.getAllByRole('option').length).toBe(ISO_CODES.length)
  })

  test('should fire onSelectCountry', () => {
    const callback = vi.fn((country: MuiTelInputCountry) => {
      return country
    })
    render(
      <FlagsMenu
        displayNames={getDisplayNames()}
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
        displayNames={getDisplayNames()}
        anchorEl={getAnchorEl()}
        onlyCountries={['FR']}
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
        displayNames={getDisplayNames()}
        anchorEl={getAnchorEl()}
        excludedCountries={['FR']}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    expect(screen.queryByText('France')).toBeNull()
  })

  test('should display EU countries except FR', () => {
    render(
      <FlagsMenu
        displayNames={getDisplayNames()}
        anchorEl={getAnchorEl()}
        excludedCountries={['FR']}
        continents={['EU']}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    expect(screen.queryByText('France')).toBeNull()
    expect(screen.queryByText('Venezuela')).toBeNull()
    expect(screen.getByText('Belgium')).toBeTruthy()
  })

  test('should display onlyCountries and not continents', () => {
    render(
      <FlagsMenu
        displayNames={getDisplayNames()}
        anchorEl={getAnchorEl()}
        onlyCountries={['VE']}
        continents={['EU']}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    expect(screen.getByText('Venezuela')).toBeTruthy()
    expect(screen.getAllByRole('option').length).toBe(1)
  })

  test('should highlight preferred countries and in good order', () => {
    render(
      <FlagsMenu
        displayNames={getDisplayNames()}
        anchorEl={getAnchorEl()}
        preferredCountries={['FR', 'BE', 'VE']}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveTextContent('FR')
    expect(options[1]).toHaveTextContent('BE')
    expect(options[2]).toHaveTextContent('VE')
  })

  test('should highlight preferred countries not excluded', () => {
    render(
      <FlagsMenu
        displayNames={getDisplayNames()}
        anchorEl={getAnchorEl()}
        preferredCountries={['FR', 'BE', 'VE']}
        excludedCountries={['FR']}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveTextContent('BE')
    expect(options[1]).toHaveTextContent('VE')
  })
})
