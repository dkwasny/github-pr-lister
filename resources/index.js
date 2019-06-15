function setUsername() {
    const request = new XMLHttpRequest();
    request.open('GET', '/api/username');
    request.send();
    request.onload = function() {
        const username = request.response;
        const usernameElement = document.getElementById('kwas-username');
        usernameElement.innerText = username;
    }
}

setUsername();