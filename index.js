module.exports = (() => {
    this.args = process.argv.slice(2, process.argv.length);
    this.options = {
        pos: {},
        named: {},
        bool: {},
    };
    this.params = {};
    this._valid = true;
    this._errors = [];
    this._help = this.args.length > 0 && ["?", "help", "-h", "ajuda"].indexOf(this.args[0]) > -1;

    this.init = function(name, description) {
        this.name = name;
        this.description = description;
        this._help = this.args.length > 0 && ["?", "help", "-h", "ajuda"].indexOf(this.args[0]) > -1;
    };

    this.positional = function(name, description, options = {}) {
        let alt_name = options.alt_name ? options.alt_name : name.split('-').join('_');
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
        if (alt_name !== name) {
            this.params[alt_name] = this.params[name];
        }
        if (this.params[name] == "" && options.required) {
            this._errors.push(`O parâmetro ${name} é obrigatório!`);
        }
        if (!validated) {
            this._valid = false;
        }
    };
    this.named = function(name, description, options = {}) {
        let alt_name = options.alt_name ? options.alt_name : name.split('-').join('_');
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
        if (alt_name !== name) {
            this.params[alt_name] = this.params[name];
        }
        if (this.params[name] == "" && options.required) {
            this._errors.push(`O parâmetro ${name} é obrigatório!`);
        }
        if (!validated) {
            this._valid = false;
        }
    };
    this.boolean = function(name, description, options = {}) {
        let alt_name = options.alt_name ? options.alt_name : name.split('-').join('_');
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
        if (alt_name !== name) {
            this.params[alt_name] = this.params[name];
        }
    };
    this.validate = function() {
        if (this._help) {
            this.showHelp();
            return false;
        }
        if (this._valid) {
            global.params = this.params;
            return true;
        } else {
            for (i = 0; i < this._errors.length; i++) {
                console.log(this._errors[i]);
                console.log("");
                console.log("Ajuda:");
                console.log("");
                this.showHelp();
            }
            return false;
        }
    };
    this.showHelp = function() {
        let base_com = this.name ? this.name : __filename.slice(__dirname.length + 1, -3);
        let optionals = [];
        console.log(this.description);
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
    };

    return this;
})();