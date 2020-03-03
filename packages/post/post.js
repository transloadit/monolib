const fs = require('fs').promises
const inquirer = require('inquirer')
async function post () {
  const x = await inquirer.prompt(['title'])
  console.log({ x })
}
post()
