import React from 'react'
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import MuiPhoneNumber from './index'

import '@testing-library/jest-dom'

async function closeFlagsMenu(): Promise<void> {
  // eslint-disable-next-line testing-library/no-node-access
  const backdrop = document.querySelector('.MuiBackdrop-root')
  if (backdrop) {
    fireEvent.click(backdrop)
    await waitForElementToBeRemoved(backdrop)
  }
}

describe('components/MuiPhoneNumber', () => {
  test('should render correctly', () => {
    render(<MuiPhoneNumber />)
  })

  describe('props component', () => {
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
    test('should fire the onDoubleClick prop', () => {
      const callback = vi.fn(() => {})
      render(<MuiPhoneNumber onDoubleClick={callback} />)
      const input = screen.getByRole('textbox')
      fireEvent.doubleClick(input)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should fire the onFocus prop', () => {
      const callback = vi.fn(() => {})
      render(<MuiPhoneNumber onFocus={callback} />)
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should assign inputRef', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<MuiPhoneNumber inputRef={ref} />)
      expect(ref.current).toBeTruthy()
    })

    test('should assign InputProps.ref', () => {
      const ref = React.createRef<HTMLDivElement>()
      const InputProps = { inputRef: ref }
      render(<MuiPhoneNumber InputProps={InputProps} />)
      expect(InputProps.inputRef.current).toBeTruthy()
    })

    test('should display calling code if isIsoCodeEditable is false', async () => {
      render(<MuiPhoneNumber defaultCountry="FR" isIsoCodeEditable={false} />)
      const input: HTMLInputElement = screen.getByRole('textbox')
      await userEvent.type(
        input,
        '{backspace}{backspace}{backspace}{backspace}'
      )
      expect(input.value).toBe('+33')
    })

    test('should display "+" if isoCodeEditable is true and user clears input', async () => {
      render(<MuiPhoneNumber defaultCountry="FR" isIsoCodeEditable />)
      const input: HTMLInputElement = screen.getByRole('textbox')
      await userEvent.clear(input)
      expect(input.value).toBe('+')
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

  test('should select all input on double click', () => {
    render(<MuiPhoneNumber />)
    const input: HTMLInputElement = screen.getByRole('textbox')
    fireEvent.doubleClick(input)
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(3)
  })

  test('should open flags menu', () => {
    render(<MuiPhoneNumber />)
    expect(screen.queryByRole('presentation')).toBeFalsy()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('presentation')).toBeTruthy()
  })

  test('should close flags menu', async () => {
    render(<MuiPhoneNumber />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('presentation')).toBeTruthy()
    await closeFlagsMenu()
    expect(screen.queryByRole('presentation')).toBeFalsy()
  })

  test('should change flag if isoCodeEditable is true and user changes calling code', async () => {
    render(<MuiPhoneNumber defaultCountry="FR" isIsoCodeEditable />)
    const input: HTMLInputElement = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, '32')
    expect(input.value).toBe('+32')
    expect(screen.queryByTestId('FR')).toBeFalsy()
    expect(screen.getByTestId('BE')).toBeTruthy()
  })

  /** Copy doesn't work in user-event@beta */
  // test('should fire the onCopy prop', async () => {
  //   const user = userEvent.setup({
  //     writeToClipboard: true
  //   })
  //   const callback = vi.fn(() => {})
  //   render(<MuiPhoneNumber onCopy={callback} />)
  //   const input = screen.getByRole('textbox')
  //   fireEvent.focus(input)
  //   await user.click(input)
  //   const toto = await user.copy()
  //   console.log(toto)
  //   expect(callback).toHaveBeenCalledTimes(1)
  // })
  // test.todo('should copy phone numbers in the correct format')
})
