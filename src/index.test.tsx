import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  closeFlagsMenu,
  expectButtonIsFlagOf,
  getInputElement,
  selectCountry,
  typeInInputElement
} from 'testUtils'
import { vi } from 'vitest'

import MuiPhoneNumber from './index'

import '@testing-library/jest-dom'

describe('components/MuiPhoneNumber', () => {
  test('should render correctly', () => {
    render(<MuiPhoneNumber />)
  })

  describe('props component', () => {
    test('should displayed the correct default calling code', () => {
      render(<MuiPhoneNumber defaultCountry="FR" />)
      const inputElement = getInputElement()
      expect(inputElement.value).toBe('+33')
    })

    test('should update if the prop changes', () => {
      const { rerender } = render(<MuiPhoneNumber defaultCountry="FR" />)
      const inputElement = getInputElement()
      expect(inputElement.value).toBe('+33')
      rerender(<MuiPhoneNumber defaultCountry="BE" />)
      expect(inputElement.value).toBe('+32')
    })

    test('should assign ref object', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<MuiPhoneNumber ref={ref} />)
      expect(ref.current).toBeTruthy()
    })

    test('should call ref function', () => {
      const ref = vi.fn(() => {})
      render(<MuiPhoneNumber ref={ref} />)
      expect(ref).toHaveBeenCalled()
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
      const inputElement = getInputElement()
      await userEvent.clear(inputElement)
      expect(inputElement.value).toBe('+33')
    })

    test('should display "+" if isoCodeEditable is true and user clears input', async () => {
      render(<MuiPhoneNumber defaultCountry="FR" isIsoCodeEditable />)
      const inputElement = getInputElement()
      await userEvent.clear(inputElement)
      expect(inputElement.value).toBe('+')
      expectButtonIsFlagOf('FR')
    })

    test('should call onChange when select a different country', () => {
      const callbackOnChange = vi.fn(() => {})
      render(
        <MuiPhoneNumber
          defaultCountry="FR"
          onChange={callbackOnChange}
          isIsoCodeEditable
        />
      )
      selectCountry('BE')
      expect(callbackOnChange).toHaveBeenCalledWith(
        {
          formattedInt: 32,
          value: '+32',
          country: {
            name: 'Belgium',
            isoCode: 'BE',
            callingCode: 32,
            format: '+.. . .. .. .. ..',
            regions: ['europe', 'european-union']
          }
        },
        'country'
      )
    })
  })

  test('should not call onChange when select the same country', () => {
    const callbackOnChange = vi.fn(() => {})
    render(
      <MuiPhoneNumber
        defaultCountry="BE"
        onChange={callbackOnChange}
        isIsoCodeEditable
      />
    )
    selectCountry('BE')
    expect(callbackOnChange).not.toHaveBeenCalled()
  })

  test('should not call onChange on mount with a prop value', () => {
    const callbackOnChange = vi.fn(() => {})
    render(
      <MuiPhoneNumber
        defaultCountry="BE"
        value="+328732"
        onChange={callbackOnChange}
        isIsoCodeEditable
      />
    )
    expect(callbackOnChange).not.toHaveBeenCalled()
  })

  test('should not call onChange if prop value has changed', () => {
    const callbackOnChange = vi.fn(() => {})
    const { rerender } = render(
      <MuiPhoneNumber
        defaultCountry="BE"
        value="+328732"
        onChange={callbackOnChange}
        isIsoCodeEditable
      />
    )
    rerender(
      <MuiPhoneNumber
        defaultCountry="BE"
        value="+328732767"
        onChange={callbackOnChange}
        isIsoCodeEditable
      />
    )
    expect(callbackOnChange).not.toHaveBeenCalled()
  })

  test('should call onChange when user type a number', async () => {
    const callbackOnChange = vi.fn(() => {})
    render(
      <MuiPhoneNumber
        defaultCountry="BE"
        onChange={callbackOnChange}
        isIsoCodeEditable
      />
    )
    await typeInInputElement('626')
    expect(callbackOnChange).toHaveBeenCalledTimes(3)
  })

  test('should call onChange when user type a number', async () => {
    const callbackOnChange = vi.fn(() => {})
    render(
      <MuiPhoneNumber
        defaultCountry="BE"
        onChange={callbackOnChange}
        isIsoCodeEditable
      />
    )
    await typeInInputElement('626')
    expect(callbackOnChange).toHaveBeenLastCalledWith(
      {
        formattedInt: 32626,
        value: '+32 6 26',
        country: {
          name: 'Belgium',
          isoCode: 'BE',
          callingCode: 32,
          format: '+.. . .. .. .. ..',
          regions: ['europe', 'european-union']
        }
      },
      'input'
    )
  })

  test('should change the input value if value prop has changed', () => {
    const { rerender } = render(
      <MuiPhoneNumber defaultCountry="BE" value="+328732" isIsoCodeEditable />
    )
    const inputElement = getInputElement()
    expect(inputElement.value).toBe('+32 8 73 2')
    rerender(
      <MuiPhoneNumber
        defaultCountry="BE"
        value="+328732767"
        isIsoCodeEditable
      />
    )
    expect(inputElement.value).toBe('+32 8 73 27 67')
  })

  test('should reset the input value with defaultCountry if prop value became empty', () => {
    const { rerender } = render(
      <MuiPhoneNumber defaultCountry="BE" value="+328732" isIsoCodeEditable />
    )
    selectCountry('FR')
    rerender(<MuiPhoneNumber defaultCountry="BE" value="" isIsoCodeEditable />)
    expect(getInputElement().value).toBe('+32')
    expectButtonIsFlagOf('BE')
  })

  test('should not change the value if the defaultCountry change', () => {
    const { rerender } = render(
      <MuiPhoneNumber defaultCountry="BE" value="+328732" isIsoCodeEditable />
    )
    rerender(
      <MuiPhoneNumber defaultCountry="FR" value="+328732" isIsoCodeEditable />
    )
    expect(getInputElement().value).toBe('+32 8 73 2')
    expectButtonIsFlagOf('BE')
  })

  test('should change the country if prop value has changed with new country', () => {
    const { rerender } = render(
      <MuiPhoneNumber defaultCountry="BE" value="+328732" isIsoCodeEditable />
    )
    rerender(
      <MuiPhoneNumber defaultCountry="BE" value="+338732" isIsoCodeEditable />
    )
    expectButtonIsFlagOf('FR')
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
    const { result } = await typeInInputElement('626922631')
    expect(result).toBe('+33 626 92 26 31')
  })

  test('should reset value when country changes', async () => {
    render(<MuiPhoneNumber defaultCountry="FR" />)
    await typeInInputElement('626922631')
    selectCountry('BE')
    expect(getInputElement().value).toBe('+32')
    expectButtonIsFlagOf('BE')
  })

  test('should select all input on double click', () => {
    render(<MuiPhoneNumber />)
    const inputElement = getInputElement()
    fireEvent.doubleClick(inputElement)
    expect(inputElement.selectionStart).toBe(0)
    expect(inputElement.selectionEnd).toBe(3)
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
    const inputElement = getInputElement()
    await userEvent.clear(inputElement)
    const { result } = await typeInInputElement('32')
    expect(result).toBe('+32')
    expectButtonIsFlagOf('BE')
  })

  test('should reset value to calling code if the prop value become empty', async () => {
    const { rerender } = render(
      <MuiPhoneNumber defaultCountry="BE" value="+328732" isIsoCodeEditable />
    )
    const inputElement = getInputElement()
    await userEvent.clear(inputElement)
    rerender(<MuiPhoneNumber defaultCountry="BE" value="" isIsoCodeEditable />)
    expect(getInputElement().value).toBe('+32')
    expectButtonIsFlagOf('BE')
  })

  test('should reset value to calling code if the prop value become empty AND the defaultCountry change', async () => {
    const { rerender } = render(
      <MuiPhoneNumber defaultCountry="BE" value="+328732" isIsoCodeEditable />
    )
    const inputElement = getInputElement()
    await userEvent.clear(inputElement)
    rerender(<MuiPhoneNumber defaultCountry="FR" value="" isIsoCodeEditable />)
    expect(getInputElement().value).toBe('+33')
    expectButtonIsFlagOf('FR')
  })

  test('should display console error if component become controlled => uncontrolled', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { rerender } = render(
      <MuiPhoneNumber defaultCountry="BE" value="+328732" isIsoCodeEditable />
    )
    rerender(
      <MuiPhoneNumber defaultCountry="FR" value={undefined} isIsoCodeEditable />
    )
    expect(consoleSpy).toHaveBeenCalled()
  })

  test('should display console error if component become uncontrolled => controlled', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { rerender } = render(
      <MuiPhoneNumber defaultCountry="FR" value={undefined} isIsoCodeEditable />
    )
    rerender(
      <MuiPhoneNumber defaultCountry="BE" value="+328732" isIsoCodeEditable />
    )
    expect(consoleSpy).toHaveBeenCalled()
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
