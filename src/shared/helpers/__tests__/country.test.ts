import { Iso3166Alpha2Code } from '@shared/constants/countries'
import { expect } from 'vitest'

import { filterCountries } from '../country'

const COUNTRIES: readonly Iso3166Alpha2Code[] = ['FR', 'BE', 'US', 'VE']

describe('helpers/country', () => {
  describe('filterCountries', () => {
    it('should return an array', () => {
      expect(filterCountries(COUNTRIES, {})).toBeInstanceOf(Array)
    })
    it('should return the exact same array when no filters options', () => {
      expect(filterCountries(COUNTRIES, {})).toBe(COUNTRIES)
    })

    it('should return the exact same array when filters options are empty', () => {
      expect(
        filterCountries(COUNTRIES, {
          onlyCountries: [],
          excludeCountries: []
        })
      ).toBe(COUNTRIES)
    })

    it('should remove FR when exclude FR', () => {
      expect(
        filterCountries(COUNTRIES, {
          excludeCountries: ['FR']
        })
      ).toEqual(['BE', 'US', 'VE'])
    })
    it('should only contain FR when only FR', () => {
      expect(
        filterCountries(COUNTRIES, {
          onlyCountries: ['FR']
        })
      ).toEqual(['FR'])
    })

    it('should only contain BE when onlyCountries is BE and even exclude BE', () => {
      expect(
        filterCountries(COUNTRIES, {
          onlyCountries: ['BE'],
          excludeCountries: ['BE']
        })
      ).toEqual(['BE'])
    })

    it('should only contain EU and SA countries', () => {
      expect(
        filterCountries(COUNTRIES, {
          continents: ['EU', 'SA']
        }).length
      ).toBe(67)
    })

    it('should only contain EU and SA countries except excluded countries', () => {
      expect(
        filterCountries(COUNTRIES, {
          continents: ['EU', 'SA'],
          excludeCountries: ['BE', 'FR', 'VE']
        }).length
      ).toBe(64)
    })

    it('should only contain onlyCountries even with continents filled', () => {
      expect(
        filterCountries(COUNTRIES, {
          continents: ['EU', 'SA'],
          onlyCountries: ['BE', 'FR', 'VE']
        })
      ).toEqual(['FR', 'BE', 'VE'])
    })
  })
})
