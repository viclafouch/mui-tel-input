import { renderHook } from '@testing-library/react-hooks'
import { vi } from 'vitest'

import { useMismatchProps } from '../useMissmatchProps'

describe('hooks/useMissmatchProps', () => {
  test('should log.error when default country is included in excludedCountries', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderHook(() => {
      return useMismatchProps({
        value: '',
        defaultCountry: 'FR',
        excludedCountries: ['FR']
      })
    })
    expect(consoleSpy).toHaveBeenCalledTimes(1)
  })

  test('should log.error when onlyCoutries AND excludedCountries include the same country', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderHook(() => {
      return useMismatchProps({
        value: '',
        onlyCountries: ['FR'],
        excludedCountries: ['FR']
      })
    })
    expect(consoleSpy).toHaveBeenCalledTimes(1)
  })

  test('should log.error when onlyCoutries AND excludedCountries include the same country', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderHook(() => {
      return useMismatchProps({
        value: '',
        defaultCountry: 'FR',
        onlyCountries: ['BE', 'VE']
      })
    })
    expect(consoleSpy).toHaveBeenCalledTimes(1)
  })

  test('should log.error when onlyCoutries AND excludedCountries include the same country', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderHook(() => {
      return useMismatchProps({
        value: '',
        defaultCountry: 'FR',
        continents: ['NA']
      })
    })
    expect(consoleSpy).toHaveBeenCalledTimes(1)
  })
})
