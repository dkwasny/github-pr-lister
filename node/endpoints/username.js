function username(request, response, context) {
    const username = context.githubUsername;
    response.setHeader('Content-Type', 'text/plain');
    response.write(username);
    response.end();
}

module.exports.paths = {
    '/username': username
};