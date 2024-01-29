import React from 'react'
import { InputBaseProps } from '@mui/material'
import { Styled } from './ExtensionField.styled'

export type ExtensionFieldProps = InputBaseProps

const ExtensionField = React.forwardRef(
  (props: ExtensionFieldProps, propRef) => {
    return (
      <Styled.ExtensionFieldSplitted
        placeholder="ext."
        type="tel"
        {...props}
        inputRef={propRef}
      />
    )
  }
)

export default ExtensionField
