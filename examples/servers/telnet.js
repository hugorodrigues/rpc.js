/*
	rpc.js - Simple telnet/socket server implementation
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	This examples don't have any dependency
*/

// Load rpc.js
var rpc = require('../../rpc.js');

// Load your api schema
var apiSchema = require('../example.schema.js');

// Run a Telnet server on 127.0.0.1:8888 and load your schema
rpc.server('telnet', {
	port: 8888,
	address: '127.0.0.1',
	gateway: rpc.gateway({ schema: apiSchema }) // Your previously defined apiSchema
});
