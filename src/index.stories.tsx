import React from 'react'
import { ISO_3166_ALPHA_2_MAPPINGS } from '@shared/constants/iso'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import MuiPhoneNumber from './index'

export default {
  title: 'MuiPhoneNumber',
  component: MuiPhoneNumber,
  argTypes: {
    defaultCountry: {
      options: Object.keys(ISO_3166_ALPHA_2_MAPPINGS),
      control: { type: 'select' }
    },
    isIsoCodeEditable: {
      options: [true, false],
      control: { type: 'boolean' }
    },
    excludeCountries: {
      options: Object.keys(ISO_3166_ALPHA_2_MAPPINGS),
      control: { type: 'object' }
    },
    onlyCountries: {
      options: Object.keys(ISO_3166_ALPHA_2_MAPPINGS),
      control: { type: 'object' }
    }
  }
} as ComponentMeta<typeof MuiPhoneNumber>

export const Primary: ComponentStory<typeof MuiPhoneNumber> = (args) => {
  return <MuiPhoneNumber {...args} />
}
