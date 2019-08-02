const fsModule = require('fs');
const gqlClientModule = require('../gql-client.js');

let cachedGqlResponse = '';
let cachedTime = 0;

function parseTime(input) {
    return new Date(input).getTime();
}

function parseUser(input) {
    return {
        username: input.login,
        avatarUrl: input.avatarUrl
    };
}

function parseReview(input) {
    return {
        reviewer: parseUser(input.author),
        action: input.state,
        time: parseTime(input.submittedAt)
    };
}

function parseReviewRequest(input) {
    return parseUser(input.requestedReviewer);
}

function getLatestPushTime(input) {
    return Math.max(...(input.map((x) => parseTime(x.commit.pushedDate))));
}

function parsePR(input) {
    return {
        title: input.title,
        url: input.url,
        repository: input.repository.name,
        author: parseUser(input.author),
        assignees: input.assignees.nodes.map(parseUser),
        reviews: input.reviews.nodes.map(parseReview),
        reviewRequests: input.reviewRequests.nodes
            .filter((x) => x.requestedReviewer != null)
            .map(parseReviewRequest),
        latestPushTime: getLatestPushTime(input.commits.nodes)
    };
}

function parsePRList(rawInput) {
    const rawObject = JSON.parse(rawInput);
    return rawObject.data.search.nodes.map(parsePR);
}

function callGithub(callback, context) {
    const now = Date.now();
    const cacheTimeout = context.cacheTimeoutSeconds * 1000;
    if (now - cachedTime > cacheTimeout) {
        const pullRequestGql = context.pullRequestGql;
        const githubGqlUrl = context.githubGqlUrl;
        const githubToken = context.githubToken;
        const userAgent = context.githubUsername + '-app';
        const cacherCallback = (gqlResponse) => {
            cachedGqlResponse = gqlResponse;
            cachedTime = now;
            callback(gqlResponse);
        };
        gqlClientModule.request(
            githubGqlUrl,
            githubToken,
            userAgent,
            pullRequestGql,
            {},
            cacherCallback
        );
    }
    else {
        callback(cachedGqlResponse);
    }
}

function pullrequests(request, response, context) {
    const callback = (gqlResponse) => {
        const prList = parsePRList(gqlResponse);
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(prList));
        response.end();
    };
    callGithub(callback, context);
}

function pullrequestsRaw(request, response, context) {
    const callback = (gqlResponse) => {
        response.setHeader('Content-Type', 'application/json');
        response.write(gqlResponse);
        response.end();
    };
    callGithub(callback, context);
}

function pullrequestsTest(request, response, context) {
    fsModule.readFile(context.testResponseFile, (err, data) => {
        response.setHeader('Content-Type', 'application/json');
        response.write(data);
        response.end();
    });
}

module.exports.paths = {
    '/pullrequests': pullrequests,
    '/pullrequests/raw': pullrequestsRaw,
    '/pullrequests/test': pullrequestsTest
};
