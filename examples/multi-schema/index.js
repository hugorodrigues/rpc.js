/*
	rpc.js - Multi-Schema implementation Example
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	This example is suggested if you have a big api and/or prefer use multiple
	object files.
*/

// Load rpc.js and 
var rpc = require('../../rpc.js');


// define all your schemas
var apiSchema = rpc.compile({
		math:  __dirname+'/api/math.js'
		,util: __dirname+'/api/util.js'
	});


// Run a HTTP server on 127.0.0.1:3000 and load the schema
rpc.server('http', {
	port: 3000,
	address: '127.0.0.1',
	gateway: rpc.gateway({ schema: apiSchema }) // Your previously defined apiSchema
});

