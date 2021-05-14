# subheaven-arg
Mais um modulo para tratamento de argumentos

Como instalar:
```
npm i https://github.com/SubHeaven/subheaven-arg
```

Como usar:
```
const argParse = require('subheaven-arg');

argParse.init("my-module", "CLI de teste do processamento de argumentos");
argParse.positional("name", "Nome da pessoa a ser cumprimentada", { required: true, default: "SubHeaven", sample: "SubHeaven" });
argParse.named("emote", "Emoticon usado na cumprimentação", { required: false, default: "", sample: "XD" });
argParse.boolean("booleano", "Indica se o parâmetro booleano foi informado");
(async() => {
    if (await argParse.validate()) {
        console.log(params);
    } else {
        await argParse.showHelp();
    }
})();
```

Exemplo de output:
```
C:\iacon\subheavenjs\subheaven-arg>node cli.js ?
CLI de teste do processamento de argumentos

Parâmetros posicionais:
    name = Nome da pessoa a ser cumprimentada

Parâmetros nomeados:
    emote = (Opcional) Emoticon usado na cumprimentação

Parâmetros booleanos:
    booleano = Indica se o parâmetro booleano foi informado

Exemplo de uso:
    my-module "SubHeaven"
    my-module "SubHeaven" emote="XD"
    my-module "SubHeaven" emote="XD" --booleano
```
