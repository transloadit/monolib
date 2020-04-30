const execa = require('execa')
const replace = require('replace')
const inquirer = require('inquirer')
const inflection = require('inflection')

;(async () => {
  const answers = await inquirer
    .prompt([
      {
        type   : 'input',
        name   : 'name',
        default: 'hello-world',
        message: 'name (dashed)',
      },
    ])

  const camelized = inflection.camelize(answers.name.replace(/-/g, '_'), true)
  const { stdout } = await execa(`cp`, [
    `-Rafv`,
    `${__dirname}/template-package`,
    `${__dirname}/packages/${answers.name}`,
  ]).stdout.pipe(process.stdout)

  await execa(`mv`, [
    `-vf`,
    `${__dirname}/packages/${answers.name}/replaceMe.js`,
    `${__dirname}/packages/${answers.name}/${camelized}.js`,
  ]).stdout.pipe(process.stdout)
  await execa(`mv`, [
    `-vf`,
    `${__dirname}/packages/${answers.name}/replaceMe.test.js`,
    `${__dirname}/packages/${answers.name}/${camelized}.test.js`,
  ]).stdout.pipe(process.stdout)

  await replace({
    regex      : 'replace-me',
    replacement: answers.name,
    paths      : [`${__dirname}/packages/${answers.name}`],
    recursive  : true,
    silent     : false,
  })
  await replace({
    regex      : 'replaceMe',
    replacement: camelized,
    paths      : [`${__dirname}/packages/${answers.name}`],
    recursive  : true,
    silent     : false,
  })

  setTimeout(() => {
    console.log(``)
    console.log(`code '${__dirname}/packages/${answers.name}'`)
  }, 300)
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
