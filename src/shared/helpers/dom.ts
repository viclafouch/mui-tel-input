export function putCursorAtEnd(inputElement: HTMLInputElement) {
  inputElement.focus()
  const { length } = inputElement.value
  inputElement.setSelectionRange(length, length)
}
