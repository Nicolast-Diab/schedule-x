import { CalendarEventInternal } from '@schedule-x/shared/src/interfaces/calendar/calendar-event.interface'
import { dateFromDateTime } from '@schedule-x/shared/src/utils/stateless/time/format-conversion/string-to-string'

// TODO: need to renaming this function as it's no longer sorted exclusively on startDate
// TODO: rename the file too and maybe move sortEventsForMonthGrid in a new file
// TODO: should we accept negative values as sortIndex? Current implementation does support it, but it might be confusing
export const sortEventsByStartAndEnd = (
  a: CalendarEventInternal,
  b: CalendarEventInternal
) => {
  const aIndex = a._options?.sortIndex ?? 0
  const bIndex = b._options?.sortIndex ?? 0

  if (aIndex < bIndex) return -1
  if (aIndex > bIndex) return 1

  if (a.start === b.start) {
    if (a.end < b.end) return 1
    if (a.end > b.end) return -1
    return 0
  }

  if (a.start < b.start) return -1
  if (a.start > b.start) return 1
  return 0
}

export const sortEventsForMonthGrid = (
  a: CalendarEventInternal,
  b: CalendarEventInternal
) => {
  const aStartDate = dateFromDateTime(a.start)
  const bStartDate = dateFromDateTime(b.start)
  const aEndDate = dateFromDateTime(a.end)
  const bEndDate = dateFromDateTime(b.end)
  const aIndex = a._options?.sortIndex ?? 0
  const bIndex = b._options?.sortIndex ?? 0

  if (aIndex < bIndex) return -1
  if (aIndex > bIndex) return 1
  /**
   * For events that start and end at the same day, sort them by their start time.
   * If they only start on the same day but end on different days, the function needs to move on;
   * an event that starts on 5am today, but ends in 5 days, needs to be placed before an event that starts
   * today at 1am and ends later today. That way we avoid empty gaps in the grid.
   * */
  if (aStartDate === bStartDate && aEndDate === bEndDate) {
    if (a.start < b.start) return -1
  }

  if (aStartDate === bStartDate) {
    if (aEndDate < bEndDate) return 1
    if (aEndDate > bEndDate) return -1
    return 0
  }

  if (aStartDate < bStartDate) return -1
  if (aStartDate > bStartDate) return 1
  return 0
}
