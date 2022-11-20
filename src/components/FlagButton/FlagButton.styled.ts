import { grey } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const Styled = {
  CallingCodeSplitted: styled(Typography)({
    borderRight: `1px solid ${grey[300]}`,
    paddingRight: 10,
    cursor: 'default',
    pointerEvents: 'none'
  })
}

export { Styled }
