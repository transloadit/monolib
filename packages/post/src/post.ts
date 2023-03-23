#!/usr/bin/env node
/* eslint-disable no-console */
import { promises as fs } from 'fs'
import inquirer from 'inquirer'
// @ts-expect-error
import openInEditor from 'open-in-editor'
import fileExists from '@transloadit/file-exists'
import slugify from '@transloadit/slugify'
import title from 'title'

async function post() {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  console.log(`Welcome to @transloadit/post@${require(`${__dirname}/package.json`).version}. `)
  console.log(`Please answer some questions about the blog post, `)
  console.log(`and I'll generate a starting point and open your editor. `)

  const postDir = `${process.cwd()}/${process.argv[2] || '_posts'}`
  if (!(await fileExists(postDir))) {
    throw new Error(`Dir does not exist: '${postDir.replace(process.cwd(), '.')}'`)
  }

  const mysqlNow = new Date().toISOString().replace('T', ' ').split('.')[0].split(' ')[0]
  // eslint-disable-next-line no-unused-vars
  const [dateY, datem, dated] = mysqlNow.split('-')
  const answers = await inquirer.prompt([
    { type: 'input', name: 'title', message: 'title:' },
    { type: 'input', name: 'author', message: 'author:', default: process.env.USER },
  ])

  const outFile = `${postDir}/${mysqlNow}-${slugify(answers.title)}.md`

  if (await fileExists(outFile)) {
    throw new Error(`File already exist: '${outFile.replace(process.cwd(), '.')}'`)
  }

  const strTitle = title(answers.title, {
    special: ['tus', 'io'],
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
  if (process.env.VISUAL) {
    // eslint-disable-next-line prefer-destructuring
    process.env.VISUAL = process.env.VISUAL.split(/\s+/)[0]
  }

  let opts = {}

  if (process.env.VISUAL === 'code') {
    opts = {
      cmd: 'code',
      pattern: '-r -g {filename}:{line}:{column}',
    }
  }

  const editor = openInEditor.configure(opts)
  await editor.open(`${outFile}`, {
    line: 10,
  })
  console.log(`Done. `)
}
post().catch((err) => {
  console.error(err)
  process.exit(1)
})
