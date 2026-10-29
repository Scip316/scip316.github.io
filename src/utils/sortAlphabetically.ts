export const sortAlphabetically = <T extends string>(items: T[]) =>
  [...items].sort((first, second) => first.localeCompare(second))
