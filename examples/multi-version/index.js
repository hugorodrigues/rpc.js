/*
	rpc.js - Multi-version 
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Expose multiple versions of your API
*/


// Setup the main API
var rpcsjs = require('../../rpc.js');


// Set the main/latest version of your api (ex v2)
var apiV2 = rpcsjs.gateway({
	schema: require('./v2.schema.js')
});


// Load a old version version of your api
var apiV1 = rpcsjs.gateway({
	schema: require('./v1.schema.js')
});


// Run a HTTP server on 127.0.0.1:3000
rpcsjs.server('http', {
	port: 3000,
	address: '127.0.0.1',
	gateway: apiV2, // The main API
	versions: { // Your old versions
		v1: apiV1
	}
});
