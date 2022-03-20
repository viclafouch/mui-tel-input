import { styled } from '@mui/material/styles'

const Styled = {
  Flag: styled('span')(() => {
    return {
      display: 'inline-block',
      backgroundSize: 'cover',
      '--CountryFlagIcon-height': '0.8em',
      height: 'var(--CountryFlagIcon-height)',
      width: 'calc(var(--CountryFlagIcon-height)*3/2)'
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
