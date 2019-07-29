import { ListCreator } from './list.js';
import { renderPullRequests } from './table.js';
import { newPullRequests, allPullRequests, approvedPullRequests, inProgressPullRequests, declinedPullRequests, ownedPullRequests } from './pr-filters.js';
import { attachColorChangeHandler } from './stylesheet.js';

let cachedUsername = '';

(function () {
    const request = new XMLHttpRequest();
    request.open('GET', '/api/username');
    request.send();
    request.onload = function() {
        const username = request.response;
        const usernameElement = document.getElementById('username');
        usernameElement.textContent = username;
        cachedUsername = username;
    };
})();

const displayElement = document.getElementById('pull-requests');

function newClickHandler(filterCreator) {
    return () => {
        displayElement.textContent = 'Loading...';
        const request = new XMLHttpRequest();
        request.open('GET', '/api/pullrequests');
        request.send();
        request.onload = function() {
            const response = request.response;
            const allPrs = JSON.parse(response);
            const filter = filterCreator(cachedUsername);
            const prsToDisplay = allPrs.filter(filter);
            renderPullRequests(prsToDisplay, displayElement);
        };
    };
}

const listCreator = new ListCreator('menu-');
listCreator.addItem('New', 'New pull requests you have yet to review', newClickHandler(newPullRequests));
listCreator.addItem('In Progress', 'Existing pull requests that need action', newClickHandler(inProgressPullRequests));
listCreator.addSeparator();
listCreator.addItem('Approved', 'Pull requests you have approved', newClickHandler(approvedPullRequests));
listCreator.addItem('Declined', 'Declined pull requests that have no updates', newClickHandler(declinedPullRequests));
listCreator.addItem('Owned', 'Pull requests owned by you', newClickHandler(ownedPullRequests));
listCreator.addSeparator();
listCreator.addItem('All', 'All pull requests', newClickHandler(allPullRequests));

const selectionElement = document.getElementById('selection');
listCreator.applyToElement(selectionElement);

attachColorChangeHandler(document.getElementById('username'));
