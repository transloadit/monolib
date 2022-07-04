/* eslint-disable quote-props */
/* eslint-disable no-template-curly-in-string */
import formatDurationMs from '@transloadit/format-duration-ms'
import prettierBytes from '@transloadit/prettier-bytes'
// @ts-expect-error
import inflect from 'inflect'
import _ from 'lodash'
import jp from 'jsonpath'

function humanJoin (array: $TSFixMe, reduce = true, glueword = 'and') {
  let countedArray = array

  if (reduce === true) {
    const counted = _.countBy(array)
    countedArray = []
    for (const [name, count] of Object.entries(counted)) {
      if (count > 1) {
        countedArray.push(`${count} ${inflect.pluralize(name)}`)
      } else {
        countedArray.push(`${name}`)
      }
    }
  }

  if (countedArray.length === 1) {
    return countedArray[0]
  }

  const last = countedArray.pop()
  let str = `${countedArray.join(', ')}`
  if (countedArray.length < 2) {
    str += ` ${glueword} ${last}`
  } else {
    str += `, ${glueword} ${last}`
  }
  return str
}

function humanFilter (step: $TSFixMe) {
  const collection: $TSFixMe = {}
  const templates: Record<string, string> = {
    '<'        : 'files with {humanKey} below {humanVal}',
    '<='       : 'files with {humanKey} of {humanVal} or lower',
    '>'        : 'files with {humanKey} above {humanVal}',
    '>='       : 'files with {humanKey} of {humanVal} or higher',
    '='        : 'files with {humanKey} of {humanVal}',
    '=='       : 'files with {humanKey} of {humanVal}',
    '==='      : 'files with {humanKey} of {humanVal}',
    '!='       : 'files without {humanKey} of {humanVal}',
    '!=='      : 'files without {humanKey} of {humanVal}',
    'regex'    : 'files with {humanKey} of {humanVal}',
    '!regex'   : 'files without {humanKey} of {humanVal}',
    'includes' : 'files that include {humanKey} of {humanVal}',
    '!includes': 'files that do not include {humanKey} of {humanVal}',
  }

  let lastTemplate = ''
  const types = ['declines', 'accepts']
  for (const type of types) {
    collection[type] = collection[type] || []
    if (typeof step[type] === 'string') {
      collection[type].push(`Filter by code evaluation`)
    } else if (step[type] && step[type].length > 0) {
      // @ts-expect-error
      for (const [key, operator, val] of Object.values(step[type])) {
        const template = _.clone(templates[operator])
        if (!template) {
          throw new Error(`Please add a template definition for this /file/filter operator: ${operator}`)
        }

        let humanKey = key
        humanKey = humanKey.replace(/\$\{/, '')
        humanKey = humanKey.replace(/\}/, '')
        humanKey = humanKey.replace(/file\.meta\./g, '')
        humanKey = humanKey.replace(/file\./g, '')
        humanKey = humanKey.replace(/has_/g, '')
        humanKey = humanKey.replace(/_/g, ' ')

        humanKey = humanKey.replace('mime', 'mime-type')
        humanKey = humanKey.replace('size', 'filesize')

        let humanVal = val
        if (humanKey === 'filesize') {
          humanVal = prettierBytes(parseInt(humanVal, 10))
        }
        if (humanKey.match(/ bitrate$/) && humanVal)  {
          humanVal = `${prettierBytes(parseInt(humanVal, 10))}`.replace('B', 'bit/s')
        }
        if (humanKey === 'duration') {
          humanVal = formatDurationMs(parseInt(humanVal, 10) * 1000)
        }
        if (humanVal === 'application/(rar|x-7z-compressed|x-cab|x-cpio|x-debian-package|x-gtar-compressed|x-gzip|x-lzh|x-redhat-package-manager|x-tar|zip)') {
          humanVal = 'archives'
        }

        if (humanKey === `${humanKey}` && inflect.singularize(humanKey) === `${humanKey}` && !`${humanKey}`.match(/^\d+/) && humanKey !== '') {
          humanKey = `a ${humanKey}`
        }
        if (humanVal === `${humanVal}` && inflect.singularize(humanVal) === `${humanVal}` && !`${humanVal}`.match(/^\d+/) && humanVal !== '') {
          humanVal = `a ${humanVal}`
        }

        let useTemplate = template
        if (lastTemplate === template) {
          useTemplate = useTemplate.replace(/^[^{]+({.*)$/, '$1')
        }

        let humanDescr = useTemplate
          .replace(/{humanKey}/g, humanKey)
          .replace(/{humanVal}/g, humanVal)

        if (humanVal === true || humanVal === 'true') {
          // No values for boolean, just say: with
          humanDescr = humanDescr.replace(' of ', '')
          humanDescr = humanDescr.replace('true', '')
        } else if (humanVal === '' || humanVal === false || humanVal === 'false') {
          // No values for boolean, just say: without
          humanDescr = humanDescr.replace(' of ', '')
          humanDescr = humanDescr.replace('false', '')
          // Swap with & without via an intermediary step
          humanDescr = humanDescr.replace('without', 'wi2th')
          humanDescr = humanDescr.replace('with', 'without')
          humanDescr = humanDescr.replace('wi2th', 'with')
        }

        collection[type].push(humanDescr)
        lastTemplate = template
      }
    }
  }

  const total = []
  if ((collection as $TSFixMe).declines && (collection as $TSFixMe).declines.length > 0) {
    const joindec = humanJoin((collection as $TSFixMe).declines, false, step.condition_type)
      .replace('with a certain mime-type and with a certain mime-type', 'with certain mime-types')

    total.push(`Exclude ${joindec}`)
  }
  if ((collection as $TSFixMe).accepts && (collection as $TSFixMe).accepts.length > 0) {
    const joinacc = humanJoin((collection as $TSFixMe).accepts, false, step.condition_type)
      .replace('with a certain mime-type and with a certain mime-type', 'with certain mime-types')

    total.push(`Pick ${joinacc}`)
  }

  const strTotal = humanJoin(total, false)
  return strTotal
    .replace(/(\W)a audio/g, '$1an audio')
    .replace(/(\W)a image/g, '$1an image')
    .replace(/files with a (mime-)?type of a application\/x-subrip(\W|$)/g, 'subtitles$2')
    .replace(/files with a (mime-)?type of an image\/(jpe\?g)(\W|$)/g, '$2 images$3')
    .replace(/jpe\?g/g, 'jpeg')
    .replace(/files with a (mime-)?type of an image(\W|$)/g, 'images$2')
    .replace(/files with a (mime-)?type of an audio(\W|$)/g, 'audio files$2')
    .replace(/files with a (mime-)?type of a video(\W|$)/g, 'videos$2')
    .replace(/files with a (mime-)?type of archives(\W|$)/g, 'archives$2')
    .replace(/and a (mime-)?type of a application\/x-subripg(\W|$)/g, 'and subtitles$2')
    .replace(/and a (mime-)?type of an image\/jpe?g(\W|$)/g, 'and JPEG images$2')
    .replace(/and a (mime-)?type of an image(\W|$)/g, 'and images$2')
    .replace(/and a (mime-)?type of an audio(\W|$)/g, 'audio and files$2')
    .replace(/and a (mime-)?type of a video(\W|$)/g, 'and videos$2')
    .replace(/and a (mime-)?type of archives(\W|$)/g, 'and archives$2')
    .replace(/files with a filesize above(\W|$)/g, 'files bigger than$1')
    .replace(/files with a filesize below(\W|$)/g, 'files smaller than$1')
}

function humanDimensions (step: $TSFixMe) {
  let str = ''

  if ('width' in step && !`${step.width}`.match(/^\d+$/)) {
    // Not a number, so likely ${file.meta.width}, which we don't want in a heading
    return str
  }

  if ('height' in step && !`${step.height}`.match(/^\d+$/)) {
    // Not a number, so likely ${file.meta.width}, which we don't want in a heading
    return str
  }

  if ('width' in step && 'height' in step) {
    str += ` to ${step.width}×${step.height}`
  } else if ('width' in step) {
    str += ` to ${step.width} pixels wide`
  } else if ('height' in step) {
    str += ` to ${step.height} pixels high`
  } else if ('crop' in step) {
    str += ` to ${step.crop.x2 - step.crop.x1}×${step.crop.y2 - step.crop.y1} starting at ${step.crop.x1}×${step.crop.y1} from the top left`
  }

  return str
}

function humanPreset (step: $TSFixMe, extrameta = {}) {
  let str = inflect.humanize(step.preset.replace(/[-_]/g, ' '))

  if (str.match(/^ipad/i)) {
    let quality = str.split(' ')[1]
    quality = quality ? ` (${quality} quality)` : ``

    let device = `iPad${quality}`
    if ((extrameta as $TSFixMe).deviceName) {
      device = `${(extrameta as $TSFixMe).deviceName}`
    }

    str = `${device} (H.264)`
  }
  if (str.match(/^iphone/i)) {
    let quality = str.split(' ')[1]
    quality = quality ? ` (${quality} quality)` : ``
    str = `iPhone${quality} (H.264)`
  }
  if (str.match(/^hls/i)) {
    str = `HLS (${str.split(' ')[1]}) (H.264)`
  }
  if (str.match(/^dash/i)) {
    str = `MPEG-Dash (${str.split(' ')[1]}) (H.264/H.265/VP9)`
  }
  if (str.match(/^webm/i)) {
    str = 'WebM (VP9)'
  }
  if (str.match(/^hevc/i)) {
    str = 'HEVC (H.265)'
  }
  if (str.match(/^empty/i)) {
    str = 'original codec Settings'
  }
  if (str.match(/^(flac|mp3|ogg)/i)) {
    str = str.toUpperCase()
  }

  return str
}

function humanFormat (step: $TSFixMe) {
  let str = inflect.humanize(step.format.replace(/[-_]/g, ' '))

  if (str.match(/^webp/i)) {
    str = 'WebP'
  }
  if (str.match(/^(svg|tiff?|gif|png|jpe?g)/i)) {
    str = str.toUpperCase()
  }

  return str
}

export default (step: $TSFixMe, robots: $TSFixMe, extrameta = {}) => {
  let str = ``

  const robot = robots[step.robot]
  str = robot.purpose_words

  if (robot.rname === '/video/encode') {
    if (JSON.stringify(step).match(/watermark/)) {
      str = `Watermark videos`
    } else if (_.get(step, 'ffmpeg.t') && _.get(step, 'ffmpeg.ss')) {
      str = `Take a ${_.get(step, 'ffmpeg.t')}s clip out of videos at an offset`
    } else if (_.get(step, 'ffmpeg.t')) {
      str = `Take a ${_.get(step, 'ffmpeg.t')}s clip out of videos at the beginning`
    } else if (_.get(step, 'ffmpeg.ss')) {
      str = `Take a clip out of videos from ${_.get(step, 'ffmpeg.ss')}s till the end`
    } else if (_.has(step, 'filter:v') && step.ffmpeg['filter:v'] === 'setpts=2.0*PTS') {
      str = `Slowdown video to half speed`
    } else if (_.has(step, 'ffmpeg.filter_complex') && step.ffmpeg.filter_complex.includes('setpts=')) {
      str = `Change video speed`
    } else if (_.has(step, 'ffmpeg.filter_complex') && step.ffmpeg.filter_complex.includes('atempo=')) {
      str = `Change audio speed`
    } else if (('width' in step || 'height' in step) && (step.width !== '${file.meta.width}') && (step.height !== '${file.meta.height}')) {
      str = `Resize videos${humanDimensions(step)}`
      if ('resize_strategy' in step && step.resize_strategy !== 'pad') {
        str = `${str} using the ${step.resize_strategy} strategy`
      }
      if ('preset' in step) {
        str = `${str} and encode for ${humanPreset(step, extrameta)}`
      }
    } else if (('resize_strategy' in step)) {
      str = `Resize videos`
      if ('preset' in step) {
        str = `${str} in ${humanPreset(step, extrameta)}`
      }
    } else if ('preset' in step) {
      str = `Transcode videos to ${humanPreset(step, extrameta)}`
    }

    if (_.get(step, 'ffmpeg.an') === true) {
      str += ' and strip the sound'
    }
  }

  if (robot.rname === '/audio/encode') {
    if (_.has(step, 'ffmpeg.ss') && _.has(step, 'ffmpeg.t')) {
      str = `Take a ${_.get(step, 'ffmpeg.t')}s clip out of audio at a specified offset`
    } else if (_.has(step, 'ffmpeg.filter_complex') && step.ffmpeg.filter_complex.includes('setpts=')) {
      str = `Change video speed`
    } else if (_.has(step, 'ffmpeg.filter_complex') && step.ffmpeg.filter_complex.includes('atempo=')) {
      str = `Change audio speed`
    } else if ('bitrate' in step) {
      str = `Adjust audio bitrates`
    } else if ('preset' in step) {
      str = `Encode audio to ${humanPreset(step, extrameta)}`
    }

    if (_.get(step, 'ffmpeg.an') === true) {
      str += ' and strip the sound'
    }
  }

  if (robot.rname === '/video/adaptive') {
    if (step.technique === 'hls') {
      str = `Convert videos to HLS`
    } else if (step.technique === 'dash') {
      str = `Convert videos to MPEG-Dash`
    }
  }

  if (robot.rname === '/video/merge') {
    const types = jp.query(step, '$..as')
    if (types.length) {
      str = `Merge ${humanJoin(types)} to create a new video`
    } else if (_.get(step, 'ffmpeg.f') === 'gif') {
      str = `Create animated GIFs from a series of still images`
    }
  }

  if (robot.rname === '/file/filter') {
    str = humanFilter(step)
  }

  if (robot.rname === '/audio/artwork') {
    if (_.get(step, 'method') === 'insert') {
      str = `Insert audio artwork`
    } else {
      str = `Extract audio artwork`
    }
  }

  if (robot.rname === '/image/resize') {
    if ('watermark_url' in step) {
      str = `Watermark images`
    } else if ('sepia' in step) {
      str = `Add effects to images`
    } else if ('quality' in step) {
      str = `Change quality of images`
    } else if ('width' in step || 'height' in step) {
      str = `Resize images${humanDimensions(step)}`
      if ('resize_strategy' in step && step.resize_strategy !== 'fit') {
        str = `${str} using the ${step.resize_strategy} strategy`
      }
    } else if ('crop' in step) {
      str = `Crop images${humanDimensions(step)}`
    } else if ('format' in step) {
      str = `Convert images to ${humanFormat(step)}`
    }
  }

  return str
}
