const argParse = require('./index');

argParse.init("subheaven-arg", "Cumprimenta alguém");
argParse.boolean("show-config", "Mostra a configuração atual de banco de dados");
argParse.boolean("show-config-com-alt", "Mostra a configuração atual de banco de dados", { alt_name: 'configComAlt' });
(async() => {
    if (argParse.validate()) {
        console.log(params['show-config']);
        console.log(params);
    }
})();