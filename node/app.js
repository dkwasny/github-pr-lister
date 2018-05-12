const cliModule = require('./cli.js');
const serverModule = require('./server.js');
const fsModule = require('fs');
const urlModule = require('url');

const argParser = cliModule.createArgParser({
    c: true
});

const args = argParser(process.argv);
const configFile = args.c;
if (configFile === undefined) {
    throw 'Config file required';
}
const rawConfig = fsModule.readFileSync(configFile);
const jsonConfig = JSON.parse(rawConfig);

const port = parseInt(jsonConfig.port);
const handlerDir = jsonConfig.handlerDir;
const contentDir = jsonConfig.contentDir;
const githubUsername = jsonConfig.githubUsername;

const githubGqlUrl = new urlModule.URL(jsonConfig.githubGqlUrl);
const pullRequestGqlFile = jsonConfig.pullRequestGql;
const rawPullRequestGql = fsModule.readFileSync(
    pullRequestGqlFile,
    { encoding: 'utf8' }
);
const pullRequestGql = rawPullRequestGql
    .replace(/\r?\n/g, '')
    .replace('$USERNAME', githubUsername);

const context = {
    pullRequestGql: pullRequestGql,
    githubGqlUrl: githubGqlUrl,
    githubToken: jsonConfig.githubToken,
    githubUsername: githubUsername
};

serverModule.createServer(port, handlerDir, contentDir, context);
console.log('App Started');
