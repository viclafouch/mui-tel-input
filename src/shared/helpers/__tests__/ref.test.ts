import React from 'react'
import { expect, vi } from 'vitest'
import { assocRefToPropRef } from '@shared/helpers/ref'
import '@testing-library/jest-dom/vitest'

describe('helpers/ref', () => {
  describe('assocRefToPropRef', () => {
    it('should associate the ref to prop object ref', () => {
      const ref = 'Hello world'
      const propRef = React.createRef<string>()
      assocRefToPropRef(ref, propRef)
      expect(propRef.current).toBe('Hello world')
    })

    it('should associate the ref to prop function ref', () => {
      const ref = 'Hello world'
      const propRef = vi.fn((theRef: typeof ref) => {
        return theRef
      })
      assocRefToPropRef(ref, propRef)
      expect(propRef).toHaveBeenCalled()
      expect(propRef).toHaveReturnedWith(ref)
    })
  })
})
