/*
	rpc.js - Flatiron implementation
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Don't forget to run "npm install" to install Flatiron
*/

// Flatiron
var flatiron = require('flatiron'),
    app = flatiron.app;
	app.use(flatiron.plugins.http);


// include rpc.js
var rpc = require('../../rpc.js');
rpc.schema = require('../example.schema.js');

// Serv UI static file
app.router.get('/help', function () {

	this.res.end( rpc.uiHtml() );

});

app.router.post('/', function () {

	var flat = this;

	// Send request to rpc.js
	rpc.input({
		textInput: flat.req.body.rpc,
		callback: function(output) {

			flat.res.writeHead(200, {'Content-Type': 'application/json'});
			flat.res.end(JSON.stringify(output));

		}
	});

});



app.start(3000);
