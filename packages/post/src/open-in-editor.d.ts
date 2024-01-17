/* eslint-disable max-classes-per-file */

declare module 'open-in-editor' {
  class OpenInEditor {
    open(path: string): Promise<void>
  }

  interface CreateOpenInEditorOptions {
    /**
     * Editor to open a file. Once value is set, we try to detect a command to launch an editor.
     *
     * @default null
     */
    editor?:
      | 'sublime'
      | 'atom'
      | 'code'
      | 'webstorm'
      | 'phpstorm'
      | 'idea14ce'
      | 'vim'
      | 'emacs'
      | 'visualstudio'
      | null
    /**
     * Command to launch an editor.
     *
     * @default null
     */
    cmd?: string | null
    /**
     * Option to specify arguments for a command. Pattern can contain placeholders to be replaced by actual values. Supported placeholders: filename, line and column.
     *
     * @default null
     */
    pattern?: string | null
    /**
     * Number of the first line in the editor
     * @default 1
     */
    line?: number
    /**
     * Number of the first column in the editor
     * @default 1
     */
    column?: number
  }

  function configure(
    opts?: CreateOpenInEditorOptions,
    failCallback?: (err: Error) => void,
  ): OpenInEditor

  export = { configure }
}
