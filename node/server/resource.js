const fsModule = require('fs');

const mimeTypeMap = new Map(
    [
        ['js', 'text/javascript'],
        ['html', 'text/html'],
        ['css', 'text/css'],
        ['ico', 'image/x-icon'],
        ['json', 'application/json']
    ]
);

const httpCodeNotFound = 404;
const httpCodeServerError = 500;
const httpCodeSuccess = 200;

const codeFileNotFound = 'ENOENT';

function getMimeType(path) {
    const lastIndexOfPeriod = path.lastIndexOf('.');
    if (lastIndexOfPeriod === -1) {
        return null;
    }
    else {
        const extension = path.substring(lastIndexOfPeriod + 1, path.length);
        return mimeTypeMap.has(extension) ? mimeTypeMap.get(extension) : null;
    }
}

function handleResource(path, request, response) {
    const respond = (code, data, mimeType) => {
        response.statusCode = code;
        if (mimeType !== null) {
            response.setHeader('Content-Type', mimeType);
        }
        response.write(data);
        response.end();
    };

    const handleError = (errCode) => {
        let responseCode = null;
        let responseData = null;
        if (errCode === codeFileNotFound) {
            responseCode = httpCodeNotFound;
            responseData = '<meta charset="UTF-8"><html>404 dude</html>';
        }
        else {
            responseCode = httpCodeServerError;
            responseData = '<meta charset="UTF-8"><html>500 bud</html>';
        }
        respond(responseCode, responseData, 'text/html');
    };

    const readFileAndRespond = (path) => {
        const readFileCallback = (err, data) => {
            let responseCode = null;
            let responseData = null;
            if (err !== null) {
                handleError(err.code);
            }
            else {
                const mimeType = getMimeType(path);
                responseCode = httpCodeSuccess;
                responseData = data;
                respond(responseCode, responseData, mimeType);
            }
        };
        fsModule.readFile(path, readFileCallback);
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
                    readFileAndRespond(path);
                }
            }
        };

        fsModule.stat(path, statCallback);
    };

    attemptPath(path);
}

module.exports.handleResource = handleResource;