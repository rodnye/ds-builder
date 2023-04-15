# DroidScript Bundler
CLI tool to transpile and prepare a [DroidScript](https://droidscript.org) project
starting an application with NodeJS

## Setup
Download the repository to a folder with superuser permissions and
install the necessary dependencies.  
Copy and run the following command: 
```sh
git clone https://github.com/RodnyE/ds-builder.git &&
cd ds-builder &&
npm install &&
npm link
```
After these steps you will be able to use the `ds-builder` command in your terminal.

## CLI
### init
```sh
ds-builder init [<app-name>] [flags]
```
This initializes a `droidscript.json` file needed to compile.
The name of the application, if not specified, will be taken 
by default from the `package.json`

Flags:
| flags | desc |
| - | - |
| `-t, --template` | Initialize from a default base template |

Example:
```sh
ds-builder init "Hello World" --template
```

### build
```sh
ds-builder build [flags]
```
Process and build a new DroidScript project in the destination folder
default, then it can be opened and compiled from the app.

Flags:
| flags | desc |
| - | - |
| `--prod, --production` | Transpile and minify all JavaScript files |


## droidscript.json
It specifies the paths and files that will be taken into account when
build
### name
The name of application.

### version
The version of the application, this value is irrelevant, it will not be taken into account
in the construction.

### ds_version
The version of DroidScript being used.

### main
Main javascript file where the app will be executed

### icon
Apk icon when compiled

### dist
Build destination folder

### root
Directory where the other javascript files will be obtained from
which the main one will use.

### folders
Object that will contain the name of additional folders and their 
location to be copied.  
They can only be used:
- Html
- Snd
- Img
- Misc

### build
The `build.json` of droidscript project

### Example a droidscript.json
```javascript
{
  "name": "Hello World",
  "version": "1.01",
  "ds_version": "2.50",
  "root": "./droid",
  "main": "./droid/app.js",
  "icon": "./droid/icon.png",
  "folders": {
    "Html": "./src"
  },
  "dist": "/sdcard/Android/data/com.smartphoneremote.androidscriptfree/files/DroidScript",
  "build": {
    "autoPermissions": false,
    "manifest": {
      "minSdkVersion": 23,
      "targetSdkVersion": 28,
      "debuggable": false,
      "homeScreen": false,
      "removePermissions": "WRITE_EXTERNAL_STORAGE"
    }
  }
}
```