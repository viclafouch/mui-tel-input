export const isValidExtension = (input: string): boolean => {
  const digitsAndDashRegEx = /^[0-9-]*$/

  return digitsAndDashRegEx.test(input)
}

export const removeExtension = (phoneNum: string) => {
  const num = phoneNum?.split('extension')?.[0]?.trimEnd() ?? ''

  return num
}

export const appendExtension = (phoneNum: string, extension: string) => {
  return `${phoneNum} extension ${extension}`
}
