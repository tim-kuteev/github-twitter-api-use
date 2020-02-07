const argv = require('minimist')(process.argv.slice(2));
const rl = require('readline-sync');

const DEFAULT_QUERY = 'Football';

const TEXT = {
  cyan: '\x1b[36m%s\x1b[0m',
  gray: '\x1b[90m%s\x1b[0m',
  bold: '\x1b[1m%s\x1b[0m',
  underline: '\x1b[4m%s\x1b[0m',
};

function readTwitterCredentials() {
  let consumerKey = argv.consumerkey || process.env.TWITTER_API_CONSUMER_KEY;
  let consumerSecret = argv.consumersecret || process.env.TWITTER_API_CONSUMER_SECRET;
  if (consumerKey && consumerSecret) {
    return {consumerKey, consumerSecret};
  }
  console.log('\nTwitter credentials are required to use API.');
  consumerKey = consumerKey || rl.question('Consumer Key: ', {hideEchoBack: true});
  consumerSecret = consumerSecret || rl.question('Consumer Secret: ', {hideEchoBack: true});
  return {consumerKey, consumerSecret};
}

function readGithubCredentials() {
  let login = argv.githublogin;
  let password = argv.githubpassword;
  if (login && password) {
    return {login, password};
  }
  console.log('\nGithub Search API applies rate limits:\n' +
    'For authenticated requests, you can make up to 30 requests per minute.\n' +
    'For unauthenticated requests, the rate limit allows you to make up to 10 requests per minute.');
  if (rl.keyInYN('Would you like to use your Github credentials?')) {
    login = login || rl.question('Login: ');
    password = password || rl.question('Password: ', {hideEchoBack: true});
    return {login, password};
  }
}

function readUserQuery() {
  return argv.query || rl.question(`\nEnter your query (${DEFAULT_QUERY}): `) || DEFAULT_QUERY;
}

function printResult(rep, tweets) {
  console.log(`\n${TEXT.cyan} ${TEXT.underline}`, 'Repository:', rep.full_name);
  rep.description && console.log(rep.description);
  rep.homepage && console.log(rep.homepage);
  console.log('Language: %s, Stars: %s, Open Issues: %s\n', rep.language, rep.stargazers_count, rep.open_issues);

  if (tweets.length) {
    console.log(TEXT.bold, 'Tweets:');
    for (let tweet of tweets) {
      console.log(`\n${TEXT.underline}`, tweet.user.screen_name);
      console.log(TEXT.gray, tweet.text);
    }
  } else {
    console.log(TEXT.gray, 'No tweets found');
  }
  console.log();
}

module.exports = {
  readTwitterCredentials,
  readGithubCredentials,
  readUserQuery,
  printResult,
};
