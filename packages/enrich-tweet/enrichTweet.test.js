const fs = require('fs')
const enrichTweet = require('./enrichTweet')

describe('enrichTweet', () => {
  test('should render tweet 1087761082247204900 correctly', async () => {
    jest.setTimeout(20000)
    const tweet = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-1087761082247204900.json`, 'utf-8'))
    expect((await enrichTweet(tweet))).toBe(`In the age of cloud, <a class="tweet-url username" href="https://twitter.com/transloadit" data-screen-name="transloadit" rel="nofollow">@transloadit</a> shows great balance of leaning on larger clouds while managing infra in-house <a class="tweet-url username" href="https://twitter.com/kvz" data-screen-name="kvz" rel="nofollow">@kvz</a> \n<a href="https://transloadit.com/blog/2018/12/launching-asia-pacific-and-network-changes/" rel="nofollow">https://transloadit.com/blog/2018/12/launching-asia-pacific-and-network-changes/</a> \n\n<a href="https://pbs.twimg.com/media/DxiA8ElX4AA4hQ6.jpg" rel="nofollow"><img class="tweet-media" src="https://pbs.twimg.com/media/DxiA8ElX4AA4hQ6.jpg" /></a>`)
  })
  test('should render tweet 1082897509528281089 correctly', async () => {
    jest.setTimeout(20000)
    const tweet = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-1082897509528281089.json`, 'utf-8'))
    expect((await enrichTweet(tweet))).toBe(`Just realized how <a class="tweet-url username" href="https://twitter.com/tus_io" data-screen-name="tus_io" rel="nofollow">@tus_io</a> and <a class="tweet-url username" href="https://twitter.com/uppy_io" data-screen-name="uppy_io" rel="nofollow">@uppy_io</a> are a perfect example of <a class="tweet-url username" href="https://twitter.com/transloadit" data-screen-name="transloadit" rel="nofollow">@transloadit</a> commoditizing their complements: <a href="https://www.gwern.net/Complement" rel="nofollow">https://www.gwern.net/Complement</a>`)
  })
  test('should render tweet 389922139408592896 correctly', async () => {
    jest.setTimeout(20000)
    const tweet = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-389922139408592896.json`, 'utf-8'))
    expect((await enrichTweet(tweet))).toBe(`Don't understand why anyone messes with carrierwave / paperclip / whatever anymore. <a class="tweet-url username" href="https://twitter.com/transloadit" data-screen-name="transloadit" rel="nofollow">@transloadit</a> is just too easy. <a href="https://transloadit.com/r/wGN" rel="nofollow">https://transloadit.com/r/wGN</a>`)
  })
  test('should render tweet 558414704024899584 correctly', async () => {
    jest.setTimeout(20000)
    const tweet = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-558414704024899584.json`, 'utf-8'))
    expect((await enrichTweet(tweet))).toBe(`Thank the sponsors! <a href="http://2015.staticshowdown.com/sponsors" rel="nofollow">http://2015.staticshowdown.com/sponsors</a> <a class="tweet-url username" href="https://twitter.com/polymer" data-screen-name="polymer" rel="nofollow">@polymer</a> <a class="tweet-url username" href="https://twitter.com/BloombergBeta" data-screen-name="BloombergBeta" rel="nofollow">@BloombergBeta</a> <a class="tweet-url username" href="https://twitter.com/Firebase" data-screen-name="Firebase" rel="nofollow">@Firebase</a> <a class="tweet-url username" href="https://twitter.com/MaxCDNDeveloper" data-screen-name="MaxCDNDeveloper" rel="nofollow">@MaxCDNDeveloper</a> <a class="tweet-url username" href="https://twitter.com/sprintly" data-screen-name="sprintly" rel="nofollow">@sprintly</a> <a class="tweet-url username" href="https://twitter.com/dropboxapi" data-screen-name="dropboxapi" rel="nofollow">@dropboxapi</a> <a class="tweet-url username" href="https://twitter.com/codeship" data-screen-name="codeship" rel="nofollow">@codeship</a> <a class="tweet-url username" href="https://twitter.com/transloadit" data-screen-name="transloadit" rel="nofollow">@transloadit</a>`)
  })
  test('should render tweet 647088863777832961 correctly', async () => {
    jest.setTimeout(20000)
    const tweet = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-647088863777832961.json`, 'utf-8'))
    expect((await enrichTweet(tweet))).toBe(`SponsorOfTheDay! We have giant love feelings for <a class="tweet-url username" href="https://twitter.com/transloadit" data-screen-name="transloadit" rel="nofollow">@transloadit</a>! And not just cuz that logo's cute as a bug. Thank you! \n\n<a href="https://pbs.twimg.com/media/CPrr5KQWwAAin58.png" rel="nofollow"><img class="tweet-media" src="https://pbs.twimg.com/media/CPrr5KQWwAAin58.png" /></a>`)
  })
  test('should render tweet 588610060810526720 correctly', async () => {
    jest.setTimeout(20000)
    const tweet = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-588610060810526720.json`, 'utf-8'))
    expect((await enrichTweet(tweet))).toBe(`Trying to process/thumbnail about 600k avatars in a few hours. Thank you <a class="tweet-url username" href="https://twitter.com/transloadit" data-screen-name="transloadit" rel="nofollow">@transloadit</a> <a class="tweet-url username" href="https://twitter.com/Prezly" data-screen-name="Prezly" rel="nofollow">@Prezly</a> \n\n<a href="https://pbs.twimg.com/ext_tw_video_thumb/588609941604171776/pu/img/657mRahs1TNqS0vw.jpg" rel="nofollow"><img class="tweet-media" src="https://pbs.twimg.com/ext_tw_video_thumb/588609941604171776/pu/img/657mRahs1TNqS0vw.jpg" /></a>`)
  })
  test('should render tweet 17139572739674112 correctly', async () => {
    jest.setTimeout(20000)
    const tweet = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-17139572739674112.json`, 'utf-8'))
    expect((await enrichTweet(tweet))).toBe(`Encode your videos faster ! nice piece of technology : <a href="http://transloadit.com/blog/2010/12/realtime-encoding-over-150x-faster/" rel="nofollow">http://transloadit.com/blog/2010/12/realtime-encoding-over-150x-faster/</a> <a href="https://twitter.com/search?q=%23video" title="#video" class="tweet-url hashtag" rel="nofollow">#video</a> <a href="https://twitter.com/search?q=%23encoding" title="#encoding" class="tweet-url hashtag" rel="nofollow">#encoding</a>`)
  })
  test('should render tweet 16955922978971648 correctly', async () => {
    jest.setTimeout(20000)
    const tweet = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-16955922978971648.json`, 'utf-8'))
    expect((await enrichTweet(tweet))).toBe(`Hey <a class="tweet-url username" href="https://twitter.com/YouTube" data-screen-name="YouTube" rel="nofollow">@YouTube</a>, <a class="tweet-url username" href="https://twitter.com/vimeo" data-screen-name="vimeo" rel="nofollow">@vimeo</a> and other video upload/sharing sites, offer <a class="tweet-url username" href="https://twitter.com/transloadit" data-screen-name="transloadit" rel="nofollow">@transloadit</a> a lot of money, now, quick <a href="https://news.ycombinator.com/item?id=2025354" rel="nofollow">https://news.ycombinator.com/item?id=2025354</a>`)
  })
  test('should not explode on undefined', async () => {
    jest.setTimeout(20000)
    expect((await enrichTweet(undefined))).toBe(undefined)
  })
  test('should not hang on non-shortened urls', async () => {
    jest.setTimeout(20000)
    const tweet = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-1087761082247204900-2.json`, 'utf-8'))
    expect((await enrichTweet(tweet))).toBe('<a href="https://twitter.com/TLStatus/status/1365465781467836417" rel="nofollow">https://twitter.com/TLStatus/status/1365465781467836417</a>')
  })
})
