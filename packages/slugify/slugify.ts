// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function slugify (str: any) {
  if (!str || str !== `${str}`) {
    return str
  }
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/ig, '-')
    .replace(/[-]+$/g, '')
    .replace(/^[-]+/g, '');
}
