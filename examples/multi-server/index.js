/*
	rpc.js - Multi-server implementation
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Expose your API in multiple ports/protocols
*/

// Load rpc.js
var rpc = require('../../rpc.js');


// Load your api schema
var apiSchema = require('../example.schema.js');

// Run a HTTP server on port 3000
rpc.server('http', {
	port: 3000,
	address: '127.0.0.1',
	gateway: rpc.gateway({ schema: apiSchema }) // Your previously defined apiSchema
});

// Run a HTTP server on port 5000
rpc.server('http', {
	port: 5000,
	address: '127.0.0.1',
	gateway: rpc.gateway({ schema: apiSchema }) // Your previously defined apiSchema
});