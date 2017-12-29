
const express = require('express');
const http = require('http');
const WebSocketServer = require('ws').Server;
const ip = require('ip').address();
const chalk = require('chalk');
const app = express();
const open = require("open");

app.use(express.static('./'));

const server = http.createServer(app);
const wss = new WebSocketServer({server});

let clients = [];

wss.on('connection', function(ws) {
    clients.push(ws);
    ws.on('message', function(message) {
        clients.forEach(function(ws1){
            if(ws1 !== ws) {
                ws1.send(message);
            }
       })
    });

    ws.on('close', function(message) {
        clients = clients.filter(function(ws1){
            return ws1 !== ws
        })
    });
});

server.listen(8080, function listening() {
  const url = 'http://'+ ip + ':' + server.address().port;
  const wsurl = 'ws://'+ ip + ':' + server.address().port;
  console.log('Static server:')
  console.log(chalk.green(url));
  console.log('You can test websocket:')
  console.log(chalk.green(wsurl));
  console.log('Message examples:');
  console.log(`{"method":"WXReloadBundle", "params": "http://dotwe.org/raw/dist/135a604e06e0fb246fe098924b36bfbc.bundle.wx"}`)
  console.log(`{"method":"WXReload"}`)
  open(url)
});