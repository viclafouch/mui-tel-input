export function putCursorAtEndOfInput(inputElement: HTMLInputElement) {
  const { length } = inputElement.value
  inputElement.setSelectionRange(length, length)
}
