const fsModule = require('fs');
const pathModule = require('path');

function createEndpointMap(handlerDir, pathBase) {
    const retVal = new Map();

    const handlerFilenames = fsModule.readdirSync(handlerDir);
    for (const handlerFilename of handlerFilenames) {
        const handlerFile = pathModule.join(handlerDir, handlerFilename);
        const handler = require(handlerFile);
        const paths = handler.paths;
        if (paths === undefined) {
            throw `Handler does not define the paths constant: ${handlerFile}`;
        }

        for (const path in paths) {
            const fullPath = pathBase + path;
            if (retVal.has(fullPath)) {
                throw `Endpoint is already registered: ${fullPath}`;
            }
            retVal.set(fullPath, paths[path]);
        }
    }

    return retVal;
}

function createEndpointHandler(handlerDir, pathBase) {
    const endpointMap = createEndpointMap(handlerDir, pathBase);

    const canHandle = (path) => {
        return endpointMap.has(path);
    };

    const handle = (path, request, response, context) => {
        const endpoint = endpointMap.get(path);
        endpoint(request, response, context);
    };

    return {
        canHandle: canHandle,
        handle: handle
    };
}

module.exports.createEndpointHandler = createEndpointHandler;