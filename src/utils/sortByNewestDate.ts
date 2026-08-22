type DatedItem = {
  date: string
}

const latestMonthValue = (date: string) => {
  const dates = date.match(/\b\d{4}[-/]\d{2}\b/g)
  return Number((dates?.[dates.length - 1] ?? '').replace(/\D/g, ''))
}

export const sortByNewestDate = <T extends DatedItem>(items: T[]) =>
  [...items].sort((first, second) => latestMonthValue(second.date) - latestMonthValue(first.date))
