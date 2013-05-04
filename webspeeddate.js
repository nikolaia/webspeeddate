var holla = require('holla');
var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.sendfile("./client/index.html");
});

app.get('/:file', function(req, res){
	var file = req.params.file
	res.sendfile("./client/"+file);
});

var server = require('http').createServer(app).listen(8180);
var rtc = holla.createServer(server);

console.log('Server running on port 8180');