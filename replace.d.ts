declare module 'replace' {
  type Options = {
    regex: string
    replacement: string
    paths: string[]
    recursive: boolean
    silent: boolean
  }

  function replace(opts: Options): string

  export = replace
}
