const approvedAction = 'APPROVED';
const declinedAction = 'CHANGES_REQUESTED';

function isOwnedByUser(pullRequest, username) {
    return pullRequest.author.username === username;
}

function getUsersReviews(pullRequest, username) {
    return pullRequest.reviews
        .filter((x) => x.reviewer.username === username);
}

function getLatestTimeForAction(pullRequest, username, action) {
    return Math.max(
        getUsersReviews(pullRequest, username)
            .filter((x) => x.action === action)
            .map((x) => x.time)
    );
}

export function newPullRequests(username) {
    return (pullRequest) => {
        return !isOwnedByUser(pullRequest, username)
            && pullRequest.reviewRequests.some((x) => x.username === username);
    };
}

export function inProgressPullRequests(username) {
    return (pullRequest) => {
        const latestPushTime = pullRequest.latestPushTime;
        const latestDeclineTime = getLatestTimeForAction(pullRequest, username, declinedAction);
        return !isOwnedByUser(pullRequest, username)
            && !newPullRequests(username)(pullRequest)
            && !approvedPullRequests(username)(pullRequest)
            && latestPushTime > latestDeclineTime;
    };
}

export function approvedPullRequests(username) {
    return (pullRequest) => {
        const latestApprovalTime = getLatestTimeForAction(pullRequest, username, approvedAction);
        const latestDeclineTime = getLatestTimeForAction(pullRequest, username, declinedAction);
        return !isOwnedByUser(pullRequest, username)
            && latestApprovalTime > latestDeclineTime;
    };
}

export function declinedPullRequests(username) {
    return (pullRequest) => {
        const latestApprovalTime = getLatestTimeForAction(pullRequest, username, approvedAction);
        const latestDeclineTime = getLatestTimeForAction(pullRequest, username, declinedAction);
        return !isOwnedByUser(pullRequest, username)
            && latestDeclineTime > latestApprovalTime;
    };
}

export function ownedPullRequests(username) {
    return (pullRequest) => {
        return isOwnedByUser(pullRequest, username);
    };
}

export function allPullRequests() {
    return () => { return true; };
}