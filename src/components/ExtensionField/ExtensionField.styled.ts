import { InputBase } from '@mui/material'
import { grey } from '@mui/material/colors'
import { styled } from '@mui/material/styles'

const Styled = {
  ExtensionFieldSplitted: styled(InputBase)({
    borderLeft: `1px solid ${grey[300]}`,
    paddingLeft: 10
  })
}

export { Styled }
