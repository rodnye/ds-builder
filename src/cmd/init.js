// ds-builder init

const cfg = require("../../config.js");
const fs = require("fs");
const path = require("path");
const processArgs = require("../utils/args.js");
const Json = require("../utils/json.js");
const { copyFileSync, copydirSync } = require("../utils/fs.js");



const cmds = ["init"];
const flags = [
    "-t", "--template",
];

function exec (argv) {
    const cwd = process.cwd();
    const argsMap = processArgs(argv, flags);
    
    let pkg = new Json(path.join(cwd, "package.json"));
    let appName = argsMap.args[1] || pkg.data.name;
    

    //
    // copy droidscript.json 
    //
    let dsJson = new Json(path.join(cfg.TEMPLATE, "/droidscript.json"));
    
    if (appName) dsJson.data.name = appName;
    else appName = dsJson.data.name;
    
    dsJson.data.dist = cfg.DEFAULT_DIST;
    if (pkg.data.version) dsJson.data.version = pkgMap.version;
    
    dsJson.jsonDir = path.join(cwd, "/droidscript.json");
    dsJson.save();
    
    
    //
    // --template
    //
    if (argsMap["--template"] || argsMap["-t"]) {
        
        // README
        let readme = fs.readFileSync(path.join(cfg.TEMPLATE, "/README.md"), "utf-8");
        readme = readme.replace(/\%.*?\%/g, word => {
            if (word === "%name%") return appName;
            if (word === "%gh_url%") return "https://github.com/RodnyE/ds-builder";
            return word;
        });
        fs.writeFileSync(path.join(cwd, "/README.md"), readme, "utf-8");
        
        
        // package.json
        let pkgTemp = new Json(path.join(cfg.TEMPLATE, "/_package.json"));
        
        if (!pkg.data.scripts) pkg.data.scripts = {};
        if (!pkg.data.dependencies) pkg.data.dependencies = {};
        if (!pkg.data.devDependencies) pkg.data.devDependencies = {};
        
        Object.assign(
            pkg.data.scripts,
            pkgTemp.data.scripts,
        );
        Object.assign(
            pkg.data.dependencies,
            pkgTemp.data.dependencies,
        );
        Object.assign(
            pkg.data.devDependencies,
            pkgTemp.data.devDependencies,
        );
        pkg.save();
        
        
        // nodemon.json 
        copyFileSync(
            path.join(cfg.TEMPLATE, "/nodemon.json"),
            path.join(cwd, "/nodemon.json"),
        );
        
        // app.js
        copyFileSync(
            path.join(cfg.TEMPLATE, "/app.js"),
            path.join(cwd, "/app.js"),
        );
        
        // copy droid folder
        copydirSync(
            path.join(cfg.TEMPLATE, "/droid"),
            path.join(cwd, "/droid")
        );
        
        // copy src folder
        copydirSync(
            path.join(cfg.TEMPLATE, "/src"),
            path.join(cwd, "/src")
        );
    }
    
    
}

module.exports = {
    cmds,
    flags,
    exec,
}