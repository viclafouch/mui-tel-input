import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import MuiPhoneNumber from './index'

import '@testing-library/jest-dom'

describe('components/MuiPhoneNumber', () => {
  test('should render correctly', () => {
    render(<MuiPhoneNumber />)
  })

  describe('props component', () => {
    describe('props/defaultCountry', () => {
      test('should displayed the correct default calling code', () => {
        render(<MuiPhoneNumber defaultCountry="FR" />)
        const input: HTMLInputElement = screen.getByRole('textbox')
        expect(input.value).toBe('+33')
      })

      test('should update if the prop changes', () => {
        const { rerender } = render(<MuiPhoneNumber defaultCountry="FR" />)
        const input: HTMLInputElement = screen.getByRole('textbox')
        expect(input.value).toBe('+33')
        rerender(<MuiPhoneNumber defaultCountry="BE" />)
        expect(input.value).toBe('+32')
      })
    })

    describe('props/ref', () => {
      test('should assign ref object', () => {
        const ref = React.createRef<HTMLDivElement>()
        render(<MuiPhoneNumber ref={ref} />)
        expect(ref.current).toBeTruthy()
      })

      test('should call ref function', () => {
        const ref = vi.fn(() => {})
        render(<MuiPhoneNumber ref={ref} />)
        expect(ref).toHaveBeenCalledTimes(1)
      })
    })
  })

  test('should open flags on button clicked', () => {
    render(<MuiPhoneNumber />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  test('should close flags on country selected', () => {
    render(<MuiPhoneNumber />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    const options = screen.getAllByRole('option')
    fireEvent.click(options[0])
    expect(screen.queryByRole('listbox')).toBeFalsy()
  })

  test('should display in correct format FR number', async () => {
    render(<MuiPhoneNumber defaultCountry="FR" />)
    const input: HTMLInputElement = screen.getByRole('textbox')
    await userEvent.type(input, '626922631', { delay: 1 })
    expect(input.value).toBe('+33 626 92 26 31')
  })

  test('should reset value when country changes', async () => {
    render(<MuiPhoneNumber defaultCountry="FR" />)
    const input: HTMLInputElement = screen.getByRole('textbox')
    await userEvent.type(input, '626922631', { delay: 1 })
    const button = screen.getByRole('button')
    fireEvent.click(button)
    const belgiumOption = screen.getAllByRole('option').find((option) => {
      return option.id === 'country-Belgium'
    }) as HTMLElement
    fireEvent.click(belgiumOption)
    expect(input.value).toBe('+32')
  })
})
