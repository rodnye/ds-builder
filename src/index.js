const processArgs = require("./utils/args.js");

//
// Arguments 
//
const argv = process.argv;
const argsMap = processArgs(argv, [], {ignoreFlagsError: true});
const arg0 = argsMap.arg0;


const cmds = [
    require("./cmd/init.js"),
    require("./cmd/build.js"),
];


let cmdFound = false;

for (const cmd of cmds) {
    if (cmd.cmds.includes(arg0)) {
        cmd.exec(argv);
        cmdFound = true;
        break;
    }
}

if (!cmdFound) {
    // no exist command!
    console.error(
        "Unknown command: \"" + arg0 + "\"\n\n" +
        "To see a list of supported onpm commands, run: \nonpm --help"
    );
}