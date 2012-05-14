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

	// Activate jsonp ?
	jsonp: true,

	// ui/doc Url
	docUrl: '/help',

	_qs: require('querystring'),
	_url: require('url'),
	_fs: require('fs'),

	// Default Errors. Can be extended
	errors: {
		'-32601': { msg: 'Method not found' },
		'-32700': { msg: 'No JSON was received.' },
		'-32600': { msg: 'The JSON sent is invalid.' },
		'-32602': { msg: 'Invalid method parameter(s)' },
		'-326021': { msg: 'Internal error' }
	},

	// Return Html UI
	uiHtml: function(request)
	{
		return this._fs.readFileSync(__dirname+"/ui/help.html");
	},


	// Load/Compile multiple schemas
	schemaLoad: function(schemas)
	{
		var tmp = {
			groups : {},
			methods : {},
		};

		var loadedSchema
		for (schema in schemas)
		{

			loadedSchema = require(schemas[schema])();

			tmp.groups[schema] = loadedSchema['info'];

			for (method in loadedSchema['methods'])
				{
					loadedSchema['methods'][method]['group'] = schema;
					tmp.methods[schema+'.'+method] = loadedSchema['methods'][method];
				}
		}

		return tmp;
	},

	// Main input flow
	input: function(request)
	{

		// If input object is not direcly provided, parse json (default)
		if (request.input == undefined)
			try {
				// Get Json
				request.input = JSON.parse(request.textInput);
			} catch(err) {
				// If no json or invalid json end
				return this.outputError(request, -32600);
			}

		// If method is getApiSchema and Api Doc is on: serv the schema
		if (request.input.method == 'getApiSchema' && this.docOn == true)
			return this.output(request, this.returnSchema());

		// validate requested method
		if (request.input.method == '' || this.schema.methods[request.input.method] == undefined)
			return this.outputError(request, -32601);

		// Validate requested params
		for (param in this.schema.methods[request.input.method].params)
			if (this.schema.methods[request.input.method].params[param].required == true && (request.input.params == undefined || request.input.params[param] == undefined || request.input.params[param] == ''))
				return this.outputError(request, -32602);

		var self = this;

		// Execute Requested method and expose callbacks to the action
		this.schema.methods[request.input.method].action( request.input.params, {
			win:function(output) { self.output(request, output); }, 
			fail:function (code, msg) { self.outputError(request, code, msg)},
			schema:function() { return self.returnSchema(); }
		});
	},


	// Return the current schema (without actions)
	returnSchema: function()
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

		return {groups:this.schema.groups, methods: response};
	},



	// Main output flow
	output: function(request, output)
	{
		var response = {
            jsonrpc: "2.0",
            result: output
		}

		if (request.input && request.input.id != undefined)
			response.id = request.input.id		

		request.callback(response);
	},



	// Error Output
	outputError: function(request, code, msg, data)
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

		if (request.input && request.input.id != undefined)
			response.id = request.input.id

		request.callback(response);
	},

	// HTTP Server
	server: function(port, bindAdress)
	{

		var self = this;

		function makeJsonp(requestedCallback, output)
		{
			// if callback have any special character, cancel jsonp
			if (self.jsonp == false || !requestedCallback || !requestedCallback.match(/^[\w-]+$/))
				return output;

			return requestedCallback+'('+output+')';
		}


		// Start a regular http server
		require('http').createServer(function (request, res) {

			var postData = "";
			var getData = self._url.parse(request.url,true).query;

			request.setEncoding("utf8");


			if (self.docOn == true && request.url == self.docUrl)
			{
				res.writeHead(200, { 'Content-Type': 'text/html' }); 
				res.end(self.uiHtml(), 'utf-8'); 

			} else {

			    request.on("data", function(postDataChunk) {
			      postData += postDataChunk;
			    });

			    request.on("end", function() {
			    	postData = self._qs.parse(postData);


			    	inputData = postData.rpc;

			    	// Fallback to GET if there is no POST
			    	if (inputData == '')
			    		inputData = getData.rpc;

			    	// Send the http request to rpc input
			    	self.input({
			    		textInput: inputData,
						callback: function(output) {

							output = makeJsonp(getData.jsoncallback, JSON.stringify(output) );

							// Output back to HTTP Server
							res.writeHead(200, {'Content-Type': 'application/json'});
							res.end(output);

						}
					}); 

			    });

		}


		}).listen(port, bindAdress);

		console.log('RPC.js Server running on '+bindAdress+':'+port);
		console.log('RPC.js Api documentation: http://'+bindAdress+':'+port+self.docUrl);
	}

}

module.exports = rpc;