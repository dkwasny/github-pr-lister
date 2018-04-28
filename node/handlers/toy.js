const urlModule = require('url');

const jsonContentType = 'application/json';
const baseUrl = 'http://fake';

const firstEndpoint = (request, response) => {
    const url = new urlModule.URL(request.url, baseUrl);
    const params = url.searchParams;
    console.log('P1 param: ' + params.get('p1'));

    response.setHeader('Content-Type', jsonContentType);
    response.write('{ "blah": "woo" }');
    response.end();
};

module.exports.endpoints = {
    '/toy/first': firstEndpoint
};
