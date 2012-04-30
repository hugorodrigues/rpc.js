/*
	rpc.js - Standalone implementation Example
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	This examples don't have any dependency
*/

// Load rpc.js
var rpc = require('../../rpc.js');

// Load api schema
rpc.schema = require('../example.schema.js');

// Run server on 127.0.0.1:3000
rpc.server(3000, '127.0.0.1');
