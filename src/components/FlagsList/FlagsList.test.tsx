import React from 'react'
import { ISO_CODES, MuiTelInputCountry } from '@shared/constants/countries'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, vi } from 'vitest'

import FlagsList from './FlagsList'

import '@testing-library/jest-dom'

describe('components/FlagsList', () => {
  test('should render correctly', () => {
    render(
      <FlagsList
        excludedCountries={['FR']}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
  })

  test('should list all countries without filters props', () => {
    render(<FlagsList isoCode="FR" onSelectCountry={() => {}} />)
    expect(screen.getAllByRole('option').length).toBe(ISO_CODES.length)
  })

  test('should fire onSelectCountry', () => {
    const callback = vi.fn((country: MuiTelInputCountry) => {
      return country
    })
    render(<FlagsList isoCode="FR" onSelectCountry={callback} />)
    fireEvent.click(screen.getByText('France'))
    expect(callback).toBeCalledTimes(1)
    expect(callback).toHaveBeenLastCalledWith('FR')
  })

  test('should list onlyCountries', () => {
    render(
      <FlagsList
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
      <FlagsList
        excludedCountries={['FR']}
        isoCode="FR"
        onSelectCountry={() => {}}
      />
    )
    expect(screen.queryByText('France')).toBeNull()
  })

  test('should display EU countries except FR', () => {
    render(
      <FlagsList
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
      <FlagsList
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
      <FlagsList
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
      <FlagsList
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
