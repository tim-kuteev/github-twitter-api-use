const GithubService = require('./github.service');
const TwitterService = require('./twitter.service');
const io = require('./io');

const REPO_LIMIT = 10;

async function main() {
  const githubService = new GithubService();
  const twitterService = new TwitterService();

  const twitterCredentials = io.readTwitterCredentials();
  await twitterService.authorize(twitterCredentials.consumerKey, twitterCredentials.consumerSecret);
  const githubCredentials = io.readGithubCredentials();
  if (githubCredentials) {
    githubService.authorize(githubCredentials.login, githubCredentials.password);
  }

  const query = io.readUserQuery();
  const repos = await githubService.getRepos(query);
  for (let rep of repos.slice(0, REPO_LIMIT)) {
    io.printRepository(rep);
    const tweets = await twitterService.getTweets(rep.full_name);
    io.printTweets(tweets);
  }
}

main().catch(err => console.log('An error has occurred:', err));
