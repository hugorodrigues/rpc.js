/*
	rpc.js - Standalone HTTP server implementation
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	This examples don't have any dependency
*/

// Load rpc.js
var rpc = require('../../rpc.js');

// Load your api schema
var apiSchema = require('../example.schema.js');

// Run a HTTP server on 127.0.0.1:3000 and load your schema
rpc.server('http', {
	port: 3000,
	address: '127.0.0.1',
	gateway: rpc.gateway({ schema: apiSchema }) // Your previously defined apiSchema
});
