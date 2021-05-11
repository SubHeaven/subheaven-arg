const arg_parse = require('./index');

arg_parse.description("CLI para a criação de um projeto SubHeaven");
arg_parse.positional("name", "Nome do projeto a ser criado", { required: true, default: "", sample: "TODOList" });
arg_parse.named("author", "Nome do autor do projeto", { required: false, default: "", sample: "John Doe" });
arg_parse.boolean("booleano", "Indica se o parâmetro booleano foi informado");
(async() => {
    if (arg_parse.validate()) {
        console.log(params);
    }
})();