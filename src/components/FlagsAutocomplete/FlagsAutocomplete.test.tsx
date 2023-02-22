import React from 'react'
import { expect, vi } from 'vitest'
import { ISO_CODES, MuiTelInputCountry } from '@shared/constants/countries'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlagsAutocomplete from './FlagsAutocomplete'
import '@testing-library/jest-dom'

function getAnchorEl() {
  return screen.getByText('My textfield')
}

describe('components/FlagsAutocomplete', () => {
  beforeAll(() => {
    document.body.innerHTML = `<div>My textfield</div>`
  })

  test('should be displayed when anchorEl is valid', () => {
    render(
      <FlagsAutocomplete
        anchorEl={getAnchorEl()}
        isoCode="FR"
        onSelectCountry={() => {}}
        onClose={() => {}}
      />
    )
  })

  test('should render correctly', () => {
    render(
      <FlagsAutocomplete
        isoCode="FR"
        excludedCountries={['FR']}
        onSelectCountry={() => {}}
        onClose={() => {}}
        anchorEl={null}
      />
    )
  })

  test('should list all countries without filters props', () => {
    render(
      <FlagsAutocomplete
        anchorEl={getAnchorEl()}
        isoCode="FR"
        onSelectCountry={() => {}}
        onClose={() => {}}
      />
    )
    expect(screen.getAllByRole('option').length).toBe(ISO_CODES.length)
  })

  test('should fire onSelectCountry', () => {
    const callback = vi.fn((country: MuiTelInputCountry) => {
      return country
    })

    render(
      <FlagsAutocomplete
        anchorEl={getAnchorEl()}
        isoCode="FR"
        onSelectCountry={callback}
        onClose={() => {}}
      />
    )
    fireEvent.click(screen.getByText('France'))
    expect(callback).toBeCalledTimes(1)
  })

  test('should exclude countries', () => {
    render(
      <FlagsAutocomplete
        anchorEl={getAnchorEl()}
        isoCode="FR"
        excludedCountries={['FR']}
        onSelectCountry={() => {}}
        onClose={() => {}}
      />
    )
    expect(screen.queryByText('France')).toBeNull()
  })

  test('should display EU countries except FR', () => {
    render(
      <FlagsAutocomplete
        anchorEl={getAnchorEl()}
        excludedCountries={['FR']}
        continents={['EU']}
        isoCode="FR"
        onSelectCountry={() => {}}
        onClose={() => {}}
      />
    )

    expect(screen.queryByText('France')).toBeNull()
    expect(screen.queryByText('Venezuela')).toBeNull()
    expect(screen.getByText('Belgium')).toBeTruthy()
  })

  test('should display onlyCountries and not continents', () => {
    render(
      <FlagsAutocomplete
        anchorEl={getAnchorEl()}
        onlyCountries={['VE']}
        continents={['EU']}
        isoCode="FR"
        onSelectCountry={() => {}}
        onClose={() => {}}
      />
    )

    expect(screen.getByText('Venezuela')).toBeTruthy()
    expect(screen.getAllByRole('option').length).toBe(1)
  })

  test('should highlight preferred countries and in good order', () => {
    render(
      <FlagsAutocomplete
        anchorEl={getAnchorEl()}
        preferredCountries={['FR', 'BE', 'VE']}
        isoCode="FR"
        onSelectCountry={() => {}}
        onClose={() => {}}
      />
    )

    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveTextContent('FR')
    expect(options[1]).toHaveTextContent('BE')
    expect(options[2]).toHaveTextContent('VE')
  })

  test('should highlight preferred countries not excluded', () => {
    render(
      <FlagsAutocomplete
        anchorEl={getAnchorEl()}
        preferredCountries={['FR', 'BE', 'VE']}
        excludedCountries={['FR']}
        isoCode="FR"
        onSelectCountry={() => {}}
        onClose={() => {}}
      />
    )

    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveTextContent('BE')
    expect(options[1]).toHaveTextContent('VE')
  })

  test('should filter options based input value', async () => {
    render(
      <FlagsAutocomplete
        anchorEl={getAnchorEl()}
        onlyCountries={['FR', 'BE', 'VE']}
        isoCode="FR"
        onSelectCountry={() => {}}
        onClose={() => {}}
      />
    )

    const autocompleteInput = screen.getByTestId('autocomplete-input')

    await userEvent.type(autocompleteInput, 'bel', { delay: 1 })

    await waitFor(() => {
      expect(autocompleteInput).toHaveValue('bel')
    })

    const options = screen.getAllByRole('option')
    expect(options.length).toBe(1)
    expect(options[0]).toHaveTextContent('BE')
  })
})
