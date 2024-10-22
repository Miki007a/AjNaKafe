var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from your frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

var Redis = require('ioredis');
var redis = new Redis({
  host: '172.22.178.245',  // Use your WSL IP address
  port: 6379               // Default Redis port
});
redis.subscribe('test-channel', function () {
  console.log('Redis: test-channel subscribed');
});
redis.on('message', function(channel, message) {
  console.log('Message Received: ' + message);
  message = JSON.parse(message);
  io.emit(channel + ':' + message.event, message.data);
});

http.listen(6001, function(){
  console.log('Listening on Port 6001');
});
