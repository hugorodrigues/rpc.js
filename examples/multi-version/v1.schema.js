// This schema simulates an older version of your API

module.exports = {


	// Groups - Used to categorize your methods
    groups: {
        math: {
            name: 'Math',
            info: 'Some example math methods',
        }
    },



    // Your API methods
	methods: {


		sum: {
			info: 'Adding two numbers (Legacy)',
			group: 'math',
			params: {
				x: { required: true, type: 'number', info: 'X value'},
				y: { required: true, type: 'number', info: 'Y value'}
			},
			action: function(params,output)
			{
				var result = parseInt(params.x) + parseInt(params.y);
				output.win("Legacy: "+result);
			}
		},


		subtract: {
			info: 'Subtract two numbers (Legacy)',
			group: 'math',
			params: {
				x: { required: true, type: 'number', info: 'X value'},
				y: { required: true, type: 'number', info: 'Y value'}
			},
			action: function(params,output)
			{
				var result = parseInt(params.x) - parseInt(params.y);
				output.win("Legacy: "+result);
			}
		},


		division: {
			info: 'Divide two numbers  (Deprecated)',
			group: 'math',
			params: {
				a: { required: true, type: 'number', info: 'A value'},
				b: { required: true, type: 'number', info: 'B value'}
			},
			action: function(params,output)
			{
				var result = parseInt(params.a) / parseInt(params.b);
				output.win("Deprecated: "+result);
			}
		}


	}

}