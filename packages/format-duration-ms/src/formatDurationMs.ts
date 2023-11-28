import prettyMS from 'pretty-ms'

export default function formatDurationMs(ms: number): string {
  let human = prettyMS(ms)

  human = human.replace(/(\d+)\.\d+s/g, '$1s')
  human = human.replace(/\s+/g, '')

  return human
}
