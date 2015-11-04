import http from 'http';
import WS from 'ws';
import Swarm from 'swarm';

import Mouse from './Mouse.js';

let storage = new Swarm.FileStorage('storage');
let host = new Swarm.Host('swarm~nodejs', 0, storage);

let httpServer = http.createServer();
httpServer.listen(3000, function (err) {
  if (err) {
    console.warn('Can\'t start server. Error: ', err, err.stack);
    return;
  }
  console.log('Swarm server started at port 8000');
});

var wsServer = new WS.Server({server:httpServer});

// accept incoming WebSockets connections
wsServer.on('connection', function (sock) {
  console.log('new incoming WebSocket connection');
  host.accept(new Swarm.EinarosWSStream(sock), {delay: 50});
});
