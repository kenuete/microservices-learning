#!/usr/bin/env node
'use strict';

var http = require('http');

var config = require('../config')[process.env.NODE_ENV || 'development'];

var log = config.log();
var service = require('../server/service')(config);

var server = http.createServer(service);

server.listen(process.env.PORT || 3000);

server.on('listening', function () {
  log.info('Hi there! I\'m listening on port ' + server.address().port + ' in ' + service.get('env') + ' mode.');
});
//# sourceMappingURL=run.js.map