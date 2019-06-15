const cliModule = require('./cli.js');
const serverModule = require('./server/server.js');
const fsModule = require('fs');
const urlModule = require('url');

const argParser = cliModule.createArgParser({
    c: true,
    s: true
});

const args = argParser(process.argv);

const configFile = args.c;
if (configFile === undefined) {
    throw 'Config file required';
}
const rawConfig = fsModule.readFileSync(configFile);
const jsonConfig = JSON.parse(rawConfig);

const secretsFile = args.s;
if (secretsFile === undefined) {
    throw 'Secrets file required';
}
const rawSecrets = fsModule.readFileSync(secretsFile);
const secrets = JSON.parse(rawSecrets);

const port = parseInt(jsonConfig.port);
const endpointDir = jsonConfig.endpointDir;
const resourceDir = jsonConfig.resourceDir;
const githubUsername = secrets.githubUsername;

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
    githubToken: secrets.githubToken,
    githubUsername: githubUsername
};

serverModule.createServer(port, endpointDir, resourceDir, context);
console.log('App Started');
