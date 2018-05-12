const gqlClientModule = require('../gql-client.js');

function pullrequests(request, response, context) {
    const pullRequestGql = context.pullRequestGql;
    const githubGqlUrl = context.githubGqlUrl;
    const githubToken = context.githubToken;
    const userAgent = context.githubUsername + '-app';

    const callback = (gqlResponse) => {
        response.setHeader('Content-Type', 'application/json');
        response.write(gqlResponse);
        response.end();
    };

    gqlClientModule.request(
        githubGqlUrl,
        githubToken,
        userAgent,
        pullRequestGql,
        {},
        callback
    );
}

module.exports.endpoints = {
    '/pullrequests': pullrequests
};
