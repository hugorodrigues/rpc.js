/*
	rpc.js - Flatiron implementation
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Don't forget to run "npm install" to install Flatiron
*/

// Flatiron
var flatiron = require('flatiron'),
    app = flatiron.app;
	app.use(flatiron.plugins.http);


// Load rpc.js 
var rpc = require('../../rpc.js');

// Setup your schema
var rpcJs = rpc.gateway({
	schema: require('../example.schema.js')
});


// Serv UI static file
app.router.get('/help', function () {
	this.res.end( rpcJs.uiHtml() );
});


app.router.post('/', function () {

	var flatiron = this;

	// Send request to rpc.js
	rpcJs.input({
		textInput: flatiron.req.body.rpc,
		callback: function(output) {

			flatiron.res.writeHead(200, {'Content-Type': 'application/json'});
			flatiron.res.end(JSON.stringify(output));

		}
	});

});



app.start(3000);
