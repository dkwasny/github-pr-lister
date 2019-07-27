function createHeader(text) {
    const retVal = document.createElement('th');
    retVal.classList.add('pr-header-container');
    retVal.textContent = text;
    return retVal;
}

function createCell() {
    const retVal = document.createElement('td');
    retVal.classList.add('pr-data-container');
    return retVal;
}

function renderActualPullRequests(pullRequests, container) {
    const table = document.createElement('table');
    table.classList.add('pr-table');

    const headerRow = document.createElement('tr');
    headerRow.appendChild(createHeader('User'));
    headerRow.appendChild(createHeader('Repository'));
    headerRow.appendChild(createHeader('Pull Request'));
    headerRow.appendChild(createHeader('Last Push'));
    table.appendChild(headerRow);

    for (const pullRequest of pullRequests) {
        const row = document.createElement('tr');

        const userCell = createCell();
        userCell.classList.add('pr-image-container');
        const userImage = document.createElement('img');
        userImage.src = pullRequest.author.avatarUrl;
        userImage.title = pullRequest.author.username;
        userImage.classList.add('pr-image');
        userCell.appendChild(userImage);
        row.appendChild(userCell);

        const repoNameCell = createCell();
        repoNameCell.classList.add('pr-repo-name-container');
        repoNameCell.textContent = pullRequest.repository;
        row.appendChild(repoNameCell);
        
        const pullRequestNameCell = createCell();
        pullRequestNameCell.classList.add('pr-name-container');
        const pullRequestName = document.createElement('a');
        pullRequestName.href = pullRequest.url;
        pullRequestName.text = pullRequest.title;
        pullRequestName.classList.add('pr-name');
        pullRequestNameCell.appendChild(pullRequestName);
        row.appendChild(pullRequestNameCell);

        const lastPushCell = createCell();
        lastPushCell.classList.add('pr-last-push-container');
        const pushDate = new Date(pullRequest.latestPushTime);
        lastPushCell.textContent = pushDate.toLocaleString();
        row.appendChild(lastPushCell);

        table.appendChild(row);
    }

    container.appendChild(table);
}

function renderEmptyMessage(container) {
    const message = document.createElement('div');
    message.classList.add('empty-message');
    message.textContent = 'No pull requests found';
    container.appendChild(message);
}

export function renderPullRequests(pullRequests, container) {
    container.innerHTML = '';
    if (pullRequests.length) {
        renderActualPullRequests(pullRequests, container);
    }
    else {
        renderEmptyMessage(container);
    }
}