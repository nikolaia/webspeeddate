var holla = require('holla')
	, express = require('express')
	, http = require('http')
  , https = require('https')
	, path = require('path')
  , fs = require('fs');

var app = express();

var options = {
    cert: fs.readFileSync('cert/test.webspeeddate.net.crt'),
    ca: fs.readFileSync('cert/gd_bundle-g2.crt'),
    key: fs.readFileSync('cert/key.pem'),
    requestCert:        true,
    rejectUnauthorized: false
};

app.configure(function(){
  app.set('port', process.env.PORT || 8180);
  //app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('public/js', express.static(path.join(__dirname, 'public/js')));
  app.use('public/css', express.static(path.join(__dirname, 'public/css')));
});

//using http to forward to https, reason is we need another certificate for interncommunication with iis, i have no idea how to set that up!
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("<script> window.location = 'https://test.webspeeddate.net:8180'; </script>");
  res.end();
}).listen(8181);

app.get("/call/:id", function(req,res) { 
  res.send("<b>working</b> call yes : " + req.params.id);
});

https.createServer(options,app).listen(app.get('port'), function(){
	var rtc = holla.createServer(this);
	console.log("Express server listening on port " + app.get('port'));
});