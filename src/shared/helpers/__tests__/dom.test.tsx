import React from 'react'
import { expect } from 'vitest'
import { putCursorAtEndOfInput } from '@shared/helpers/dom'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

describe('helpers/dom', () => {
  describe('putCursorAtEndOfInput', () => {
    it('should have the correct selectionStart', () => {
      render(<input defaultValue="Hello" />)
      const element: HTMLInputElement = screen.getByRole('textbox')
      element.focus()
      element.setSelectionRange(0, 0)
      putCursorAtEndOfInput(element)
      expect(element.selectionStart).toBe(5)
    })
  })
})
