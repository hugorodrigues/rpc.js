module.exports = function(options) {

    // Groups - Used to categorize your methods
    var api  = {
        info: {
            name: 'Math',
            info: 'Some example math methods',
        },
        methods: {} 
    };

    // Variables created here will be available in all your methods


    api.methods.sum = {

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
    };


    api.methods.subtract = {
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
    };


    api.methods.division = {
        info: 'Divide two numbers',
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
    };


    api.methods.multiply = {
        info: 'Multiply two numbers',
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
    };



    return api;
};



