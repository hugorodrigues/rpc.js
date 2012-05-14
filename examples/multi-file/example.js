/*
	rpc.js - Multi-file implementation Example
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	This example is suggested if you have a big api and/or prefer use multiple
	object files
*/

var rpc = require('../../rpc.js');

// Load your objects
rpc.schema = rpc.schemaLoad({
	math:  __dirname+'/api/math.js',
	util: __dirname+'/api/util.js'
});



// Run server on 127.0.0.1:3000
rpc.server(3000, '127.0.0.1');