module.exports = function slugify (str) {
  if (!str || str !== `${str}`) {
    return str
  }
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/ig, '-')
    .replace(/[-]+$/g, '')
    .replace(/^[-]+/g, '')
}
