import { expect } from 'vitest'
import { removeOccurrence } from '../string'
import '@testing-library/jest-dom'

describe('helpers/string', () => {
  describe('removeOccurrence', () => {
    it('should remove the exact occurence', () => {
      const text1 = 'Hello world'
      const occurence = 'world'
      expect(removeOccurrence(text1, occurence)).not.toContain(occurence)
    })
  })
})
