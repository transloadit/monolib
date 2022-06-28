#!/usr/bin/env node
/* eslint-disable no-console */
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs').promises
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'inquirer'.
const inquirer = require('inquirer')
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const openInEditor = require('open-in-editor')
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fileExists... Remove this comment to see the full error message
const fileExists = require('@transloadit/file-exists')
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'slugify'.
const slugify = require('@transloadit/slugify')
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const title = require('title')

async function post () {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  // eslint-disable-next-line import/no-dynamic-require,global-require
  console.log(`Welcome to @transloadit/post@${require(`${__dirname}/package.json`).version}. `)
  console.log(`Please answer some questions about the blog post, `)
  console.log(`and I'll generate a starting point and open your editor. `)

  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  const postDir = `${process.cwd()}/${process.argv[2] || '_posts'}`
  if (!(await fileExists(postDir))) {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    throw new Error(`Dir does not exist: '${postDir.replace(process.cwd(), '.')}'`)
  }

  const mysqlNow = (new Date()).toISOString().replace('T', ' ').split('.')[0].split(' ')[0]
  // eslint-disable-next-line no-unused-vars
  const [dateY, datem, dated] = mysqlNow.split('-')
  const answers = await inquirer
    .prompt([
      { type: 'input', name: 'title', message: 'title:' },
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      { type: 'input', name: 'author', message: 'author:', default: process.env.USER },
    ])

  const outFile = `${postDir}/${mysqlNow}-${slugify(answers.title)}.md`

  if ((await fileExists(outFile))) {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    throw new Error(`File already exist: '${outFile.replace(process.cwd(), '.')}'`)
  }

  const strTitle = title(answers.title, {
    special: [
      'tus',
      'io',
    ],
  })

  let buff = ''
  buff += `---\n`
  buff += `title: ${strTitle}\n`
  buff += `author: ${answers.author}\n`
  buff += `layout: post\n`
  buff += `ogimage: /assets/images/blog/${dateY}-${datem}-x.jpg\n`
  buff += `tags: \n`
  buff += `  - \n`
  buff += `meta_description: >-\n`
  buff += `  \n`
  buff += `---\n`
  buff += `\n`
  await fs.writeFile(outFile, buff, 'utf-8')

  console.log(`Opening'${outFile}' in your editor .. `)

  // Avoid crashing on /bin/sh: 1: code -w: not found
  // strip any arguments
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  if (process.env.VISUAL) {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    // eslint-disable-next-line prefer-destructuring
    process.env.VISUAL = process.env.VISUAL.split(/\s+/)[0]
  }

  let opts = {}

  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  if (process.env.VISUAL === 'code') {
    opts = {
      cmd    : 'code',
      pattern: '-r -g {filename}:{line}:{column}',
    }
  }

  const editor = openInEditor.configure(opts)
  await editor.open(`${outFile}`, {
    line: 10,
  })
  console.log(`Done. `)
}
post().catch(err => {
  console.error(err)
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  process.exit(1)
})
