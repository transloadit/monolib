import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const packagesDir = join(__dirname, '..', 'packages')
const packages = readdirSync(packagesDir)

function getScripts(pkgName: string) {
  // List of packages without tests
  const noTestPackages = ['post']

  const baseScripts = {
    build: 'tsc --build --clean && tsc --build',
    typecheck: 'tsc --noEmit',
  }

  if (noTestPackages.includes(pkgName)) {
    return {
      ...baseScripts,
      test: "echo 'No tests yet' && exit 0",
      'test:watch': "echo 'No tests yet' && exit 0",
    }
  }

  return {
    ...baseScripts,
    test: 'tsx --test src/**/*.test.ts',
    'test:watch': 'tsx --test --watch src/**/*.test.ts',
  }
}

for (const pkg of packages) {
  const pkgJsonPath = join(packagesDir, pkg, 'package.json')
  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))

  const newPkgJson = {
    ...pkgJson,
    scripts: getScripts(pkg),
  }

  // Create a new object without these properties
  const { directories, gitHead, ...cleanPkgJson } = newPkgJson

  writeFileSync(pkgJsonPath, `${JSON.stringify(cleanPkgJson, null, 2)}\n`)
}
