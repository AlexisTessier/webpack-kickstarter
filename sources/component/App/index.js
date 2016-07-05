require('generic');

require('assets');

require('tools/modernizr');

require('./App.styl');

export let appAware = require('./App.jsx').appAware;

export default require('./App.jsx').default;