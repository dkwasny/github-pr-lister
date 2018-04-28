const httpModule = require('http');
const urlModule = require('url');
const fsModule = require('fs');
const pathModule = require('path');

const baseUrl = 'http://fake';

const codeFileNotFound = 'ENOENT';
const codeDirNotFound = 'ENOTDIR';

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
    const callback = (err, data) => {
        let responseCode = null;
        let responseData = null;
        if (err !== null) {
            console.error(`Error reading resource: ${err}`);
            const errCode = err.code;
            if (errCode === codeFileNotFound || errCode === codeDirNotFound) {
                responseCode = httpCodeNotFound;
                responseData = '<html>404 dude</html>';
            }
            else {
                responseCode = httpCodeServerError;
                responseData = '<html>500 bud</html>';
            }
        }
        else {
            responseCode = httpCodeSuccess;
            responseData = data;
        }

        response.statusCode = responseCode;
        response.write(responseData);
        response.end();
    };

    fsModule.readFile(path, callback);
}

module.exports.createServer = (port, handlerDir, contentDir) => {
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
            possibleEndpoint(request, response);
        }
    };
    const server = httpModule.createServer(httpHandler);
    server.listen(port);
    return server;
};
