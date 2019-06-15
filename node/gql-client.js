const httpModule = require('http');
const httpsModule = require('https');

function request(url, token, userAgent, query, variables, callback) {
    let httpImpl = null;
    if (url.protocol === 'https:') {
        httpImpl = httpsModule;
    }
    else {
        httpImpl = httpModule;
    }

    const httpCallback = (resp) => {
        let responseBody = '';
        // TODO: What if a bad code comes back?
        resp.setEncoding('utf8');
        resp.on('data', (chunk) => {
            responseBody += chunk;
        });
        resp.on('end', () => {
            callback(responseBody);
        });
    };

    const requestObject = {
        query: query,
        variables: variables
    };

    const httpOptions = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
            'Authorization': `bearer ${token}`,
            'User-Agent': userAgent
        }
    };
    const httpRequest = httpImpl.request(httpOptions, httpCallback);
    httpRequest.end(JSON.stringify(requestObject));
}

module.exports.request = request;
