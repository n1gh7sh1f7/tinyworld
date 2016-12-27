/*eslint no-console: 0*/
"use strict";

var express = require("express"),
    httpPort = process.env.PORT || 80,
    wsPort = 64080,
    app = express();

// start web socket server
var WebSocketServer = require("ws").Server,
    wss = new WebSocketServer({
        port: wsPort
    });

wss.broadcast = function (data) {
    for (var i in this.clients)
        this.clients[i].send(data);
    console.log("broadcasted: %s", data);
};

wss.on("connection", function (ws) {
    ws.on("message", function (message) {
        console.log("received: %s", message);
        wss.broadcast(message);
    });
    ws.send(JSON.stringify({
        user: "NODEJS",
        text: "Hallo from server"
    }));
});

// start http server
app.listen(httpPort, function () {
    console.log("HTTP Server: http://hxehost:" + httpPort);
    console.log("WS Server: ws://hxehost:" + wsPort);
});