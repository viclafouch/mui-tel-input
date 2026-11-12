import React from 'react'

const MAX_HISTORY_ENTRIES = 100

type History = {
  entries: string[]
  index: number
}

type UseInputHistoryParams = {
  initialValue: string
  inputRef: React.RefObject<HTMLInputElement | null>
  onRestore: (value: string) => void
}

type HistoryStep = -1 | 1

const UNDO_STEP = -1
const REDO_STEP = 1

function getHistoryStepFromInputType(inputType: string): HistoryStep | null {
  switch (inputType) {
    case 'historyUndo':
      return UNDO_STEP
    case 'historyRedo':
      return REDO_STEP
    default:
      return null
  }
}

function getHistoryStepFromShortcut(event: KeyboardEvent): HistoryStep | null {
  const isModifierPressed = event.ctrlKey || event.metaKey

  if (!isModifierPressed || event.altKey) {
    return null
  }

  const key = event.key.toLowerCase()

  if (key === 'z') {
    return event.shiftKey ? REDO_STEP : UNDO_STEP
  }

  if (key === 'y' && event.ctrlKey && !event.shiftKey) {
    return REDO_STEP
  }

  return null
}

// The browser's native undo stack goes out of sync as soon as the value is
// reformatted programmatically (e.g. undoing a paste can duplicate the number),
// so native history is cancelled and replaced by our own. Shortcuts are caught
// on keydown because browsers only fire `historyRedo` when their own redo stack
// is not empty, which never happens once native undo is cancelled.
export function useInputHistory({
  initialValue,
  inputRef,
  onRestore
}: UseInputHistoryParams) {
  const historyRef = React.useRef<History>({
    entries: [initialValue],
    index: 0
  })

  const recordValue = (value: string) => {
    const { entries, index } = historyRef.current

    if (entries[index] === value) {
      return
    }

    const nextEntries = [...entries.slice(0, index + 1), value].slice(
      -MAX_HISTORY_ENTRIES
    )

    historyRef.current = {
      entries: nextEntries,
      index: nextEntries.length - 1
    }
  }

  const resetHistory = (value: string) => {
    historyRef.current = { entries: [value], index: 0 }
  }

  const moveInHistory = (step: HistoryStep) => {
    const { entries, index } = historyRef.current
    const nextIndex = index + step
    const nextValue = entries[nextIndex]

    if (nextValue === undefined) {
      return
    }

    historyRef.current = { entries, index: nextIndex }
    onRestore(nextValue)
  }

  const handleHistoryStep = (event: Event, step: HistoryStep | null) => {
    if (step === null) {
      return
    }

    event.preventDefault()
    moveInHistory(step)
  }

  const handleBeforeInput = (event: InputEvent) => {
    handleHistoryStep(event, getHistoryStepFromInputType(event.inputType))
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    handleHistoryStep(event, getHistoryStepFromShortcut(event))
  }

  React.useEffect(() => {
    const inputElement = inputRef.current
    inputElement?.addEventListener('beforeinput', handleBeforeInput)
    inputElement?.addEventListener('keydown', handleKeyDown)

    return () => {
      inputElement?.removeEventListener('beforeinput', handleBeforeInput)
      inputElement?.removeEventListener('keydown', handleKeyDown)
    }
  })

  return {
    recordValue,
    resetHistory
  }
}
