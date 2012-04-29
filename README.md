# rpc.js

rpc.js is a simple and lightweight JSON-RPC server, gateway and doc for Node.JS

You can use it standalone (without any dependecy) or integrate in your favorite framework (tested with flatiron and express)

<img src="http://i.imgur.com/LYaZk.png" width="800" border = "0"/>

## Main Features
- Simple, lightweight and fast
- Schema based
- Auto API documentator and interactive tests


## Try it now!

```bash
git clone https://hugorodrigues@github.com/hugorodrigues/rpc.js.git
cd rpc.js/examples/standalone
node example.js
```
Goto http://localhost:3000/help.html





## Declaring Methods

**Method declaration structure**

```js
methodName: {
	info: 'Description of your method',
	params: {
		paramFoo: { required: true, type: 'number', info: 'Description of paramFoo'},
		paramBar: { required: false, type: 'string', info: 'Description of paramBar'}
	},
	action: function(params,output)
	{
		// Do your stuff here
		// You can use the params: params.paramFoo params.paramBar
		// When ready output with: output.win(result);

	}
},
```

**Example method that sum two numbers:**

```js
sum: {
	info: 'Sum two numbers',
	params: {
		x: { required: true, type: 'number', info: 'X value'},
		y: { required: true, type: 'number', info: 'Y value'}
	},
	action: function(params,output)
	{
		var result = parseInt(params.x) + parseInt(params.y);
		output.win(result);
	}
},
```

## Output

When coding inside the action you can output successful responses:
```js
output.win("Hello World");
```
Or error outputs:
```js
 output.fail(403, "Invalid API Key");
```


## Demo API

```js
{

	// Groups - Used to categorize your methods
    groups: {
        math: {
            name: 'Calculatios',
            info: 'Some example math methods',
        },
        util: {
            name: 'Utility calls',
            info: 'API test, debug and utility methods',
        }

    },



    // Your API methods
	methods: {


		sum: {
			info: 'Sum two numbers',
			group: 'math',
			params: {
				x: { required: true, type: 'number', info: 'X value'},
				y: { required: true, type: 'number', info: 'Y value'}
			},
			action: function(params,output)
			{
				var result = parseInt(params.x) + parseInt(params.y);
				output.win(result);
			}
		},


		subtract: {
			info: 'Subtract two numbers',
			group: 'math',
			params: {
				x: { required: true, type: 'number', info: 'X value'},
				y: { required: true, type: 'number', info: 'Y value'}
			},
			action: function(params,output)
			{
				var result = parseInt(params.x) - parseInt(params.y);
				output.win(result);
			}
		},


		division: {
			info: 'Divide numbers',
			group: 'math',
			params: {
				a: { required: true, type: 'number', info: 'A value'},
				b: { required: true, type: 'number', info: 'B value'}
			},
			action: function(params,output)
			{
				var result = parseInt(params.a) / parseInt(params.b);
				output.win(result);
			}
		},


		multiply: {
			info: 'Multiply numbers',
			group: 'math',
			params: {
				b: { required: true, type: 'number', info: 'B value'},
				c: { required: true, type: 'number', info: 'C value'}
			},
			action: function(params,output)
			{
				var result = parseInt(params.b) * parseInt(params.c);
				output.win(result);
			}
		},


		helloWorld: {
			info: 'Say hello!',
			group: 'util',
			params: {
				name: { required: true, type: 'string', info: 'The name - Must be "World"'}
			},
			action: function(params,output)
			{
				if (params.name == 'World')
					output.win("Hello World!");
				else
					output.fail(500,'The param "name" should be "World"');

			}
		},



		// This method return your API schema/catalog
		// Used to generate the UI - You can delete if you don't use it
		getApiSchema: {
			info: 'Return API Schema',
			group: 'util',
			params: { },
			action: function(params,output)
			{
				output.schema();
			}
		}		


	}

}
```



## How to Install

```bash
npm install rpc.js
```



## Using with Flatiron

```js

var flatiron = require('flatiron'),
    app = flatiron.app;


// include rpc.js
var rpc = require('../../rpc.js');
rpc.schema = require('../example.schema.js');


app.use(flatiron.plugins.http);

app.router.post('/', function () {
	// Send request to rpc.js
	rpc.input(this.req.body.rpc,this.res);
});

// Serv UI static file
app.router.get('/help.html', function () {
	var self = this;
	require('fs').readFile("../../ui/help.html", function(error, content) { self.res.writeHead(200, { 'Content-Type': 'text/html' }); self.res.end(content, 'utf-8'); });
});

app.start(3000);

```





## Using with Express

```js

 // include rpc.js
var rpc = require('rpc.js');

// load your API schema
rpc.schema = require('yourApi.schema.js');

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

```





## License 

(The MIT License)

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