import React from 'react'
import { expect, vi } from 'vitest'
import { ISO_CODES, MuiTelInputCountry } from '@shared/constants/countries'
import { getDefaultFlagElement } from '@shared/helpers/flag'
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
        anchorEl={getAnchorEl()}
        isoCode="FR"
        getFlagElement={getDefaultFlagElement}
        onSelectCountry={() => {}}
      />
    )
  })

  test('should render correctly', () => {
    render(
      <FlagsMenu
        isoCode="FR"
        getFlagElement={getDefaultFlagElement}
        excludedCountries={['FR']}
        onSelectCountry={() => {}}
      />
    )
  })

  test('should list all countries without filters props', () => {
    render(
      <FlagsMenu
        anchorEl={getAnchorEl()}
        getFlagElement={getDefaultFlagElement}
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
        anchorEl={getAnchorEl()}
        getFlagElement={getDefaultFlagElement}
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
        anchorEl={getAnchorEl()}
        getFlagElement={getDefaultFlagElement}
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
        anchorEl={getAnchorEl()}
        getFlagElement={getDefaultFlagElement}
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
        anchorEl={getAnchorEl()}
        excludedCountries={['FR']}
        getFlagElement={getDefaultFlagElement}
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
        anchorEl={getAnchorEl()}
        onlyCountries={['VE']}
        getFlagElement={getDefaultFlagElement}
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
        anchorEl={getAnchorEl()}
        preferredCountries={['FR', 'BE', 'VE']}
        getFlagElement={getDefaultFlagElement}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    const options = screen.getAllByRole('option')
    const imgs = screen.getAllByRole('img')

    expect(options[0]).toContainElement(imgs[0])
    expect(imgs[0]).toHaveAttribute('alt', 'France')
    expect(options[1]).toContainElement(imgs[1])
    expect(imgs[1]).toHaveAttribute('alt', 'Belgium')
    expect(options[2]).toContainElement(imgs[2])
    expect(imgs[2]).toHaveAttribute('alt', 'Venezuela')
  })

  test('should highlight preferred countries not excluded', () => {
    render(
      <FlagsMenu
        anchorEl={getAnchorEl()}
        preferredCountries={['FR', 'BE', 'VE']}
        getFlagElement={getDefaultFlagElement}
        excludedCountries={['FR']}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    const options = screen.getAllByRole('option')
    const imgs = screen.getAllByRole('img')

    expect(options[0]).toContainElement(imgs[0])
    expect(imgs[0]).toHaveAttribute('alt', 'Belgium')
    expect(options[1]).toContainElement(imgs[1])
    expect(imgs[1]).toHaveAttribute('alt', 'Venezuela')
  })
})
