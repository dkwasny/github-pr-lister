import { createListItem, createListSeparator, applyListObjects } from './list.js';

function setUsername() {
    const request = new XMLHttpRequest();
    request.open('GET', '/api/username');
    request.send();
    request.onload = function() {
        const username = request.response;
        const usernameElement = document.getElementById('kwas-username');
        usernameElement.innerText = username;
    };
}

setUsername();

const selectionElement = document.getElementById('list-container');
const listObjects = [
    createListItem('New', 'New pull requests you have yet to review', () => {}),
    createListItem('In Progress', 'Existing pull requests that need action', () => {}),
    createListSeparator(),
    createListItem('Approved', 'Pull requests you have approved', () => {}),
    createListItem('Denied', 'Denied pull requests that have no updates', () => {}),
    createListSeparator(),
    createListItem('All', 'All pull requests', () => {window.alert('all');}),
];
applyListObjects(selectionElement, listObjects);