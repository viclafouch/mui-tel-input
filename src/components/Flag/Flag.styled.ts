import { styled } from '@mui/material/styles'
import spritFlags32 from '@assets/flags.png'
import { FLAG_POSITIONS } from '@shared/constants/flag-positions'
import { Iso3166Alpha2Code } from '@shared/constants/iso'

type FlagProps = {
  isoCode: Iso3166Alpha2Code
}

const Styled = {
  Flag: styled('div', {
    shouldForwardProp: (prop) => {
      return prop !== 'isoCode'
    }
  })<FlagProps>((props) => {
    return {
      backgroundImage: `url(${spritFlags32})`,
      backgroundSize: '100%',
      backgroundRepeat: 'no-repeat',
      width: '28px',
      height: '19px',
      display: 'inline-block',
      backgroundPosition: `0 ${FLAG_POSITIONS[props.isoCode]}`,
      verticalAlign: 'text-top'
    }
  })
}

export { Styled }
