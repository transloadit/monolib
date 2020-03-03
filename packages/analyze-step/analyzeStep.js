const formatDurationMs = require('@transloadit/format-duration-ms')
const formatBytes = require('prettier-bytes')
const inflect = require('inflect')
const _ = require('lodash')
const  jp = require('jsonpath')

function humanJoin (array, reduce = true, glueword = 'and') {
  const countedArray = array

  if (reduce === true) {
    const counted = _.countBy(array)
    const countedArray = []
    for (const name in counted) {
      const count = counted[name]
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

function humanFilter (step) {
  const collection = {}
  const templates = {
    '<'        : 'files with a {humanKey} below {humanVal}',
    '<='       : 'files with a {humanKey} of {humanVal} or lower',
    '>'        : 'files with a {humanKey} above {humanVal}',
    '>='       : 'files with a {humanKey} of {humanVal} or higher',
    '='        : 'files with a {humanKey} of {humanVal}',
    '!='       : 'files without a {humanKey} of {humanVal}',
    regex      : 'files with a {humanKey} of {humanVal}',
    '!regex'   : 'files without a {humanKey} of {humanVal}',
    includes   : 'files that include a {humanKey} of {humanVal}',
    '!includes': 'files that do not include a {humanKey} of {humanVal}',
  }

  const types = ['declines', 'accepts']
  for (const type of types) {
    if (step[type] && step[type].length > 0) {
      for (const i in step[type]) {
        collection[type] = collection[type] || []
        const [key, operator, val] = step[type][i]

        const template = _.clone(templates[operator])
        if (!template) {
          throw new Error(`Please add a template definition for this /file/filter operator: ${operator}`)
        }

        // if (val === true || val === 'true') {
        //   template = template.replace('with a certain', 'with a')
        //   template = template.replace('without a certain', 'without a')
        // }

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
          humanVal = formatBytes(parseInt(humanVal, 10), 1)
        }
        if (humanKey.match(/ bitrate$/) && humanVal)  {
          humanVal = `${formatBytes(parseInt(humanVal, 10), 1)}`.replace('B', 'bit/s')
        }
        if (humanKey === 'duration') {
          humanVal = formatDurationMs(parseInt(humanVal, 10) * 1000)
        }
        if (humanVal === 'application/(rar|x-7z-compressed|x-cab|x-cpio|x-debian-package|x-gtar-compressed|x-gzip|x-lzh|x-redhat-package-manager|x-tar|zip)') {
          humanVal = 'archives'
        }

        let humanDescr = template
          .replace(/{humanKey}/g, humanKey)
          .replace(/{humanVal}/g, humanVal)

        if (humanVal === '' || humanVal === false || humanVal === 'false') {
          humanDescr = humanDescr.replace('without', 'wi2th')
          humanDescr = humanDescr.replace('with', 'without')
          humanDescr = humanDescr.replace('wi2th', 'with')
          humanDescr = humanDescr.replace(' of ', '')
          humanDescr = humanDescr.replace('false', '')
        }
        if (humanVal === false || humanVal === 'true') {
          humanDescr = humanDescr.replace(' of ', '')
          humanDescr = humanDescr.replace('true', '')
        }

        collection[type].push(humanDescr)
      }
    }
  }

  const total = []
  if (collection.declines && collection.declines.length > 0) {
    const joindec = humanJoin(collection.declines, false, step.condition_type)
      .replace('with a certain mime-type and with a certain mime-type', 'with certain mime-types')

    total.push('Reject ' + joindec)
  }
  if (collection.accepts && collection.accepts.length > 0) {
    const joinacc = humanJoin(collection.accepts, false, step.condition_type)
      .replace('with a certain mime-type and with a certain mime-type', 'with certain mime-types')

    total.push('Filter ' + joinacc)
  }

  const strTotal = humanJoin(total, false)
  return strTotal
    .replace(/files with a mime-type of application\/x-subripg/g, 'subtitles')
    .replace(/files with a mime-type of image\/jpe?g/g, 'JPEG images')
    .replace(/files with a mime-type of image/g, 'images')
    .replace(/files with a mime-type of audio/g, 'audio files')
    .replace(/files with a mime-type of video/g, 'videos')
    .replace(/files with a mime-type of archives/g, 'archives')
    .replace(/files with a filesize above/g, 'files bigger than')
    .replace(/files with a filesize below/g, 'files smaller than')
    .replace(/a audio/g, 'an audio')
}

function humanDimensions (step) {
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

function humanPreset (step) {
  let str = inflect.humanize(step.preset.replace(/[-_]/g, ' '))

  if (str.match(/^ipad/i)) {
    let quality = str.split(' ')[1]
    quality = quality ? ` (${quality} quality)` : ``

    let device = `iPad${quality}`
    if ('__deviceName' in step) {
      device = `${step.__deviceName}`
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
    str = 'Original Codec Settings'
  }
  if (str.match(/^(flac|mp3|ogg)/i)) {
    str = str.toUpperCase()
  }

  return str
}

function humanFormat (step) {
  let str = inflect.humanize(step.format.replace(/[-_]/g, ' '))

  if (str.match(/^webp/i)) {
    str = 'WebP'
  }
  if (str.match(/^(svg|tiff?|gif|png|jpe?g)/i)) {
    str = str.toUpperCase()
  }

  return str
}

module.exports = (step, robots) => {
  let str = ``

  const robot = robots[step.robot]
  str = robot.purpose_words

  if (robot.rname === '/video/encode') {
    if (JSON.stringify(step).match(/watermark/)) {
      str = `Watermark videos`
    } else if (_.has(step, 'ffmpeg.ss') && _.has(step, 'ffmpeg.t')) {
      str = `Take a ${_.get(step, 'ffmpeg.t')}s clip out of videos at an offset`
    } else if (_.has(step, 'filter:v') && step.ffmpeg['filter:v'] === 'setpts=2.0*PTS') {
      str = `Slowdown video to half speed`
    } else if (('width' in step || 'height' in step) && (step.width !== '${file.meta.width}') && (step.height !== '${file.meta.height}')) {
      str = `Resize videos` + humanDimensions(step)
      if ('resize_strategy' in step && step.resize_strategy !== 'pad') {
        str = `${str} using the ${step.resize_strategy} strategy`
      }
      if ('preset' in step) {
        str = `${str} and encode for ` + humanPreset(step)
      }
    } else if (('resize_strategy' in step)) {
      str = `Resize videos`
      if ('preset' in step) {
        str = `${str} in ` + humanPreset(step)
      }
    } else if ('preset' in step) {
      str = `Transcode videos to ` + humanPreset(step)
    }

    if (_.get(step, 'ffmpeg.an') === true) {
      str += ' and strip the sound'
    }
  }

  if (robot.rname === '/audio/encode') {
    if (_.has(step, 'ffmpeg.ss') && _.has(step, 'ffmpeg.t')) {
      str = `Take a ${_.get(step, 'ffmpeg.t')}s clip out of audio at a specified offset`
    } else if ('bitrate' in step) {
      str = `Adjust audio bitrates`
    } else if ('preset' in step) {
      str = `Encode audio to ` + humanPreset(step)
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
