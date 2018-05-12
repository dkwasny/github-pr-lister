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

    let responseBody = '';
    const httpCallback = (resp) => {
        resp.setEncoding('utf8');
        resp.on('readable', () => {
            responseBody += resp.read();
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
