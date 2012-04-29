/*
	rpc.js - Standalone implementation Example
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	This examples don't have any dependency
*/

// include rpc.js
var rpc = require('../../rpc.js');
var qs = require('querystring');
// load your API schema
rpc.schema = require('../example.schema.js');

// Start a regular http server on port 3000
require('http').createServer(function (request, res) {


	if (request.url == '/help.html')
	{
		// Crappy static file implementation (Only used to serv the UI)
		require('fs').readFile("../../ui/help.html", function(error, content) { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(content, 'utf-8'); });

	} else {

	    var postData = "";
	    request.setEncoding("utf8");

	    request.addListener("data", function(postDataChunk) {
	      postData += postDataChunk;
	    });

	    request.addListener("end", function() {
	    	var post = qs.parse(postData);
		  // Send all requests to rpc.js
	      rpc.input(post.rpc,res); 

	    });

	}


}).listen(3000, '127.0.0.1');

console.log('RPC Server running on :3000');