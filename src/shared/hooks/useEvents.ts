import { putCursorAtEndOfInput } from '@shared/helpers/dom'
import { TextFieldProps } from '@mui/material'

type Options = Pick<TextFieldProps, 'onDoubleClick' | 'onCopy' | 'onFocus'> & {
  inputRef: React.MutableRefObject<HTMLInputElement | null>
}

export function useEvents({
  onDoubleClick,
  onCopy,
  onFocus,
  inputRef
}: Options) {
  const handleDoubleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const inputElement = inputRef.current as HTMLInputElement
    inputElement.setSelectionRange(0, inputElement.value.length)
    onDoubleClick?.(event)
  }

  const handleCopy = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (onCopy) {
      onCopy(event)

      return
    }

    const currentSelection = window.getSelection()

    if (currentSelection) {
      const valueWithoutSpaces = currentSelection.toString().replaceAll(' ', '')
      event.clipboardData.setData('text/plain', valueWithoutSpaces)
      event.preventDefault()
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    if (inputRef.current) {
      putCursorAtEndOfInput(inputRef.current)
    }

    onFocus?.(event)
  }

  return {
    handleDoubleClick,
    handleCopy,
    handleFocus
  }
}
