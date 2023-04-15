// ds-builder build

const cfg = require("../../config.js");
const fs = require("fs");
const path = require("path");

// tanspiler
const uglify = require("uglify-js");
const babel = require("@babel/core");
const babelOptions = {
    presets: [
        [require("@babel/preset-env"), {modules:false}]
    ],
    plugins: [
        require("@babel/plugin-transform-arrow-functions"),
    ],
    generatorOpts: {
        minified: true,
        comments: false,
    },
}

const processArgs = require("../utils/args.js");
const Json = require("../utils/json.js");
const { 
    isDirectory, 
    copydirSync, 
    rmdirSync,
    mkdirRecursiveSync
} = require("../utils/fs.js");

/**
 * join only relatives url
 */
path.joinRelOnly = function (root, dir) {
    if (this.isAbsolute(dir)) return dir;
    return path.join(root, dir);
}



const cmds = ["build"];
const flags = [
    "--prod", "--production",
    "--no-reset",
];

function exec (argv) {
    const cwd = process.cwd();
    const argsMap = processArgs(argv, flags);
    
    const dsMap = new Json(path.join(cwd, "/droidscript.json")).data;
    const dist = path.join(dsMap.dist || cfg.DEFAULT_DIST, dsMap.name);
    
    // reset dist
    if (!argsMap["--no-reset"]) rmdirSync(dist);
    
    // generate folders
    mkdirRecursiveSync(path.join(dist, "/Img"));
    mkdirRecursiveSync(path.join(dist, "/Snd"));
    mkdirRecursiveSync(path.join(dist, "/Misc"));
    mkdirRecursiveSync(path.join(dist, "/Html"));
    
    // main file
    fs.copyFileSync(
        path.joinRelOnly(cwd, dsMap.main),
        path.join(dist, dsMap.name + ".js"),
    );
    
    // app icon
    fs.copyFileSync(
        path.joinRelOnly(cwd, dsMap.icon),
        path.join(dist, "Img/", dsMap.name + ".png"),
    );
    
    // js files on top folder
    if (dsMap.root) {
        let rootPath = path.joinRelOnly(cwd, dsMap.root);
        let rootFiles = fs.readdirSync(rootPath);
        
        rootFiles.forEach(fileName => {
            let filePath = path.join(rootPath, fileName);
            
            if (path.extname(filePath) === ".js") {
                fs.copyFileSync(filePath, path.join(dist, fileName));
            }
        });
    }
    
    // others folders
    if (dsMap.folders) {
        const folders = dsMap.folders;
        for (let fld in folders) {
            const targetDir = path.joinRelOnly(cwd, folders[fld]);
            const destDir = path.join(dist, fld);
            
            copydirSync(targetDir, destDir);
        }
    }
    
    // transpile
    if (argsMap["--prod"] || argsMap["--production"]) {
        editFilesSync(dist, /\.js$/, (dir, js) => {
            return transpileJS(js);
        });
    }
    
    // build and pkg info
    let buildJson = new Json(path.join(dist, "build.json"));
    let dspkgJson = new Json(path.join(dist, "~package.json"));
    buildJson.data = dsMap.build;
    dspkgJson.data = {ds_version: dsMap.ds_version};
    buildJson.save(2);
    dspkgJson.save(0);
}

/**
 * transpile js code
 */
function transpileJS (js) {
    let result = js;
    
    result = babel.transformSync(js, babelOptions).code;
    //result = uglify.minify(result).code;
    
    return result;
}

/**
 * edit files recursively 
 */
function editFilesSync (
    dir, 
    filter = /\.(.*)$/,
    callbackEdit = ((dir, file) => file)
) {
    
    
    if (isDirectory(dir)) {
        for (let filePath of fs.readdirSync(dir)) {
            editFilesSync(
                path.join(dir, filePath),
                filter,
                callbackEdit,
            );
        }
    }
    
    else if (filter.test(dir)) {
        let data = fs.readFileSync(dir);
        data = callbackEdit(dir, data);
        
        fs.writeFileSync(dir, "" + data);
    }
}

module.exports = {
    cmds,
    flags,
    exec,
}