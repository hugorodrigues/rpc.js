/*
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	rpc.js - A simple JSON-RPC Api Server for nodeJS
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


module.exports = {

	// Create new rpc gateway
   	gateway: function(config) {

		if (config.schema == undefined)
		{
			console.log('No schema defined');
			return false;
		}

		var schema = config.schema;

		// Default Errors. Can be extended
		var errors =  {
			'-32601': { msg: 'Method not found' },
			'-32700': { msg: 'No JSON was received.' },
			'-32600': { msg: 'The JSON sent is invalid.' },
			'-32602': { msg: 'Invalid method parameter(s)' },
			'-326021': { msg: 'Internal error' }
		};

		// Extend errors if necessary
		if (config.errors)
			for (error in config.errors)
				errors[error] = config.errors[error];


		var _fs = require('fs');
		var obj = {};


		// Return Html UI
		obj.uiHtml = function(request)
		{
			return _fs.readFileSync(__dirname+"/ui/help.html");
		};

		// Main input flow
		obj.input = function(request)
		{

			// If input object is not direcly provided, parse json (default)
			if (request.input == undefined)
				try {
					// Get Json
					request.input = JSON.parse(request.textInput);
				} catch(err) {
					// If no json or invalid json end
					return obj.outputError(request, -32600);
				}

			// If method is getApiSchema and Api Doc is on: serv the schema
			if (request.input.method == 'getApiSchema')
				return obj.output(request, obj.returnSchema());

			// validate requested method
			if (request.input.method == '' || schema.methods[request.input.method] == undefined)
				return obj.outputError(request, -32601);

			// Validate requested params
			for (param in schema.methods[request.input.method].params)
				if (schema.methods[request.input.method].params[param].required == true && (request.input.params == undefined || request.input.params[param] == undefined || request.input.params[param] == ''))
					return obj.outputError(request, -32602);

			//var self = this;

			// Execute Requested method and expose callbacks to the action
			schema.methods[request.input.method].action( request.input.params, {
				win:function(output) { obj.output(request, output); }, 
				fail:function (code, msg) { obj.outputError(request, code, msg)},
				schema:function() { return obj.returnSchema(); }
			});
		};

		// Return the current schema (without actions)
		obj.returnSchema = function()
		{
			var response = {};

			for (method in schema.methods)
			{
				response[method] = {
					info: schema.methods[method].info,
					group: schema.methods[method].group,
					apiKey: schema.methods[method].apiKey,
					params: schema.methods[method].params
				};
			}

			return {groups:schema.groups, methods: response};
		};

		// Main output flow
		obj.output = function(request, output)
		{
			var response = {
	            jsonrpc: "2.0",
	            result: output
			}

			if (request.input && request.input.id != undefined)
				response.id = request.input.id		

			request.callback(response);
		};

		// Error Output
		obj.outputError = function(request, code, msg, data)
		{
			if (msg == undefined && errors[code] != undefined)
				msg = errors[code].msg;

			if (data == undefined && errors[code] != undefined)
				data = errors[code].data;

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
		};



		return obj;
	},

	// Return one of the build-in servers
	server: function(type, config)
	{
		return require(__dirname+'/servers/'+type+'.js')(config);
	},


	// Load/Compile multiple schemas
	compile: function(schemas)
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
	}

};

