/*
	rpc.js - Dummy implementation
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	This examples shows you how to use your api without any server.
	Is usefull when you need to access your api inside another application.
*/


// Load rpc.js and 
var rpc = require('../../rpc.js');

// Setup your schema
var rpcJs = rpc.gateway({
	schema: require('../example.schema.js')
});

// Using input to call your method
rpcJs.input({
	input: { method:'sum', params: { x: 10, y: 5 } },
	callback: function(output) {
		console.log(output);
	}
});


