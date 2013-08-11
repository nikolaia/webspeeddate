var holla = require('holla')
	, express = require('express')
	, http = require('http')
	, path = require('path');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 8180);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('public/js', express.static(path.join(__dirname, 'public/js')));
    app.use('public/css', express.static(path.join(__dirname, 'public/css')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
	var rtc = holla.createServer(this);
	console.log("Express server listening on port " + app.get('port'));
});