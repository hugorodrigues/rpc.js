/*
	rpc.js - Flatiron implementation
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Don't forget to run "npm install" to install Flatiron
*/

// Flatiron
var flatiron = require('flatiron'),
    app = flatiron.app;


// include rpc.js
var rpc = require('../../rpc.js');
rpc.schema = require('../example.schema.js');


app.use(flatiron.plugins.http);

app.router.post('/', function () {
	// Send request to rpc.js
	rpc.input(this.req.body.rpc,this.res);
});

// Serv UI static file
app.router.get('/help.html', function () {
	var self = this;
	require('fs').readFile("../../ui/help.html", function(error, content) { self.res.writeHead(200, { 'Content-Type': 'text/html' }); self.res.end(content, 'utf-8'); });
});

app.start(3000);
