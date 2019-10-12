const request = require('./request');

class TwitterService {

  constructor() {
    this.accessToken = null;
  }

  static get apiBaseUrl() {
    return 'https://api.twitter.com';
  }

  static get oauthUrl() {
    return `${TwitterService.apiBaseUrl}/oauth2/token?grant_type=client_credentials`;
  }

  static deriveSearchUrl(query) {
    query += ' AND -filter:retweets';
    return `${TwitterService.apiBaseUrl}/1.1/search/tweets.json?q=${encodeURIComponent(query)}`;
  }

  static encodeCredentials(consumerKey, consumerSecret) {
    const combinedKey = `${encodeURIComponent(consumerKey)}:${encodeURIComponent(consumerSecret)}`;
    return Buffer.from(combinedKey).toString('base64');
  }

  async authorize(consumerKey, consumerSecret) {
    let res = await request(TwitterService.oauthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Basic ' + TwitterService.encodeCredentials(consumerKey, consumerSecret),
      },
    });
    if (res.token_type !== 'bearer') {
      throw new Error('Unable to retrieve Twitter credentials');
    }
    this.accessToken = res.access_token;
  }

  async getTweets(query) {
    if (!this.accessToken) {
      throw new Error('Authentication is required to use Twitter API');
    }
    const searchUrl = TwitterService.deriveSearchUrl(query);
    let res = await request(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
      },
    });
    return res.statuses;
  }
}

module.exports = TwitterService;
