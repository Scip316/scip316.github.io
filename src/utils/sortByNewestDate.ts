type DatedItem = {
  date?: string | null
  endDate?: string | null
  lastUpdated?: string | null
  startDate?: string | null
  year?: string | number | null
}

const monthNumbers: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
}

const dateValue = (value: string | null | undefined) => {
  if (!value) return Number.NEGATIVE_INFINITY

  const numericDates = value.match(/\b\d{4}[-/]\d{2}\b/g)
  if (numericDates?.length) return Number(numericDates[numericDates.length - 1].replace(/\D/g, ''))

  const namedDate = value.match(/\b(\d{4})\s+([a-z]{3,})\b/i)
  if (namedDate) {
    const month = monthNumbers[namedDate[2].slice(0, 3).toLowerCase()]
    if (month) return Number(`${namedDate[1]}${String(month).padStart(2, '0')}`)
  }

  const year = value.match(/\b\d{4}\b/)
  if (year) return Number(`${year[0]}00`)

  return Number.NEGATIVE_INFINITY
}

const latestDateValue = (item: DatedItem) => {
  if (item.endDate === null) return Number.POSITIVE_INFINITY
  return dateValue(
    item.endDate ?? item.lastUpdated ?? item.date ?? item.startDate ?? String(item.year ?? ''),
  )
}

export const sortByNewestDate = <T>(items: T[]) =>
  [...items].sort(
    (first, second) =>
      latestDateValue(second as DatedItem) - latestDateValue(first as DatedItem),
  )
