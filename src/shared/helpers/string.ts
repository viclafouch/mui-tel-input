export function removeOccurrence(text: string, part: string | RegExp): string {
  return text.replace(part, '')
}
