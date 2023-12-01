import React from 'react'
import { getDefaultFlagElement, getDefaultImgProps } from '@shared/helpers/flag'
import { render } from '@testing-library/react'
import Flag from './Flag'
import '@testing-library/jest-dom'

describe('components/Flag', () => {
  test('should render correctly', () => {
    render(
      <Flag isoCode="FR">
        {getDefaultFlagElement('FR', {
          countryName: 'France',
          isSelected: true,
          imgProps: getDefaultImgProps({ isoCode: 'FR', countryName: 'France' })
        })}
      </Flag>
    )
  })

  test('should render children', () => {
    const screen = render(<Flag isoCode="FR">test</Flag>)
    expect(screen.container).toHaveTextContent('test')
  })
})
