var readline = require('readline');
var COLOR_SCHEME = require('./color_scheme');
var Hill = require('./hill');

var decode = process.env.DECODE || false;
var key = process.env.KEY || 'GYBNQKURP';

var rli = readline.createInterface(process.stdin, process.stdout);
var hill = new Hill(decode, key, rli);

console.log(COLOR_SCHEME.info(`${decode ? 'Decode' : 'Encode'} message:`));
rli.setPrompt('> ');
rli.prompt();

rli.on('line', hill.process.bind(hill));

rli.on('SIGINT', () => {
    process.exit(0);
});