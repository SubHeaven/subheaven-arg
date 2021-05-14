const argParse = require('./index');

argParse.init("my-module", "CLI de teste do processamento de argumentos");
argParse.positional("name", "Nome da pessoa a ser cumprimentada", { required: true, default: "SubHeaven", sample: "SubHeaven" });
argParse.named("emote", "Emoticon usado na cumprimentação", { required: false, default: "", sample: "XD" });
argParse.boolean("booleano", "Indica se o parâmetro booleano foi informado");
(async() => {
    if (await argParse.validate()) {
        console.log(params);
    }
})();