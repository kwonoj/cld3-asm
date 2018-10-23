//tslint:disable: no-require-imports no-var-requires no-console
const connect = require('connect');
const serveStatic = require('serve-static');
const path = require('path');

connect()
  .use(serveStatic(path.resolve(__dirname, 'dist')))
  .listen(8888, function() {
    console.log('Server running on 8888...');
  });
