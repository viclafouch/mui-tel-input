/* eslint-disable import/no-extraneous-dependencies */
import { Iso3166Alpha2Code } from '@shared/constants/countries'
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export function getInputElement(): HTMLInputElement {
  return screen.getByRole('textbox')
}

export function getButtonElement(): HTMLButtonElement {
  return screen.getByRole('button')
}

export function expectButtonIsFlagOf(isoCode: Iso3166Alpha2Code) {
  expect(getButtonElement()).toHaveTextContent(isoCode)
}

export async function typeInInputElement(
  value: string
): Promise<{ result: string }> {
  const inputElement = getInputElement()
  await userEvent.type(inputElement, value, { delay: 1 })
  return { result: inputElement.value }
}

export function selectCountry(isoCode: Iso3166Alpha2Code): void {
  fireEvent.click(getButtonElement())
  fireEvent.click(screen.getByTestId(`option-${isoCode}`))
}

export async function closeFlagsMenu(): Promise<void> {
  // eslint-disable-next-line testing-library/no-node-access
  const backdrop = document.querySelector('.MuiBackdrop-root')
  if (backdrop) {
    fireEvent.click(backdrop)
    await waitForElementToBeRemoved(backdrop)
  }
}
