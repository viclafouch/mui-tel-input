import { expect } from 'vitest'
import type { MuiTelInputCountry } from '@shared/constants/countries'
import { DEFAULT_LANG } from '@shared/constants/lang'
import { filterCountries, sortAlphabeticallyCountryCodes } from '../country'
import { getDisplayNames } from '../intl'

const COUNTRIES: readonly MuiTelInputCountry[] = ['BE', 'FR', 'US', 'VE']
const COUNTRIES_DISPLAY_NAME = getDisplayNames(DEFAULT_LANG)

describe('helpers/country', () => {
  describe('filterCountries', () => {
    it('should return an array', () => {
      expect(
        filterCountries(COUNTRIES, COUNTRIES_DISPLAY_NAME, {})
      ).toBeInstanceOf(Array)
    })
    it('should return the exact same array when no filters options', () => {
      expect(
        filterCountries(COUNTRIES, COUNTRIES_DISPLAY_NAME, {})
      ).toStrictEqual(COUNTRIES)
    })

    it('should return the exact same array when filters options are empty', () => {
      expect(
        filterCountries(COUNTRIES, COUNTRIES_DISPLAY_NAME, {
          onlyCountries: [],
          excludedCountries: []
        })
      ).toStrictEqual(COUNTRIES)
    })

    it('should remove FR when exclude FR', () => {
      expect(
        filterCountries(COUNTRIES, COUNTRIES_DISPLAY_NAME, {
          excludedCountries: ['FR']
        })
      ).toEqual(['BE', 'US', 'VE'])
    })
    it('should only contain FR when only FR', () => {
      expect(
        filterCountries(COUNTRIES, COUNTRIES_DISPLAY_NAME, {
          onlyCountries: ['FR']
        })
      ).toEqual(['FR'])
    })

    it('should only contain BE when onlyCountries is BE and even exclude BE', () => {
      expect(
        filterCountries(COUNTRIES, COUNTRIES_DISPLAY_NAME, {
          onlyCountries: ['BE'],
          excludedCountries: ['BE']
        })
      ).toEqual(['BE'])
    })

    it('should only contain EU and SA countries', () => {
      expect(
        filterCountries(COUNTRIES, COUNTRIES_DISPLAY_NAME, {
          continents: ['EU', 'SA']
        }).length
      ).toBe(67)
    })

    it('should only contain EU and SA countries except excluded countries', () => {
      expect(
        filterCountries(COUNTRIES, COUNTRIES_DISPLAY_NAME, {
          continents: ['EU', 'SA'],
          excludedCountries: ['BE', 'FR', 'VE']
        }).length
      ).toBe(64)
    })

    it('should only contain onlyCountries even with continents filled', () => {
      expect(
        filterCountries(COUNTRIES, COUNTRIES_DISPLAY_NAME, {
          continents: ['EU', 'SA'],
          onlyCountries: ['BE', 'FR', 'VE']
        })
      ).toEqual(['BE', 'FR', 'VE'])
    })
  })

  describe('sortAlphabeticallyCountryCodes', () => {
    it('should sort alphabetically', () => {
      const countries = ['FR', 'BE', 'CA'] as MuiTelInputCountry[]
      const displayNames = new Intl.DisplayNames('fr', {
        type: 'region'
      })
      // Belgique / Canada / France
      expect(
        sortAlphabeticallyCountryCodes(countries, displayNames)
      ).toStrictEqual(['BE', 'CA', 'FR'])
    })
  })
})
