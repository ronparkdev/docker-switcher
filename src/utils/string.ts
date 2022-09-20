const toCamelCase = (str: string): string =>
  str
    .split(' ')
    .map((str, offset) => {
      if (offset === 0) {
        return str.toLowerCase()
      } else {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
      }
    })
    .join('')

export const StringUtil = { toCamelCase }
