'use strict';

var assert = require('assert');
var argv = require('./argv');

var envName = typeof argv.env === 'string' ? argv.env : 'prod';

var ENV = require('./.env.'+envName+'.js');

assert(ENV.name === envName, 'ENV.name for env '+envName+' is not correct.');

module.exports = ENV;