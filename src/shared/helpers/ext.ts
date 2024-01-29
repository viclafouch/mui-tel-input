export const isValidExtension = (input: string): boolean => {
  const digitsAndDashRegEx = /^[0-9-]*$/

  return !digitsAndDashRegEx.test(input)
}
