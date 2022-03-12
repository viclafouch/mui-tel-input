import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import MuiPhoneNumber from './index'

export default {
  title: 'MuiPhoneNumber',
  component: MuiPhoneNumber
} as ComponentMeta<typeof MuiPhoneNumber>

export const Primary: ComponentStory<typeof MuiPhoneNumber> = () => {
  return <MuiPhoneNumber />
}
