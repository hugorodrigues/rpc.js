/*
	rpc.js - Express implementation
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	Don't forget to run "npm install" to install express
*/


 // include rpc.js
var rpc = require('../../rpc.js');

// load your API schema
rpc.schema = require('../example.schema.js');

 // include express
var express = require('express');
var app = module.exports = express.createServer();

// Express Configuration
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.static('../../ui/'));
  app.use(express.errorHandler()); 
});

app.post('/', function(req, res){
	// Send request to rpc.js
	rpc.input(req.body.rpc,res);  
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


