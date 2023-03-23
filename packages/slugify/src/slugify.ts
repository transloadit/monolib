export default function slugify(str: $TSFixMe) {
  if (!str || str !== `${str}`) {
    return str
  }
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/[-]+$/g, '')
    .replace(/^[-]+/g, '')
}
