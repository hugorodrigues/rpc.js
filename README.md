<img src="http://i.imgur.com/DNNlN.png" width="800" border = "0"/>

# rpc.js

*Simple and lightweight JSON-RPC [gateway, server and documentation] for Node.JS*

You can use it standalone (without any dependency) or integrate in your favorite framework (tested with flatiron and express)

---

## Main Features
- Simple, Lightweight and Fast
- Minimal implementation. Less than 200 LOC (with comments!)
- Multi server. Ship's with http(s), telnet and socket.io
- Decoupled. Use your api without any server
- Auto API documentation and interactive testing
- Automaticaly validates required parameters
- Integrates great with any framework
- Works with POST or GET (if using the http server)
- Compatible with jsonp (for cross-domain requests)
- You can have multiple API version's exposed

---
## Try a demo

```bash
git clone https://hugorodrigues@github.com/hugorodrigues/rpc.js.git
node rpc.js/examples/servers/http.js
```
Open your browser: http://127.0.0.1:3000/help




---
## How it works
You simply define your methods and set the parameters.

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

		// On error output with: output.fail(errorCode,errorMsg,errorData);
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



---
## Full Example

The following example will create a JSON-RPC server on 127.0.0.1:3000 with two methods:
- sum
- helloWorld (Note that this method requires the param name to be "World")

```js
// Load rpc.js
var rpc = require('rpc.js');

// Define you schema/Api
var apiSchema = {
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
};


// Run a HTTP server on 127.0.0.1:3000 and with your schema
rpc.server('http', {
	port: 3000,
	address: '127.0.0.1',
	gateway: rpc.gateway({ schema: apiSchema }) // Your previously defined apiSchema
});


```

When the server is running, you can open http://127.0.0.1:3000/help to view the documenation and start testing your API.

Inside the action you can output successful responses with `output.win("Hello World");` or error messages with `output.fail(500, "You error Message");`
Check the file /examples/example.schema.js for the full schema used in the demo and Screenshot's.





---
## Consuming your api

Just like you do with any regular JSON-RPC api. Some examples:

#### In browser (using jquery)
```js
jQuery.post('http://127.0.0.1:3000', {rpc:JSON.stringify({
    method:'sum', 
    params: { x: 10, y:5 }
})}, function (data){
    
    console.log(data.result);
    // 15

}, 'json');
```

#### Command line (Curl)
```bash
curl -i -X POST -d rpc='{"method":"sum","params":{"x":"10","y":"5"}}' http://127.0.0.1:3000/
```
Will Output: `{"jsonrpc":"2.0","result":15}`






---
## Examples
rpc-js is very flexible and can be adapted to your needs. Check the /examples:

[examples/servers/http.js](/hugorodrigues/rpc.js/blob/master/examples/servers/http.js) - Standalone HTTP server implementation. 

[examples/servers/socketio.js](/hugorodrigues/rpc.js/blob/master/examples/servers/socketio.js) - Socket.Io Implementation. 

[examples/servers/telnet.js](/hugorodrigues/rpc.js/blob/master/examples/servers/telnet.js) - Socket server Implementation. 

[examples/dummy/index.js](/hugorodrigues/rpc.js/blob/master/examples/dummy/index.js) - This examples shows you how to use your api without any server. Is usefull when you need to access your api inside another nodejs application.

[examples/express/index.js](/hugorodrigues/rpc.js/blob/master/examples/express/index.js) - Using your API in a expressJs Application

[examples/flatiron/index.js](/hugorodrigues/rpc.js/blob/master/examples/flatiron/index.js) - Using your API in a flatiron Application

[examples/multi-schema/index.js](/hugorodrigues/rpc.js/blob/master/examples/multi-schema/index.js) - Insted of having a large schema, you can divide your api code base in a class-like fashion, This example is suggested if you have a big api and/or prefer use multiple object files.

[examples/multi-server/index.js](/hugorodrigues/rpc.js/blob/master/examples/multi-server/index.js) - Expose the same API in multiple http ports

[examples/multi-version/index.js](/hugorodrigues/rpc.js/blob/master/examples/multi-version/index.js) - Expose multiple versions of your API (/v1, /v2 etc...)





---
## Inspiration
The automatic ui/documentation was inspired by webservice.js by Marak Squires
https://github.com/Marak/webservice.js 


---
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