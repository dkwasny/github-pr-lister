const httpModule = require('http');
const urlModule = require('url');
const pathModule = require('path');
const resourceModule = require('./resource.js');
const endpointModule = require('./endpoint.js');

const baseUrl = 'http://fake';

module.exports.createServer = (port, handlerDir, contentDir, context) => {
    const absHandlerDir = pathModule.resolve(handlerDir);
    const absContentDir = pathModule.resolve(contentDir);
    const endpointHandler = endpointModule.createEndpointHandler(absHandlerDir, '/api');
    const httpHandler = (request, response) => {
        response.setHeader('Content-Security-Policy', 'default-src \'self\'');
        const url = new urlModule.URL(request.url, baseUrl);
        const pathname = url.pathname;
        if (endpointHandler.canHandle(pathname)) {
            endpointHandler.handle(pathname, request, response, context);
        }
        else {
            const absResourcePath = pathModule.join(absContentDir, pathname);
            resourceModule.handleResource(absResourcePath, request, response);
        }
    };
    const server = httpModule.createServer(httpHandler);
    server.listen(port);
    return server;
};
