const GithubService = require('./github.service');
const TwitterService = require('./twitter.service');
const io = require('./io');

const REPO_LIMIT = 10;

async function main() {
  const githubService = new GithubService();
  const twitterService = new TwitterService();

  const repositoryTweets = async (rep) => {
    return {rep, tweets: await twitterService.getTweets(rep.full_name)};
  };

  const twitterCredentials = io.readTwitterCredentials();
  await twitterService.authorize(twitterCredentials.consumerKey, twitterCredentials.consumerSecret);
  const githubCredentials = io.readGithubCredentials();
  if (githubCredentials) {
    githubService.authorize(githubCredentials.login, githubCredentials.password);
  }
  const query = io.readUserQuery();
  const repos = await githubService.getRepos(query);
  const promises = repos
    .slice(0, REPO_LIMIT)
    .map(repositoryTweets);
  for (const {rep, tweets} of await Promise.all(promises)) {
    io.printResult(rep, tweets);
  }
}

main().catch(console.error);
