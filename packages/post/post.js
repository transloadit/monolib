const fs = require('fs').promises
const inquirer = require('inquirer')
const fileExists = require('@transloadit/file-exists')

function slugify (str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/ig, '-')
    .replace(/[-]+$/g, '')
    .replace(/^[-]+/g, '')
}
async function post () {
  const postDir = `${process.cwd()}/${process.argv[2] || '_posts'}`
  if (!(await fileExists(`${postDir}`))) {
    throw new Error(`Dir does not exist: '${postDir.replace(process.cwd(), '.')}'`)
  }

  const mysqlNow = (new Date()).toISOString().replace('T', ' ').split('.')[0]
  const answers = await inquirer
    .prompt([
      { type: 'input', name: 'title', message: 'title' },
      { type: 'input', name: 'author', message: 'author', default: process.env.USER },
    ])

  const outFile = `${postDir}/${mysqlNow}-${slugify(answers.title)}.md`
  const buff = `---\ntitle: ${answers.title}\nauthor: ${answers.author}\n---\n\n`
  await fs.writeFile(outFile, buff, 'utf-8')
  console.log(`\n`)
  console.log(`code '${outFile}'`)
  console.log(`\n`)
}
post().catch(err => {
  console.error(err)
  process.exit(1)
})
