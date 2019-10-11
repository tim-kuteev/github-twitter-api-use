const request = require('./request');

class GithubService {

  constructor() {
    this.login = 'unknown';
    this.credentials = null;
  }

  static get apiBaseUrl() {
    return 'https://api.github.com';
  }

  static deriveSearchUrl(query) {
    return `${GithubService.apiBaseUrl}/search/repositories?q=${encodeURIComponent(query)}+in:name`;
  }

  authorize(login, password) {
    this.login = login;
    const combinedKey = `${encodeURIComponent(login)}:${encodeURIComponent(password)}`;
    this.credentials = Buffer.from(combinedKey).toString('base64');
  }

  async getRepos(query) {
    const searchUrl = GithubService.deriveSearchUrl(query);
    const headers = {
      'User-Agent': this.login,
    };
    if (this.credentials) {
      headers['Authorization'] = 'Basic ' + this.credentials;
    }
    let res = await request(searchUrl, {
      method: 'GET',
      headers: headers,
    });
    return res.items;
  }
}

module.exports = GithubService;
