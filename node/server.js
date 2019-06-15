const httpModule = require('http');
const urlModule = require('url');
const fsModule = require('fs');
const pathModule = require('path');

const baseUrl = 'http://fake';

const codeFileNotFound = 'ENOENT';

const httpCodeNotFound = 404;
const httpCodeServerError = 500;
const httpCodeSuccess = 200;

function createEndpointMap(handlerDir) {
    const retVal = new Map();

    const handlerFilenames = fsModule.readdirSync(handlerDir);
    for (const handlerFilename of handlerFilenames) {
        const handlerFile = pathModule.join(handlerDir, handlerFilename);
        const handler = require(handlerFile);
        const endpoints = handler.endpoints;
        if (endpoints === undefined) {
            throw `Handler does not define endpoints constant: ${handlerFile}`;
        }

        for (const endpoint in endpoints) {
            if (retVal.has(endpoint)) {
                throw `Endpoint is already registered: ${endpoint}`;
            }
            retVal.set(endpoint, endpoints[endpoint]);
        }
    }

    return retVal;
}

function handleResource(path, request, response) {
    const respond = (code, data) => {
        response.statusCode = code;
        response.write(data);
        response.end();
    };

    const handleError = (errCode) => {
        let responseCode = null;
        let responseData = null;
        if (errCode === codeFileNotFound) {
            responseCode = httpCodeNotFound;
            responseData = '<html>404 dude</html>';
        }
        else {
            responseCode = httpCodeServerError;
            responseData = '<html>500 bud</html>';
        }
        respond(responseCode, responseData);
    };

    const readFileCallback = (err, data) => {
        let responseCode = null;
        let responseData = null;
        if (err !== null) {
            handleError(err.code);
        }
        else {
            responseCode = httpCodeSuccess;
            responseData = data;
            respond(responseCode, responseData);
        }
    };

    const attemptPath = (path) => {
        const statCallback = (err, stats) => {
            if (err !== null) {
                handleError(err.code);
            }
            else {
                if (stats.isDirectory()) {
                    const newPath = path + '/index.html';
                    attemptPath(newPath);
                }
                else {
                    fsModule.readFile(path, readFileCallback);
                }
            }
        };

        fsModule.stat(path, statCallback);
    };

    attemptPath(path);
}

module.exports.createServer = (port, handlerDir, contentDir, context) => {
    const absHandlerDir = pathModule.resolve(handlerDir);
    const endpointMap = createEndpointMap(absHandlerDir);
    const absContentDir = pathModule.resolve(contentDir);
    const httpHandler = (request, response) => {
        const url = new urlModule.URL(request.url, baseUrl);
        const pathname = url.pathname;
        const possibleEndpoint = endpointMap.get(pathname);
        if (possibleEndpoint === undefined) {
            const absResourcePath = pathModule.join(absContentDir, pathname);
            handleResource(absResourcePath, request, response);
        }
        else {
            possibleEndpoint(request, response, context);
        }
    };
    const server = httpModule.createServer(httpHandler);
    server.listen(port);
    return server;
};
