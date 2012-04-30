/*
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	rpc.js v0.1.0 - A simple JSON-RPC Api Server for nodeJS
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	https://github.com/hugorodrigues/rpc.js
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

	Copyright (c) 2012, Hugo Rodrigues <correio@hugorodrigues.com>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

var rpc = {


	// Empty Schema
	schema: {},

	// Server ui/doc ?
	docOn: true,

	// ui/doc Url
	docUrl: '/help',

	qs: require('querystring'),


	// Default Errors. Can be extended
	errors: {
		'-32601': { msg: 'Method not found' },
		'-32700': { msg: 'No JSON was received.' },
		'-32600': { msg: 'The JSON sent is invalid.' },
		'-32602': { msg: 'Invalid method parameter(s)' },
		'-326021': { msg: 'Internal error' }
	},



	// Main input flow
	input: function(textInput, serverRequest)
	{
		// Get Json
		try {
			var input = JSON.parse(textInput);
		} catch(err) {
			return this.outputError(serverRequest,{}, -32600);
		}

		// If method is getApiSchema and Api Doc is on serv the schema
		if (input.method == 'getApiSchema' && this.docOn == true)
			return this.returnSchema(serverRequest, input, '');

		// validate input method
		if (input.method == '' || this.schema.methods[input.method] == undefined)
			return this.outputError(serverRequest, input, -32601);

		// Validate Params
		for (param in this.schema.methods[input.method].params)
			if (this.schema.methods[input.method].params[param].required == true && (input.params == undefined || input.params[param] == undefined || input.params[param] == ''))
				return this.outputError(serverRequest, input, -32602);


		var self = this;

		// Execute Requested method and define callbacks
		this.schema.methods[input.method].action(input.params, { 
			win:function(output) { self.output(serverRequest, input, output); }, 
			fail: function (code, msg) { self.outputError(serverRequest, input, code, msg)},
			schema:function() { self.returnSchema(serverRequest, input, ''); }
		});
	},


	// Return the current schema (Used by the UI)
	returnSchema: function(serverRequest, input, output)
	{
		var response = {};

		for (method in this.schema.methods)
		{
			response[method] = {
				info: this.schema.methods[method].info,
				group: this.schema.methods[method].group,
				apiKey: this.schema.methods[method].apiKey,
				params: this.schema.methods[method].params
			};
		}

		this.output(serverRequest, input, {groups:this.schema.groups, methods: response});
	},



	// Main output flow
	output: function(serverRequest, input, output)
	{
		var response = {
            jsonrpc: "2.0",
            result: output
		}

		if (input.id != undefined)
			response.id = input.id		

		serverRequest.writeHead(200, {'Content-Type': 'application/json'});
		serverRequest.end(JSON.stringify(response));
	},



	// Error Output
	outputError: function(serverRequest, input, code, msg, data)
	{
		if (msg == undefined && this.errors[code] != undefined)
			msg = this.errors[code].msg;

		if (data == undefined && this.errors[code] != undefined)
			data = this.errors[code].data;

		var response = {
            jsonrpc: "2.0",
            error: {
                "code": code,
                "message": msg,
                "data": data,
            }
		}

		if (input.id != undefined)
			response.id = input.id

		serverRequest.writeHead(200, {'Content-Type': 'application/json'});
		serverRequest.end(JSON.stringify(response));
	},

	// Server
	server: function(port, bindAdress)
	{
		var self = this;

		// Start a regular http server
		require('http').createServer(function (request, res) {

		if (self.docOn == true && request.url == self.docUrl)
		{
			// Crappy static file implementation (Only used to serve the UI html file)
			require('fs').readFile("../../ui/help.html", function(error, content) { 
				res.writeHead(200, { 'Content-Type': 'text/html' }); 
				res.end(content, 'utf-8'); 
			});

		} else {

		    var postData = "";
		    request.setEncoding("utf8");

		    request.addListener("data", function(postDataChunk) {
		      postData += postDataChunk;
		    });

		    request.addListener("end", function() {
		    	var post = self.qs.parse(postData);

		    	self.input(post.rpc,res); 
		    });

		}


		}).listen(port, bindAdress);

		console.log('RPC.js Server running on '+bindAdress+':'+port);
		console.log('RPC.js Api documentation: http://'+bindAdress+':'+port+self.docUrl);
	}

}

module.exports = rpc;