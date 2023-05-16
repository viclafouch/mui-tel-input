import { autocompleteClasses } from '@mui/material/Autocomplete'
import InputBase from '@mui/material/InputBase'
import Popper from '@mui/material/Popper'
import { styled } from '@mui/material/styles'

const Styled = {
  AutocompletePopper: styled('div')(({ theme }) => {
    return {
      [`& .${autocompleteClasses.paper}`]: {
        boxShadow: 'none',
        margin: 0,
        color: 'inherit'
      },
      [`& .${autocompleteClasses.listbox}`]: {
        backgroundColor: '#fff',
        padding: 0,
        [`& .${autocompleteClasses.option}`]: {
          minHeight: 'auto',
          alignItems: 'flex-start',
          padding: 8,
          borderBottom: `1px solid #eaecef`,
          '&[aria-selected="true"]': {
            backgroundColor: 'transparent'
          },
          [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]:
            {
              backgroundColor: theme.palette.action.hover
            }
        }
      },
      [`&.${autocompleteClasses.popperDisablePortal}`]: {
        position: 'relative'
      }
    }
  }),
  FlagsAutocompletePopper: styled(Popper)(({ theme }) => {
    return {
      border: '1px solid #e1e4e8',
      boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)',
      borderRadius: 6,
      width: 300,
      zIndex: theme.zIndex.modal,
      color: '#24292e',
      backgroundColor: '#fff'
    }
  }),
  Input: styled(InputBase)(() => {
    return {
      padding: 10,
      width: '100%',
      borderBottom: '1px solid #eaecef',
      '& input': {
        borderRadius: 4,
        backgroundColor: '#fff',
        padding: 8,
        border: '1px solid #eaecef',
        '&:focus': {
          boxShadow: '0px 0px 0px 3px rgba(3, 102, 214, 0.3)',
          borderColor: '#0366d6'
        }
      }
    }
  })
}

export { Styled }
