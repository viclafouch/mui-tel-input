import { autocompleteClasses } from '@mui/material/Autocomplete'
import InputBase from '@mui/material/InputBase'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popper from '@mui/material/Popper'
import { styled } from '@mui/material/styles'

const Styled = {
  ListItemIcon: styled(ListItemIcon)({
    marginRight: '10px'
  }),
  ListItemText: styled(ListItemText)({
    marginRight: '10px'
  }),
  AutocompletePopper: styled('div')(({ theme }) => {
    return {
      [`& .${autocompleteClasses.paper}`]: {
        boxShadow: 'none',
        margin: 0,
        color: 'inherit',
        fontSize: 13
      },
      [`& .${autocompleteClasses.listbox}`]: {
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128',
        padding: 0,
        [`& .${autocompleteClasses.option}`]: {
          minHeight: 'auto',
          alignItems: 'flex-start',
          padding: 8,
          borderBottom: `1px solid  ${
            theme.palette.mode === 'light' ? ' #eaecef' : '#30363d'
          }`,
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
  Popper: styled(Popper)(({ theme }) => {
    return {
      border: `1px solid ${
        theme.palette.mode === 'light' ? '#e1e4e8' : '#30363d'
      }`,
      boxShadow: `0 8px 24px ${
        theme.palette.mode === 'light'
          ? 'rgba(149, 157, 165, 0.2)'
          : 'rgb(1, 4, 9)'
      }`,
      borderRadius: 6,
      width: 300,
      zIndex: theme.zIndex.modal,
      fontSize: 13,
      color: theme.palette.mode === 'light' ? '#24292e' : '#c9d1d9',
      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#1c2128'
    }
  }),
  Input: styled(InputBase)(({ theme }) => {
    return {
      padding: 10,
      width: '100%',
      borderBottom: `1px solid ${
        theme.palette.mode === 'light' ? '#eaecef' : '#30363d'
      }`,
      '& input': {
        borderRadius: 4,
        backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#0d1117',
        padding: 8,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        border: `1px solid ${
          theme.palette.mode === 'light' ? '#eaecef' : '#30363d'
        }`,
        fontSize: 14,
        '&:focus': {
          boxShadow: `0px 0px 0px 3px ${
            theme.palette.mode === 'light'
              ? 'rgba(3, 102, 214, 0.3)'
              : 'rgb(12, 45, 107)'
          }`,
          borderColor: theme.palette.mode === 'light' ? '#0366d6' : '#388bfd'
        }
      }
    }
  })
}

export { Styled }
