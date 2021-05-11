const yargs = require("yargs");

// const options = yargs
//     .usage("Usage: -n <name>")
//     .option("n", { alias: "name", describe: "Nome do projeto a ser criado", type: "string", demandOption: true }).argv;

// const greeting = `Hello, ${options.name}!`;
const arg_parse = {
    args: process.argv.slice(2, process.argv.length),
    options: {
        pos: {},
        named: {},
        bool: {},
    },
    params: {},
    _valid: true,
    _errors: [],
    _help: false,
    description: function(description) {
        this.description = description;
        this._help = this.args.length > 0 && ["?", "help", "-h", "ajuda"].indexOf(this.args[0]) > -1;
    },
    positional: function(name, description, options = {}) {
        this.options.pos[name] = {
            name: name,
            description: description,
            options: options,
        };
        if ("default" in options) {
            this.params[name] = options.default;
        }
        let validated = "required" in options ? !options.required : false;
        if (this.args.length > 0) {
            let arg = this.args[0];
            if (arg[0] != "-" && arg.indexOf("=") == -1) {
                this.params[name] = arg;
                this.args.shift();
                validated = true;
            }
        }
        if (this.params[name] == "" && options.required) {
            this._errors.push(`O parâmetro ${name} é obrigatório!`);
        }
        if (!validated) {
            this._valid = false;
        }
    },
    named: function(name, description, options = {}) {
        this.options.named[name] = {
            name: name,
            description: description,
            options: options,
        };
        if ("default" in options) {
            this.params[name] = options.default;
        }
        let validated = "required" in options ? !options.required : false;
        if (this.args.length > 0) {
            for (i = 0; i < this.args.length; i++) {
                if (this.args[i].indexOf("=") > -1) {
                    if (this.args[i].split("=")[0] == name) {
                        this.params[name] = this.args[i].split("=")[1];
                        this.args.splice(i, 1);
                        validated = true;
                    }
                }
            }
        }
        if (this.params[name] == "" && options.required) {
            this._errors.push(`O parâmetro ${name} é obrigatório!`);
        }
        if (!validated) {
            this._valid = false;
        }
    },
    boolean: function(name, description, options = {}) {
        this.options.bool[name] = {
            name: name,
            description: description,
            options: options,
        };
        this.params[name] = "default" in options ? options.default : false;
        if (this.args.length > 0) {
            for (i = 0; i < this.args.length; i++) {
                if (this.args[i][0] == "-") {
                    let value = this.args[i].replace(/^-*/, "");
                    if (value == name) {
                        this.params[name] = true;
                    }
                }
            }
        }
    },
    validate: function() {
        if (this._help) {
            this.help();
            return false;
        }
        if (this._valid) {
            global.params = this.params;
            return true;
        } else {
            for (i = 0; i < this._errors.length; i++) {
                console.log(this._errors[i]);
                console.log("Como usar:");
                console.log("");
                this.help();
            }
            return false;
        }
    },
    help: function() {
        let base_com = __filename.slice(__dirname.length + 1, -3);
        let optionals = [];
        console.log(__filename.slice(__dirname.length + 1, -3));
        console.log(this.description);
        // console.log(this.options);
        console.log("");
        console.log("Parâmetros posicionais:");
        for (k in this.options.pos) {
            let opt = this.options.pos[k];
            let opcional = "";
            let sample =
                "sample" in opt.options ?
                ` "${opt.options.sample}"` :
                "default" in opt.options ?
                ` "${opt.options.default}"` :
                ` "${opt.name}"`;
            if ("required" in opt.options && opt.options.required) {
                base_com = `${base_com}${sample}`;
            } else {
                opcional = "(Opcional) ";
                optionals.push(sample);
            }
            console.log(`    ${opt.name} = ${opcional}${opt.description} `);
        }
        console.log("");
        console.log("Parâmetros nomeados:");
        for (k in this.options.named) {
            let opt = this.options.named[k];
            let opcional = "";
            let sample =
                "sample" in opt.options ?
                ` ${opt.name}="${opt.options.sample}"` :
                "default" in opt.options ?
                ` ${opt.name}="${opt.options.default}"` :
                ` ${opt.name}="${opt.name}"`;
            if ("required" in opt.options && opt.options.required) {
                base_com = `${base_com}${sample}`;
            } else {
                opcional = "(Opcional) ";
                optionals.push(sample);
            }
            console.log(`    ${opt.name} = ${opcional}${opt.description} `);
        }
        console.log("");
        console.log("Parâmetros booleanos:");
        for (k in this.options.bool) {
            let opt = this.options.bool[k];
            console.log(`    ${opt.name} = ${opt.description} `);
            optionals.push(` --${opt.name}`);
        }
        console.log("");
        console.log("Exemplo de uso:");
        console.log(`    ${base_com}`);
        let com = base_com;
        for (i = 0; i < optionals.length; i++) {
            com = `${com}${optionals[i]}`;
            console.log(`    ${com}`);
        }
    },
};

arg_parse.description("CLI para a criação de um projeto SubHeaven");
arg_parse.positional("name", "Nome do projeto a ser criado", { required: true, default: "", sample: "TODOList" });
arg_parse.named("author", "Nome do autor do projeto", { required: false, default: "", sample: "John Doe" });
arg_parse.boolean("booleano", "Indica se o parâmetro booleano foi informado");
if (arg_parse.validate()) {
    const greeting = "Mundo";
    console.log(params);
}