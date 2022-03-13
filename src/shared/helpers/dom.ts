export function putCursorAtEndOfInput(inputElement: HTMLInputElement) {
  inputElement.focus()
  const { length } = inputElement.value
  inputElement.setSelectionRange(length, length)
}
