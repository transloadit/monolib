export default function sortObject<T extends Record<string, unknown>>(
  obj: T,
  sortFunc?: (a: string, b: string) => number
): T {
  // yeah i know, sorting objects in js doesn't work :)
  return Object.keys(obj)
    .sort(sortFunc)
    .reduce((result, key: keyof T) => {
      result[key] = obj[key]
      return result
    }, {} as T)
}
