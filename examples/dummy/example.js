/*
	rpc.js - Dummy implementation
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	This examples don't have any dependency
*/

// Load rpc.js
var rpc = require('../../rpc.js');

// Load api schema
rpc.schema = require('../example.schema.js');


// Example request for the SUM method
var sampleRequest = { method:'sum', params: { x: 10, y:5 } };


// Method 1: Using the 'textInput' for JSON text (default)
rpc.input({
	textInput: JSON.stringify(sampleRequest),
	callback: function(output) {
		console.log(output);
	}
});


// Method 2: Using the 'input' to pass object
rpc.input({
	input: sampleRequest,
	callback: function(output) {
		console.log(output);
	}
});


