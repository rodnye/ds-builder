
const path = require("path");
const fs = require("fs");


// copy dir
function copydirSync (currentDir, targetDir) {
    recursive("");
    function recursive (dir) {
        let realDir = path.join(currentDir, dir);
        let copyDir = path.join(targetDir, dir);

        if (isDirectory(realDir)) {
            if (!isDirectory(copyDir)) fs.mkdirSync(copyDir, {recursive: true});
            for (let i of fs.readdirSync(realDir)) recursive(path.join(dir, i));
        }
        else fs.copyFileSync(realDir, copyDir);
    }
}


// make dir recursively 
function mkdirRecursiveSync (dir) {
    let parent = path.join(dir, "..");
    
    if (!isDirectory(parent)) mkdirRecursiveSync(parent);
    if (!isDirectory(dir)) fs.mkdirSync(dir);
}


// verify is a directory
function isDirectory (dir) {
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

module.exports = {
    copydirSync,
    mkdirRecursiveSync,
    isDirectory,
}