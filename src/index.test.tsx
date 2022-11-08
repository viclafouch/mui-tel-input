import React from 'react'
import { vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MuiTelInput, MuiTelInputInfo, MuiTelInputProps } from './index'
import {
  closeFlagsMenu,
  expectButtonIsFlagOf,
  expectButtonNotIsFlagOf,
  getButtonElement,
  getInputElement,
  selectCountry,
  typeInInputElement
} from './testUtils'
import '@testing-library/jest-dom'

const MuiTelWrapper = (props: Partial<MuiTelInputProps>) => {
  const { onChange, ...rest } = props
  const [state, setState] = React.useState<string | undefined>(undefined)

  const handleChange = (newValue: string, info: MuiTelInputInfo) => {
    setState(newValue)
    onChange?.(newValue, info)
  }

  return <MuiTelInput value={state} onChange={handleChange} {...rest} />
}

describe('components/MuiTelInput', () => {
  test('should render correctly', () => {
    render(<MuiTelWrapper />)
  })

  describe('props/ref', () => {
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
  })

  describe('props/inputRef', () => {
    test('should assign or call inputRef prop', () => {
      // assign
      const ref = React.createRef<HTMLDivElement>()
      render(<MuiTelWrapper inputRef={ref} />)
      expect(ref.current).toBeTruthy()
      // call
      const refCallback = vi.fn(() => {})
      render(<MuiTelWrapper inputRef={refCallback} />)
      expect(refCallback).toHaveBeenCalled()
    })

    test('should assign or call InputProps.inputRef prop', () => {
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
  })

  describe('props/forceCallingCode', () => {
    test('should display calling code if forceCallingCode is true and has defaultCountry', async () => {
      render(<MuiTelWrapper defaultCountry="FR" forceCallingCode />)
      const inputElement = getInputElement()
      await userEvent.clear(inputElement)
      expect(inputElement.value).toBe('+33')
    })

    test('should display calling code if forceCallingCode is true and not defaultCountry but choose valid country', async () => {
      render(<MuiTelWrapper forceCallingCode />)
      const inputElement = getInputElement()
      await typeInInputElement('+33626922635')
      await userEvent.clear(inputElement)
      expect(inputElement.value).toBe('+33')
    })

    test('should display empty value if forceCallingCode is true and not defaultCountry and choose not valid country before', async () => {
      render(<MuiTelWrapper excludedCountries={['FR']} forceCallingCode />)
      const inputElement = getInputElement()
      await typeInInputElement('+33626922635')
      await userEvent.clear(inputElement)
      expect(inputElement.value).toBe('')
    })

    test('should display empty value if forceCallingCode is false and user clears input', async () => {
      render(<MuiTelWrapper defaultCountry="FR" forceCallingCode={false} />)
      const inputElement = getInputElement()
      await userEvent.clear(inputElement)
      expect(inputElement.value).toBe('')
    })
  })

  describe('prop/defaultCountry', () => {
    test('should displayed the calling code of the defaultCuntry prop', () => {
      render(<MuiTelWrapper defaultCountry="FR" />)
      const inputElement = getInputElement()
      expect(inputElement.value).toBe('+33')
    })

    test('should update the inputValue if the defaultCountry prop changes', () => {
      const { rerender } = render(<MuiTelWrapper defaultCountry="FR" />)
      expect(getInputElement().value).toBe('+33')
      rerender(<MuiTelWrapper defaultCountry="BE" />)
      expect(getInputElement().value).toBe('+32')
    })
  })

  describe('prop/disableDropdown', () => {
    test('should not displayed the button if disableDropdown is true', () => {
      render(<MuiTelWrapper disableDropdown />)
      const button = screen.queryByRole('button')
      expect(button).toBe(null)
    })
  })

  describe('prop/disableFormatting', () => {
    test('should not format initial value if disableFormatting is true', () => {
      render(<MuiTelWrapper disableFormatting value="+33626" />)
      expectButtonIsFlagOf('FR')
      expect(getInputElement().value).toBe('+33626')
    })

    test('should not format value if disableFormatting is true', async () => {
      const callbackOnChange = vi.fn(() => {})
      render(
        <MuiTelWrapper
          onChange={callbackOnChange}
          disableFormatting
          defaultCountry="FR"
        />
      )
      expectButtonIsFlagOf('FR')
      await typeInInputElement('626')
      expect(getInputElement().value).toBe('+33626')
      expect(callbackOnChange).toHaveBeenLastCalledWith('+33626', {
        countryCallingCode: '33',
        countryCode: 'FR',
        nationalNumber: '626',
        numberValue: '+33626',
        reason: 'input'
      })
    })
  })

  describe('prop/onDoubleClick', () => {
    test('should fire the onDoubleClick callback prop', () => {
      const callback = vi.fn(() => {})
      render(<MuiTelWrapper onDoubleClick={callback} />)
      const input = screen.getByRole('textbox')
      fireEvent.doubleClick(input)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('prop/onFocus', () => {
    test('should fire the onFocus callback prop', () => {
      const callback = vi.fn(() => {})
      render(<MuiTelWrapper onFocus={callback} />)
      const input = screen.getByRole('textbox')
      fireEvent.focus(input)
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('prop/onChange', () => {
    test('should call onChange callback when the defaultCountry prop changes', () => {
      const callbackOnChange = vi.fn(() => {})
      const { rerender } = render(
        <MuiTelWrapper defaultCountry="FR" onChange={callbackOnChange} />
      )
      rerender(
        <MuiTelWrapper defaultCountry="BE" onChange={callbackOnChange} />
      )
      expect(callbackOnChange).toHaveBeenCalledWith('+32', {
        countryCallingCode: '32',
        countryCode: 'BE',
        nationalNumber: '',
        numberValue: '+32',
        reason: 'country'
      })
    })

    test('should call the onChange callback when we select a different country', () => {
      const callbackOnChange = vi.fn(() => {})
      render(<MuiTelWrapper defaultCountry="FR" onChange={callbackOnChange} />)
      selectCountry('BE')
      expect(callbackOnChange).toHaveBeenCalledWith('+32', {
        countryCallingCode: '32',
        countryCode: 'BE',
        nationalNumber: '',
        numberValue: '+32',
        reason: 'country'
      })
    })

    test('should not call the onChange callback prop when we select the same country', () => {
      const callbackOnChange = vi.fn(() => {})
      render(<MuiTelWrapper defaultCountry="BE" onChange={callbackOnChange} />)
      selectCountry('BE')
      expect(callbackOnChange).not.toHaveBeenCalled()
    })

    test('should call the onChange callback prop when user type a number', async () => {
      const callbackOnChange = vi.fn(() => {})
      render(<MuiTelWrapper defaultCountry="BE" onChange={callbackOnChange} />)
      await typeInInputElement('626')
      expect(callbackOnChange).toHaveBeenCalledTimes(3)
    })

    test('should not call onChange on mount with a prop value', () => {
      const callbackOnChange = vi.fn(() => {})
      render(<MuiTelWrapper value="+328732" onChange={callbackOnChange} />)
      expect(callbackOnChange).not.toHaveBeenCalled()
    })

    test('should not call onChange if prop value has changed', () => {
      const callbackOnChange = vi.fn(() => {})
      const { rerender } = render(
        <MuiTelWrapper value="+328732" onChange={callbackOnChange} />
      )
      rerender(<MuiTelWrapper value="+328732767" onChange={callbackOnChange} />)
      expect(callbackOnChange).not.toHaveBeenCalled()
    })

    test('should get correct params from the onChange callback', async () => {
      const callbackOnChange = vi.fn(() => {})
      render(<MuiTelWrapper onChange={callbackOnChange} />)
      await typeInInputElement('+33626')
      expect(callbackOnChange).toHaveBeenLastCalledWith('+33 6 26', {
        countryCallingCode: '33',
        countryCode: 'FR',
        nationalNumber: '626',
        numberValue: '+33626',
        reason: 'input'
      })
    })
  })

  describe('prop/focusOnSelectCountry', () => {
    test('should auto focus when focusOnSelectCountry is true and select country', () => {
      render(<MuiTelWrapper focusOnSelectCountry />)
      selectCountry('FR')
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(getInputElement())
    })
  })

  describe('prop/disabled', () => {
    test('should button and input be disabled when disabled props is true', () => {
      render(<MuiTelWrapper disabled />)
      expect(getInputElement()).toBeDisabled()
      expect(getButtonElement()).toBeDisabled()
    })
  })

  describe('prop/excludedCountries', () => {
    test('should not displayed excluded countries in the flags list', () => {
      render(<MuiTelWrapper excludedCountries={['FR', 'BE']} />)
      fireEvent.click(getButtonElement())
      expect(screen.getAllByRole('option').length).toBeGreaterThan(0)
      expect(screen.queryByTestId('option-FR')).toBeFalsy()
      expect(screen.queryByTestId('option-BE')).toBeFalsy()
    })

    test('should not display excluded country flag and not format the value', async () => {
      render(<MuiTelWrapper excludedCountries={['FR']} />)
      await typeInInputElement('+33 6 26')
      expect(getInputElement().value).toBe('+33626')
      expectButtonNotIsFlagOf('FR')
    })
  })

  describe('prop/onlyCountries', () => {
    test('should not accept FR value if is not an only country', async () => {
      render(<MuiTelWrapper onlyCountries={['BE']} />)
      await typeInInputElement('+33 6 26')
      expect(getInputElement().value).toBe('+33626')
      expectButtonNotIsFlagOf('FR')
    })

    test('should only displayed only countries', () => {
      render(<MuiTelWrapper onlyCountries={['FR', 'BE', 'GB']} />)
      fireEvent.click(getButtonElement())
      expect(screen.getByTestId('option-FR')).toBeTruthy()
      expect(screen.getByTestId('option-BE')).toBeTruthy()
      expect(screen.getByTestId('option-GB')).toBeTruthy()
      expect(screen.getAllByRole('option').length).toBe(3)
    })
  })

  describe('prop/continents', () => {
    test('should only displayed the correct countries of the country', () => {
      render(<MuiTelWrapper continents={['EU']} />)
      fireEvent.click(getButtonElement())
      expect(screen.getAllByRole('option').length).toBe(53)
    })

    test('should not accept FR number when continents not include EU', async () => {
      render(<MuiTelWrapper continents={['SA']} />)
      await typeInInputElement('+33 6 26')
      expectButtonNotIsFlagOf('FR')
      expect(getInputElement().value).toBe('+33626')
    })
  })

  describe('prop/value', () => {
    test('should work if value is undefined', () => {
      const { rerender } = render(<MuiTelWrapper value={undefined} />)
      rerender(<MuiTelWrapper value="+32" />)
      expect(getInputElement().value).toBe('+32')
      expectButtonIsFlagOf('BE')
    })

    test('should show value even if the phone number is invalid', () => {
      render(<MuiTelWrapper defaultCountry="US" value="+132323232322323" />)
      expectButtonIsFlagOf('US')
      expect(getInputElement().value).toBe('+1 32323232322323')
    })

    test('should display the calling code when the value prop become empty', () => {
      const { rerender } = render(
        <MuiTelWrapper defaultCountry="BE" value="+328732" />
      )
      rerender(<MuiTelWrapper defaultCountry="BE" value="" />)
      expect(getInputElement().value).toBe('+32')
      expectButtonIsFlagOf('BE')
    })

    test('should change the input value if value prop has been updated', () => {
      const { rerender } = render(
        <MuiTelWrapper defaultCountry="BE" value="+328732" />
      )
      expect(getInputElement().value).toBe('+32 87 32')
      rerender(<MuiTelWrapper defaultCountry="BE" value="+328732767" />)
      expect(getInputElement().value).toBe('+32 87 32 76 7')
    })

    test('should change the country if prop value has changed with new country', () => {
      const { rerender } = render(
        <MuiTelWrapper defaultCountry="BE" value="+328732" />
      )
      rerender(<MuiTelWrapper defaultCountry="BE" value="+338732" />)
      expect(getInputElement().value).toBe('+33 873 2')
      expectButtonIsFlagOf('FR')
    })
  })

  describe('Flags Menu', () => {
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
  })

  test('should display in correct format FR number', async () => {
    render(<MuiTelWrapper defaultCountry="FR" />)
    const { result } = await typeInInputElement('626922631')
    expect(result).toBe('+33 6 26 92 26 31')
  })

  test('should display the new calling of the new selected country flag, keeping original number', async () => {
    render(<MuiTelWrapper disableFormatting />)
    await typeInInputElement('+33626922631')
    expectButtonIsFlagOf('FR')
    selectCountry('BE')
    expect(getInputElement().value).toBe('+32626922631')
    expectButtonIsFlagOf('BE')
  })

  test('should change flag if we change the calling code', async () => {
    render(<MuiTelWrapper defaultCountry="FR" />)
    await userEvent.clear(getInputElement())
    const { result } = await typeInInputElement('32')
    expect(result).toBe('+32')
    expectButtonIsFlagOf('BE')
  })

  test('should select the value of the input when double click on it', () => {
    render(<MuiTelWrapper defaultCountry="FR" />)
    const inputElement = getInputElement()
    fireEvent.doubleClick(inputElement)
    expect(inputElement.selectionStart).toBe(0)
    expect(inputElement.selectionEnd).toBe(3)
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

  test('should not have calling code if splitting it', () => {
    render(
      <MuiTelWrapper
        defaultCountry="ES"
        splitCallingCode
        disableFormatting
        value="+34555123456"
      />
    )
    expect(getInputElement().value).toBe('555123456')
    expectButtonIsFlagOf('ES')
  })

  test('should not allow inputting a calling code if splitting it', async () => {
    render(
      <MuiTelWrapper splitCallingCode disableFormatting defaultCountry="ES" />
    )
    await typeInInputElement('+33555123456')
    expect(getInputElement().value).toBe('33555123456')
    expectButtonIsFlagOf('ES')
  })

  test('should give calling code in onchange info even when splitting it', async () => {
    const callbackOnChange = vi.fn(() => {})
    render(
      <MuiTelWrapper
        splitCallingCode
        defaultCountry="ES"
        onChange={callbackOnChange}
      />
    )
    await typeInInputElement('555123456')
    expect(callbackOnChange).toHaveBeenCalledWith('555 12 34 56', {
      countryCallingCode: '34',
      countryCode: 'ES',
      nationalNumber: '555123456',
      numberValue: '+34555123456',
      reason: 'input'
    })
  })

  /** Copy doesn't work in user-event@beta */
  // test('should fire the onCopy prop', async () => {
  //   const user = userEvent.setup({
  //     writeToClipboard: true
  //   })
  //   const callback = vi.fn(() => {})
  //   render(<MuiTelWrapper onCopy={callback} />)
  //   const input = screen.getByRole('textbox')
  //   fireEvent.doubleClick(input)
  //   await user.copy()
  //   expect(callback).toHaveBeenCalledTimes(1)
  // })
})
