
const path = require("path");
const fs = require("fs");


// copy dir
function copydirSync (folderPath, destPath) {
    
    if (!fs.existsSync(folderPath)) return;
    mkdirRecursiveSync(destPath);
    
    fs.readdirSync(folderPath).forEach(fileName => {
        const curPath = path.join(folderPath, fileName);
        const copyPath = path.join(destPath, fileName);

        if (isDirectory(curPath)) copydirSync(curPath, copyPath);
        else fs.copyFileSync(curPath, copyPath);
    });
}



// remove folder recursively
function rmdirSync (folderPath) {
    
    if (!fs.existsSync(folderPath)) return;
    
    fs.readdirSync(folderPath).forEach(fileName => {
        const curPath = path.join(folderPath, fileName);
        
        if (isDirectory(curPath)) rmdirSync(curPath);
        else fs.unlinkSync(curPath);
    });
    
    fs.rmdirSync(folderPath);
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
    rmdirSync,
    mkdirRecursiveSync,
    isDirectory,
}