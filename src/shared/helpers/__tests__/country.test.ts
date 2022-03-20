import { Iso3166Alpha2Code } from '@shared/constants/countries'
import { expect } from 'vitest'

import { filterCountries } from '../country'

const COUNTRIES: readonly Iso3166Alpha2Code[] = ['FR', 'BE', 'US']

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
      ).toEqual(['BE', 'US'])
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
  })
})
