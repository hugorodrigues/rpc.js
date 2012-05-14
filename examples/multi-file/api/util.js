module.exports = function(options) {

    // Groups - Used to categorize your methods
    var api  = {
        info: {
            name: 'Utilizador',
            info: 'Funções de utilizador'
        },
        methods: {} 
    };

    // Note: Variables created here will be available in all your methods

    api.methods.helloWorld = {
        info: 'Say hello!',
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
    };


    return api;
};

