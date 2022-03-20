import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  closeFlagsMenu,
  expectButtonIsFlagOf,
  getButtonElement,
  getInputElement,
  selectCountry,
  typeInInputElement
} from 'testUtils'
import { vi } from 'vitest'

import MuiTelInput, { MuiTelInputProps } from './index'

import '@testing-library/jest-dom'

const MuiTelWrapper = (props: Partial<MuiTelInputProps>) => {
  const { onChange, ...rest } = props
  const [state, setState] = React.useState<string>('')

  const handleChange = (newValue: string) => {
    setState(newValue)
    onChange?.(newValue)
  }

  return <MuiTelInput value={state} onChange={handleChange} {...rest} />
}

describe('components/MuiTelInput', () => {
  test('should render correctly', () => {
    render(<MuiTelWrapper />)
  })

  describe('props component', () => {
    test('should displayed the correct default calling code', () => {
      render(<MuiTelWrapper defaultCountry="FR" />)
      const inputElement = getInputElement()
      expect(inputElement.value).toBe('+33')
    })

    test('should not displayed the button if disableDropdown is true', () => {
      render(<MuiTelWrapper disableDropdown defaultCountry="FR" />)
      const button = screen.queryByRole('button')
      expect(button).toBe(null)
    })

    test('should update if the defaultCountry prop changes', () => {
      const { rerender } = render(<MuiTelWrapper defaultCountry="FR" />)
      expect(getInputElement().value).toBe('+33')
      rerender(<MuiTelWrapper defaultCountry="BE" />)
      expect(getInputElement().value).toBe('+32')
    })

    test('should assign ref object', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<MuiTelInput value="" ref={ref} />)
      expect(ref.current).toBeTruthy()
    })

    test('should call ref function', () => {
      const ref = vi.fn(() => {})
      render(<MuiTelInput value="" ref={ref} />)
      expect(ref).toHaveBeenCalled()
    })

    test('should assign inputRef', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<MuiTelWrapper inputRef={ref} />)
      expect(ref.current).toBeTruthy()
    })

    test('should assign or call InputProps.inputRef', () => {
      // assign
      const ref = React.createRef<HTMLDivElement>()
      const InputProps = { inputRef: ref }
      render(<MuiTelWrapper InputProps={InputProps} />)
      expect(InputProps.inputRef.current).toBeTruthy()
      // call
      const refCallback = vi.fn(() => {})
      render(<MuiTelWrapper InputProps={{ inputRef: refCallback }} />)
      expect(refCallback).toHaveBeenCalled()
    })

    test('should fire the onDoubleClick prop', () => {
      const callback = vi.fn(() => {})
      render(<MuiTelWrapper onDoubleClick={callback} />)
      const input = screen.getByRole('textbox')
      fireEvent.doubleClick(input)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should fire the onFocus prop', () => {
      const callback = vi.fn(() => {})
      render(<MuiTelWrapper onFocus={callback} />)
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    test('should display calling code if forceCallingCode is true', async () => {
      render(<MuiTelWrapper defaultCountry="FR" forceCallingCode />)
      const inputElement = getInputElement()
      await userEvent.clear(inputElement)
      expect(inputElement.value).toBe('+33')
    })

    test('should display "+" if forceCallingCode is false and user clears input', async () => {
      render(<MuiTelWrapper defaultCountry="FR" forceCallingCode={false} />)
      const inputElement = getInputElement()
      await userEvent.clear(inputElement)
      expect(inputElement.value).toBe('+')
    })

    test('should call onChange when the default country changes without selecting another', () => {
      const callbackOnChange = vi.fn(() => {})
      const { rerender } = render(
        <MuiTelWrapper defaultCountry="FR" onChange={callbackOnChange} />
      )
      rerender(
        <MuiTelWrapper defaultCountry="BE" onChange={callbackOnChange} />
      )
      expect(callbackOnChange).toHaveBeenCalledWith('+32')
    })

    test('should call onChange when select a different country', () => {
      const callbackOnChange = vi.fn(() => {})
      render(<MuiTelWrapper defaultCountry="FR" onChange={callbackOnChange} />)
      selectCountry('BE')
      expect(callbackOnChange).toHaveBeenCalledWith('+32')
    })

    test('should auto focus when focusOnSelectCountry is true and select country', () => {
      render(<MuiTelWrapper defaultCountry="BE" focusOnSelectCountry />)
      selectCountry('FR')
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(getInputElement())
    })

    test('should be disabled when disabled props is true', () => {
      render(<MuiTelWrapper disabled />)
      expect(getInputElement()).toBeDisabled()
      expect(getButtonElement()).toBeDisabled()
    })
  })

  test('should not call onChange when select the same country', () => {
    const callbackOnChange = vi.fn(() => {})
    render(<MuiTelWrapper defaultCountry="BE" onChange={callbackOnChange} />)
    selectCountry('BE')
    expect(callbackOnChange).not.toHaveBeenCalled()
  })

  test('should not call onChange on mount with a prop value', () => {
    const callbackOnChange = vi.fn(() => {})
    render(
      <MuiTelWrapper
        defaultCountry="BE"
        value="+328732"
        onChange={callbackOnChange}
      />
    )
    expect(callbackOnChange).not.toHaveBeenCalled()
  })

  test('should not call onChange if prop value has changed', () => {
    const callbackOnChange = vi.fn(() => {})
    const { rerender } = render(
      <MuiTelWrapper
        defaultCountry="BE"
        value="+328732"
        onChange={callbackOnChange}
      />
    )
    rerender(
      <MuiTelWrapper
        defaultCountry="BE"
        value="+328732767"
        onChange={callbackOnChange}
      />
    )
    expect(callbackOnChange).not.toHaveBeenCalled()
  })

  test('should call onChange when user type a number', async () => {
    const callbackOnChange = vi.fn(() => {})
    render(<MuiTelWrapper defaultCountry="BE" onChange={callbackOnChange} />)
    await typeInInputElement('626')
    expect(callbackOnChange).toHaveBeenCalledTimes(3)
  })

  test('should get correct params from onChange callback', async () => {
    const callbackOnChange = vi.fn(() => {})
    render(<MuiTelWrapper defaultCountry="BE" onChange={callbackOnChange} />)
    await typeInInputElement('626')
    expect(callbackOnChange).toHaveBeenLastCalledWith('+32 62 6')
  })

  test('should change the input value if value prop has changed', () => {
    const { rerender } = render(
      <MuiTelWrapper defaultCountry="BE" value="+328732" />
    )
    const inputElement = getInputElement()
    expect(inputElement.value).toBe('+32 87 32')
    rerender(<MuiTelWrapper defaultCountry="BE" value="+328732767" />)
    expect(inputElement.value).toBe('+32 87 32 76 7')
  })

  test('should reset the input value with defaultCountry if prop value became empty', () => {
    const { rerender } = render(
      <MuiTelWrapper defaultCountry="BE" value="+328732" />
    )
    selectCountry('FR')
    rerender(<MuiTelWrapper defaultCountry="BE" value="" />)
    expect(getInputElement().value).toBe('+32')
    expectButtonIsFlagOf('BE')
  })

  test('should change the country if prop value has changed with new country', () => {
    const { rerender } = render(
      <MuiTelWrapper defaultCountry="BE" value="+328732" />
    )
    rerender(<MuiTelWrapper defaultCountry="BE" value="+338732" />)
    expectButtonIsFlagOf('FR')
  })

  test('should open flags on button clicked', () => {
    render(<MuiTelWrapper />)
    fireEvent.click(getButtonElement())
    expect(screen.getByRole('listbox')).toBeTruthy()
  })

  test('should close flags on country selected', () => {
    render(<MuiTelWrapper />)
    selectCountry('FR')
    expect(screen.queryByRole('listbox')).toBeFalsy()
  })

  test('should display in correct format FR number', async () => {
    render(<MuiTelWrapper defaultCountry="FR" />)
    const { result } = await typeInInputElement('626922631')
    expect(result).toBe('+33 6 26 92 26 31')
  })

  test('should reset value when country changes', async () => {
    render(<MuiTelWrapper defaultCountry="FR" />)
    await typeInInputElement('626922631')
    selectCountry('BE')
    expect(getInputElement().value).toBe('+32')
    expectButtonIsFlagOf('BE')
  })

  test('should select all input on double click', () => {
    render(<MuiTelWrapper defaultCountry="FR" />)
    const inputElement = getInputElement()
    fireEvent.doubleClick(inputElement)
    expect(inputElement.selectionStart).toBe(0)
    expect(inputElement.selectionEnd).toBe(3)
  })

  test('should open flags menu', () => {
    render(<MuiTelWrapper />)
    expect(screen.queryByRole('presentation')).toBeFalsy()
    fireEvent.click(getButtonElement())
    expect(screen.getByRole('presentation')).toBeTruthy()
  })

  test('should close flags menu', async () => {
    render(<MuiTelWrapper />)
    fireEvent.click(getButtonElement())
    expect(screen.getByRole('presentation')).toBeTruthy()
    await closeFlagsMenu()
    expect(screen.queryByRole('presentation')).toBeFalsy()
  })

  test('should change flag if forceCallingCode is false and user changes calling code', async () => {
    render(<MuiTelWrapper defaultCountry="FR" />)
    const inputElement = getInputElement()
    await userEvent.clear(inputElement)
    const { result } = await typeInInputElement('32')
    expect(result).toBe('+32')
    expectButtonIsFlagOf('BE')
  })

  test('should reset value to calling code if the prop value become empty', async () => {
    const { rerender } = render(
      <MuiTelWrapper defaultCountry="BE" value="+328732" />
    )
    const inputElement = getInputElement()
    await userEvent.clear(inputElement)
    rerender(<MuiTelWrapper defaultCountry="BE" value="" />)
    expect(getInputElement().value).toBe('+32')
    expectButtonIsFlagOf('BE')
  })

  test('should reset value to calling code if the prop value become empty AND the defaultCountry change', async () => {
    const { rerender } = render(
      <MuiTelWrapper defaultCountry="BE" value="+328732" />
    )
    const inputElement = getInputElement()
    await userEvent.clear(inputElement)
    rerender(<MuiTelWrapper defaultCountry="FR" value="" />)
    expect(getInputElement().value).toBe('+33')
    expectButtonIsFlagOf('FR')
  })

  /** Copy doesn't work in user-event@beta */
  // test('should fire the onCopy prop', async () => {
  //   const user = userEvent.setup({
  //     writeToClipboard: true
  //   })
  //   const callback = vi.fn(() => {})
  //   render(<MuiTelWrapper onCopy={callback} />)
  //   const input = screen.getByRole('textbox')
  //   fireEvent.focus(input)
  //   await user.click(input)
  //   const toto = await user.copy()
  //   expect(callback).toHaveBeenCalledTimes(1)
  // })
  // test.todo('should copy phone numbers in the correct format')
})
