const enrichTweet = require('./enrichTweet')
const fs = require('fs')

describe('enrichTweet', () => {
  test('TWEET_1087761082247204900', async () => {
    jest.setTimeout(20000)
    const TWEET_1087761082247204900 = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-1087761082247204900.json`, 'utf-8'))
    const txt = `In the age of cloud, <a class="tweet-url username" href="https://twitter.com/transloadit" data-screen-name="transloadit" rel="nofollow">@transloadit</a> shows great balance of leaning on larger clouds while managing infra in-house <a class="tweet-url username" href="https://twitter.com/kvz" data-screen-name="kvz" rel="nofollow">@kvz</a> \n<a href="https://transloadit.com/blog/2018/12/launching-asia-pacific-and-network-changes/" rel="nofollow">https://transloadit.com/blog/2018/12/launching-asia-pacific-and-network-changes/</a> \n<a href="https://pbs.twimg.com/media/DxiA8ElX4AA4hQ6.jpg" rel="nofollow">https://pbs.twimg.com/media/DxiA8ElX4AA4hQ6.jpg</a>`
    expect((await enrichTweet(TWEET_1087761082247204900))).toBe(txt)
  })
  test('TWEET_1082897509528281089', async () => {
    jest.setTimeout(20000)
    const TWEET_1082897509528281089 = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-1082897509528281089.json`, 'utf-8'))
    const txt = `Just realized how <a class="tweet-url username" href="https://twitter.com/tus_io" data-screen-name="tus_io" rel="nofollow">@tus_io</a> and <a class="tweet-url username" href="https://twitter.com/uppy_io" data-screen-name="uppy_io" rel="nofollow">@uppy_io</a> are a perfect example of <a class="tweet-url username" href="https://twitter.com/transloadit" data-screen-name="transloadit" rel="nofollow">@transloadit</a> commoditizing their complements: <a href="https://www.gwern.net/Complement" rel="nofollow">https://www.gwern.net/Complement</a>`
    expect((await enrichTweet(TWEET_1082897509528281089))).toBe(txt)
  })
  test('TWEET_389922139408592896', async () => {
    jest.setTimeout(20000)
    const TWEET_389922139408592896 = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-389922139408592896.json`, 'utf-8'))

    const txt = `Don't understand why anyone messes with carrierwave / paperclip / whatever anymore. <a class=\"tweet-url username\" href=\"https://twitter.com/transloadit\" data-screen-name=\"transloadit\" rel=\"nofollow\">@transloadit</a> is just too easy. <a href=\"https://transloadit.com/r/wGN\" rel=\"nofollow\">https://transloadit.com/r/wGN</a>`
    expect((await enrichTweet(TWEET_389922139408592896))).toBe(txt)
  })
  test('TWEET_558414704024899584', async () => {
    jest.setTimeout(20000)
    const TWEET_558414704024899584 = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-558414704024899584.json`, 'utf-8'))

    const txt = `Thank the sponsors! <a href=\"http://2015.staticshowdown.com/sponsors\" rel=\"nofollow\">http://2015.staticshowdown.com/sponsors</a> <a class=\"tweet-url username\" href=\"https://twitter.com/polymer\" data-screen-name=\"polymer\" rel=\"nofollow\">@polymer</a> <a class=\"tweet-url username\" href=\"https://twitter.com/BloombergBeta\" data-screen-name=\"BloombergBeta\" rel=\"nofollow\">@BloombergBeta</a> <a class=\"tweet-url username\" href=\"https://twitter.com/Firebase\" data-screen-name=\"Firebase\" rel=\"nofollow\">@Firebase</a> <a class=\"tweet-url username\" href=\"https://twitter.com/MaxCDNDeveloper\" data-screen-name=\"MaxCDNDeveloper\" rel=\"nofollow\">@MaxCDNDeveloper</a> <a class=\"tweet-url username\" href=\"https://twitter.com/sprintly\" data-screen-name=\"sprintly\" rel=\"nofollow\">@sprintly</a> <a class=\"tweet-url username\" href=\"https://twitter.com/dropboxapi\" data-screen-name=\"dropboxapi\" rel=\"nofollow\">@dropboxapi</a> <a class=\"tweet-url username\" href=\"https://twitter.com/codeship\" data-screen-name=\"codeship\" rel=\"nofollow\">@codeship</a> <a class=\"tweet-url username\" href=\"https://twitter.com/transloadit\" data-screen-name=\"transloadit\" rel=\"nofollow\">@transloadit</a>`
    expect((await enrichTweet(TWEET_558414704024899584))).toBe(txt)
  })
  test('TWEET_647088863777832961', async () => {
    jest.setTimeout(20000)
    const TWEET_647088863777832961 = JSON.parse(fs.readFileSync(`${__dirname}/enrichTweet.fixture-647088863777832961.json`, 'utf-8'))

    const txt = `SponsorOfTheDay! We have giant love feelings for <a class="tweet-url username" href="https://twitter.com/transloadit" data-screen-name="transloadit" rel="nofollow">@transloadit</a>! And not just cuz that logo's cute as a bug. Thank you! \n<a href="https://pbs.twimg.com/media/CPrr5KQWwAAin58.png" rel="nofollow">https://pbs.twimg.com/media/CPrr5KQWwAAin58.png</a>`
    expect((await enrichTweet(TWEET_647088863777832961))).toBe(txt)
  })
})
