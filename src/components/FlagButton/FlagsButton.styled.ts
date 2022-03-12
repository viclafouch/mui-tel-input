import { styled } from '@mui/material/styles'
import flags from '@assets/flags.png'

const Styled = {
  Flag: styled('div')({
    backgroundImage: `url(${flags})`,
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    width: '32px',
    height: '21px',
    lineHeight: '32px',
    display: 'inline-block',
    backgroundPosition: '0 29.752066%',
    verticalAlign: 'text-top'
  })
}

export { Styled }
