
module.exports = function(params)
{
	// Telnet server 
	var config = {
		port: params.port || 8888,
		address:  params.address || 8888,
		gateway: params.gateway,
	};

	var server = require('net').createServer(function(socket){
		socket.write('Welcome to the Telnet server!\n');

		socket.on('data', function(data) {
			var input = data.toString().replace(/(\r\n|\n|\r)/gm,"");

			if (input == 'quit')
				return socket.end('Goodbye!\n');

	    	config.gateway.input({
	    		textInput: input,
				callback: function(output){
					socket.write(JSON.stringify(output)+'\n');
				}
			}); 			

		})


	}).listen(config.port);
	
	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
	console.log('RPC.js Telnet Server running on '+config.address+':'+config.port);
	console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');

	return server;
}