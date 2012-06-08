
module.exports = function(params)
{
	// Http server default settings
	var config = {
		port: 3000,
		address: '127.0.0.1',
		autoDoc: true,
		autoDocUrl: 'help',
		jsonp: false,
		mount: '/',
		postVar: 'rpc',
		socketIo: false,
		gateway: false,
		versions: false
	};

	var _url = require('url');
	var _qs = require('querystring');


	// Set user settings
	for (conf in config)
		if (params[conf] != undefined)
			config[conf] = params[conf];

	// Pre-process all possible requests (performance)
	var routeCache = {};
	routeCache[config.mount] = {mount: config.mount, gateway: config.gateway};
	routeCache[config.mount+config.autoDocUrl] = {mount: config.mount, gateway: config.gateway, ui:true};

	if (config.versions != false)
		for (version in config.versions)
			{
				routeCache[config.mount+version+'/'] = {mount: config.mount+version, gateway: config.versions[version]};
				routeCache[config.mount+version+'/'+config.autoDocUrl] = {mount: config.mount+version, gateway: config.versions[version], ui: true};
			}



	function makeJsonp(requestedCallback, output)
	{
		// if callback have any special character, cancel jsonp
		if (config.jsonp == false || !requestedCallback || !requestedCallback.match(/^[\w-]+$/))
			return output;

		return requestedCallback+'('+output+')';
	}


	function findRoute(url)
	{

		if (routeCache[url] != undefined)
			return routeCache[url];
		
		return false;
	}


	// Start a regular http server
	var httpServer = require('http').createServer(function (request, res) {

		request.setEncoding("utf8");

		var postData = "";
		var getData = _url.parse(request.url,true).query;


		var requestGateway = findRoute(request.url);

		if (requestGateway == false)
		{
			res.writeHead(404, { 'Content-Type': 'text/html' }); 
			res.end('<h1>Not found!</h1>', 'utf-8'); 
			return;
		}


		if (config.autoDoc == true && requestGateway.ui == true )
		{
			res.writeHead(200, { 'Set-Cookie': 'socketIo='+config.socketIo, 'Content-Type': 'text/html' }); 
			res.end(requestGateway.gateway.uiHtml(), 'utf-8'); 

		} else {

		    request.on("data", function(postDataChunk) {
		      postData += postDataChunk;
		    });

		    request.on("end", function() {
		    	postData = _qs.parse(postData);

		    	inputData = postData[config.postVar];

		    	// Fallback to GET if there is no POST
		    	if (inputData == '')
		    		inputData = getData[config.postVar];

		    	// Send the http request to rpc input
		    	requestGateway.gateway.input({
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


	}).listen(config.port, config.address);

	// Activate websockets?
	if (config.socketIo == true)
	{
		var io = require('socket.io').listen(httpServer)

		io.sockets.on('connection', function (socket) {
		  socket.on('rpc', function (input,fn) {

			routeCache[config.mount].gateway.input({ input: input, callback: fn });

		  });
		});
	}

	console.log('RPC.js Server running on '+config.address+':'+config.port+config.mount);
	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
	console.log('Available versions:');


	console.log('-- RPC.js [Latest] API: http://'+config.address+':'+config.port+config.mount);
	console.log('-- RPC.js [Latest] DOC: http://'+config.address+':'+config.port+config.mount+config.autoDocUrl);


	if (config.versions != false)
	{
		console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');

		for (version in config.versions)
		{
			console.log('-- RPC.js ['+version+'] API: http://'+config.address+':'+config.port+config.mount+version+'/');
			console.log('-- RPC.js ['+version+'] DOC: http://'+config.address+':'+config.port+config.mount+version+'/'+config.autoDocUrl);
		}

	}

	return httpServer;
}