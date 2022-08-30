---
sidebar_position: 5
---

# CSS

Like any component, if you want to override a component's styles using custom classes, you can use the `className` prop.

```jsx
<MuiTelInput className="my-class-name" />
```

Then, you can use the differents global class names (see below) to target an element of `MuiTelInput`.

| 	Global class                            | Description                                                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `.MuiTelInput-TextField`                        | 	Styles applied to the root element.                                                                                                                   |
| `.MuiTelInput-IconButton`                        | 	Styles applied to the [IconButton](https://mui.com/material-ui/api/icon-button/) of the current flag.                                                                                                                   |
| `.MuiTelInput-Flag`                        | 	Styles applied to a flag.                                                                                                                   |
| `.MuiTelInput-Menu`                        | 	Styles applied to [Menu](https://mui.com/material-ui/api/menu/) component.                                                                                                                   |
| `.MuiTelInput-MenuItem`                        | 	Styles applied to a flag item of the [Menu](https://mui.com/material-ui/api/menu/).                                                                                                                   |
| `.MuiTelInput-ListItemIcon-flag`                        | 	Styles applied to the [ListItemIcon](https://mui.com/material-ui/api/list-item-icon/) of a flag item                                                                                                                   |
| `.MuiTelInput-ListItemText-country`                        | 	Styles applied to the [ListItemText](https://mui.com/material-ui/api/list-item-text/) of a flag item                                                                                                                   |
| `.MuiTelInput-Typography-calling-code`                        | 	Styles applied to the calling code of a flag item                                                                                                                  |

For example: target the `.MuiTelInput-Flag` global class name to customize the current selected flag.

## Example with styled-component / emotion

```jsx
import { styled } from 'styled-component' // or emotion
import { MuiTelInput } from 'mui-tel-input'

const MuiTelInputStyled = styled(MuiTelInput)`
  & input {
    color: red;
  }
`

function MyComponent() {
  return <MuiTelInputStyled />
}
```