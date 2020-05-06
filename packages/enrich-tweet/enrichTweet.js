const twttr = require('twitter-text')
const tall  = require('tall').tall

module.exports = async function enrichTweet (tweet) {
  let text = tweet.full_text
  // Expand URLs
  if (tweet.entities && tweet.entities.urls.length) {
    const subUrls = tweet.entities.urls
    for (const subUrl1 of subUrls) {
      let unshortened = {}
      try {
        unshortened = await tall(subUrl1.expanded_url)
      } catch (err) {
        unshortened = subUrl1.expanded_url
      }
      const friends1 = [
        subUrl1.display_url,
        subUrl1.url,
        subUrl1.expanded_url,
      ]
      for (const friend1 of friends1) {
        text = text.replace(`http://www.${friend1}`, unshortened)
        text = text.replace(`https://www.${friend1}`, unshortened)
        text = text.replace(`http://${friend1}`, unshortened)
        text = text.replace(`https://${friend1}`, unshortened)
        text = text.replace(`${friend1}`, unshortened)
      }
    }
  }

  if (tweet.extended_entities && tweet.extended_entities.media.length) {
    for (const subUrl2 of tweet.extended_entities.media) {
      const friends2 = [
        subUrl2.display_url,
        subUrl2.url,
        subUrl2.media_url,
        subUrl2.expanded_url,
      ]
      for (const friend2 of friends2) {
        text = text.replace(`http://${friend2}`, `\n${subUrl2.media_url_https}`)
        text = text.replace(`https://${friend2}`, `\n${subUrl2.media_url_https}`)
        text = text.replace(`${friend2}`, `\n${subUrl2.media_url_https}`)
      }
    }
  }

  // Link all the things inside the tweet
  text = twttr.autoLink(text)

  // Add @ inside link instead of before
  text = text.replace(/@<a\s+class="tweet-url username"\s+href="https:\/\/twitter.com\/([^"]+)"\s+data-screen-name="([^"]+)"\s+rel="nofollow">([^<]+)<\/a>/g, '<a class="tweet-url username" href="https://twitter.com/$1" data-screen-name="$2" rel="nofollow">@$3</a>')

  return text
}
