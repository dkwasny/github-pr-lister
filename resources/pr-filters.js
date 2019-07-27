const approvedAction = 'APPROVED';
const declinedAction = 'CHANGES_REQUESTED';

function getUsersReviews(pullRequest, username) {
    return pullRequest.reviews
        .filter((x) => x.reviewer.username === username );
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
        return pullRequest.reviewRequests.some((x) => x.username === username);
    };
}

export function inProgressPullRequests(username) {
    return (pullRequest) => {
        const latestPushTime = pullRequest.latestPushTime;
        const latestDeclineTime = getLatestTimeForAction(pullRequest, username, declinedAction);
        return !newPullRequests(username)(pullRequest)
            && !approvedPullRequests(username)(pullRequest)
            && latestPushTime > latestDeclineTime;
    };
}

export function approvedPullRequests(username) {
    return (pullRequest) => {
        const latestApprovalTime = getLatestTimeForAction(pullRequest, username, approvedAction);
        const latestDeclineTime = getLatestTimeForAction(pullRequest, username, declinedAction);
        return latestApprovalTime > latestDeclineTime;
    };
}

export function declinedPullRequests(username) {
    return (pullRequest) => {
        const latestApprovalTime = getLatestTimeForAction(pullRequest, username, approvedAction);
        const latestDeclineTime = getLatestTimeForAction(pullRequest, username, declinedAction);
        return latestDeclineTime > latestApprovalTime;
    };
}

export function allPullRequests() {
    return () => { return true; };
}