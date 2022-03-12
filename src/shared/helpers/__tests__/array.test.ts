import { expect } from 'vitest'

import { matchIsArray } from '../array'

describe('helpers/array', () => {
  describe('matchIsArray', () => {
    it('should return a boolean', () => {
      expect(matchIsArray([2])).toBeTypeOf('boolean')
    })

    it('should return a true for an array', () => {
      expect(matchIsArray([2])).toBe(true)
    })

    test.each([
      { value: {} },
      { value: '' },
      { value: 1 },
      { value: null },
      { value: false },
      { value: undefined }
    ])('should return false for `$value`', ({ value }) => {
      expect(matchIsArray(value)).toBe(false)
    })
  })
})
