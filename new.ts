import execa from 'execa'
import replace from 'replace'
import inquirer from 'inquirer'
import inflection from 'inflection'

;

(async () => {
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
  const subprocess1 = execa(`cp`, [
    `-Rafv`,
    `${
            __dirname}/template-package`,
    `${
            __dirname}/packages/${answers.name}`,
  ])
    subprocess1.stdout.pipe(process.stdout)
  await subprocess1

  const subprocess2 = execa(`mv`, [
    `-vf`,
    `${
            __dirname}/packages/${answers.name}/replaceMe.js`,
    `${
            __dirname}/packages/${answers.name}/${camelized}.js`,
  ])
    subprocess2.stdout.pipe(process.stdout)
  await subprocess2

  const subprocess3 = execa(`mv`, [
    `-vf`,
    `${
            __dirname}/packages/${answers.name}/replaceMe.test.js`,
    `${
            __dirname}/packages/${answers.name}/${camelized}.test.js`,
  ])
    subprocess3.stdout.pipe(process.stdout)
  await subprocess3

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
