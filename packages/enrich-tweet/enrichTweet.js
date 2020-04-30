const twttr = require('twitter-text')
const tall  = require('tall').tall

module.exports = async function enrichTweet (tweet) {
  let text = tweet.full_text
  // Expand URLs
  if (tweet.entities.urls.length) {
    const subUrls = tweet.entities.urls
    for (const subUrl of subUrls) {
      const unshortened = await tall(subUrl.expanded_url)
      text = text.replace(subUrl.expanded_url, unshortened)
      text = text.replace(subUrl.url, unshortened)
      text = text.replace(subUrl.display_url, unshortened)
    }
  }

  if (tweet.extended_entities && tweet.extended_entities.media.length) {
    for (const media of tweet.extended_entities.media) {
      text = text.replace(media.url, `\nhttps://${media.display_url}`)
    }
  }

  // Link all the things inside the tweet
  text = twttr.autoLink(text)

  // Add @ inside link instead of before
  text = text.replace(/@<a\s+class="tweet-url username"\s+href="https:\/\/twitter.com\/([^"]+)"\s+data-screen-name="([^"]+)"\s+rel="nofollow">([^<]+)<\/a>/g, '<a class="tweet-url username" href="https://twitter.com/$1" data-screen-name="$2" rel="nofollow">@$3</a>')

  return text
}
