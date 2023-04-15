// ds-builder init

const cfg = require("../../config.js");
const fs = require("fs");
const path = require("path");
const processArgs = require("../utils/args.js");
const Json = require("../utils/json.js");
const { copydirSync } = require("../utils/fs.js");



const cmds = ["init"];
const flags = [
    "-t", "--template",
];

function exec (argv) {
    const cwd = process.cwd();
    const argsMap = processArgs(argv, flags);
    
    let pkgMap = new Json(path.join(cwd, "package.json")).data;
    let appName = argsMap.args[1] || pkgMap.name;
    
    //
    // copy droidscript.json 
    //
    let dsJson = new Json(path.join(cfg.TEMPLATE, "/droidscript.json"));
    
    if (appName) dsJson.data.name = appName;
    else appName = dsJson.data.name;
    
    dsJson.data.dist = cfg.DEFAULT_DIST;
    if (pkgMap.version) dsJson.data.version = pkgMap.version;
    
    dsJson.jsonDir = path.join(cwd, "/droidscript.json");
    dsJson.save();
    
    //
    // --template
    //
    if (argsMap["--template"] || argsMap["-T"]) {
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