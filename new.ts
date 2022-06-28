// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const execa = require('execa')
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const replace = require('replace')
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'inquirer'.
const inquirer = require('inquirer')
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const inflection = require('inflection')

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
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      __dirname}/template-package`,
    `${
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      __dirname}/packages/${answers.name}`,
  ])
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  subprocess1.stdout.pipe(process.stdout)
  await subprocess1

  const subprocess2 = execa(`mv`, [
    `-vf`,
    `${
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      __dirname}/packages/${answers.name}/replaceMe.js`,
    `${
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      __dirname}/packages/${answers.name}/${camelized}.js`,
  ])
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  subprocess2.stdout.pipe(process.stdout)
  await subprocess2

  const subprocess3 = execa(`mv`, [
    `-vf`,
    `${
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      __dirname}/packages/${answers.name}/replaceMe.test.js`,
    `${
      // @ts-expect-error TS(2304): Cannot find name '__dirname'.
      __dirname}/packages/${answers.name}/${camelized}.test.js`,
  ])
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  subprocess3.stdout.pipe(process.stdout)
  await subprocess3

  await replace({
    regex      : 'replace-me',
    replacement: answers.name,
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    paths      : [`${__dirname}/packages/${answers.name}`],
    recursive  : true,
    silent     : false,
  })
  await replace({
    regex      : 'replaceMe',
    replacement: camelized,
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    paths      : [`${__dirname}/packages/${answers.name}`],
    recursive  : true,
    silent     : false,
  })

  setTimeout(() => {
    console.log(``)
    // @ts-expect-error TS(2304): Cannot find name '__dirname'.
    console.log(`code '${__dirname}/packages/${answers.name}'`)
  }, 300)
})().catch((error) => {
  console.error(error)
  // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
  process.exit(1)
})
