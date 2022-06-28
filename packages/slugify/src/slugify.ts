export default function slugify (str: any) {
  if (!str || str !== `${str}`) {
    return str
  }
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/ig, '-')
    .replace(/[-]+$/g, '')
    .replace(/^[-]+/g, '')
}
