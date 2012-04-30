# rpc.js

rpc.js is a simple and lightweight JSON-RPC server, gateway and doc for Node.JS

You can use it standalone (without any dependecy) or integrate in your favorite framework (tested with flatiron and express)

<img src="http://i.imgur.com/DNNlN.png" width="800" border = "0"/>

## Main Features
- Simple, lightweight and fast
- Minimal implementation
- Schema based
- Integrates great with any framework
- Auto API documentation and interactive testing
- Automaticaly validates required params



## Try a demo

```bash
git clone https://hugorodrigues@github.com/hugorodrigues/rpc.js.git
cd rpc.js/examples/standalone
node example.js
```
Open your browser: http://127.0.0.1:3000/help




## How it works
You simply define your methods and set the params.

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





## Full Example

The following example will create a JSON-RPC server on 127.0.0.1:3000 with two methods:
- Sum
- helloWorld (Note that this method requires the param name to be "World")

```js
// Load rpc.js
var rpc = require('rpc.js');

// Define you schema/Api
rpc.schema =  {

	// Groups - Used to categorize your methods
    groups: {
        math: {
            name: 'Math',
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
			info: 'Adding two numbers',
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
		}

	}
}

// Run server on 127.0.0.1:3000
rpc.server(3000, '127.0.0.1');
```

When the server is running you can open http://127.0.0.1:3000/help to view the documenation and start (interactive) testing your API.




## Full schema example

Check the file /examples/example.schema.js for the schema used in the demo and Screenshot's




## Output

When coding inside the action you can output successful responses:
```js
output.win("Hello World");
```
Or error outputs:
```js
 output.fail(500, "You error Message");
```




## Using with Flatiron.js

```js
...
// include rpc.js
var rpc = require('rpc.js');
rpc.schema = require('./yourApiSchema.js');

app.use(flatiron.plugins.http);
app.router.post('/', function () {
	// Send request to rpc.js
	rpc.input(this.req.body.rpc,this.res);
});
...
```
Check/run /examples/flatiron for a full working example using flatiron





## Using with Express.js

```js
...
 // include rpc.js
var rpc = require('rpc.js');
rpc.schema = require('./yourApiSchema.js');

app.post('/', function(req, res){
	// Send request to rpc.js
	rpc.input(req.body.rpc,res);  
});
...
```
Check/run /examples/express for a full working example using express.js




## Inspiration
The auto ui/documentation was inspired by webservice.js by Marak Squires
https://github.com/Marak/webservice.js 




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