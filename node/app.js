const cliModule = require('./cli.js');
const serverModule = require('./server.js');
const fsModule = require('fs');

const argParser = cliModule.createArgParser({
    c: true
});

const args = argParser(process.argv);
const configFile = args.c;
if (configFile === undefined) {
    throw 'Config file required';
}
const rawConfig = fsModule.readFileSync(configFile);
const jsonConfig = JSON.parse(rawConfig);

const port = parseInt(jsonConfig.port);
const handlerDir = jsonConfig.handlerDir;
const contentDir = jsonConfig.contentDir;

serverModule.createServer(port, handlerDir, contentDir);
console.log('App Started');
