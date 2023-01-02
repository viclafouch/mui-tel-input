import { styled } from '@mui/material/styles'

const Styled = {
  Flag: styled('span')(() => {
    return {
      display: 'flex',
      alignItems: 'center'
    }
  }),
  Picture: styled('picture')(() => {
    return {
      display: 'flex',
      alignItems: 'center'
    }
  }),
  Span: styled('span')(() => {
    return {
      width: '1px',
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(100%)',
      height: '1px',
      overflow: 'hidden',
      position: 'absolute',
      whiteSpace: 'nowrap'
    }
  })
}

export { Styled }
