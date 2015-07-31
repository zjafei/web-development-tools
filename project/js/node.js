/**
 * User: Eric Ma
 * Email: zjafei@gmail.com
 * Date: 2015/3/2
 * Time: 19:28
 */
var fs = require('fs'),
    exec = require('child_process').exec,
    path = require('path');

function existDir(dirPath) {//文件夹是否存在
    var b = true;
    if (!(fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory())) {
        b = false;
    }
    return b;
}

function getSonDir(dirPath) {//子目录
    return fs.readdirSync(dirPath);
}

//检查项目目录是否存在 是否为空 0 不存在 1 空 2 不为空
function dirStatus(dirPath) {
    var dirStatus = 0;
     if(existDir(dirPath)){
         dirStatus = 1;
         if(getSonDir(dirPath).length){
             dirStatus = 2;
         }
     }
    return dirStatus;
}

function mkDirsSync(dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        var pathTmp = '';
        dirpath.split(path.sep).forEach(function (dirname) {
            if (pathTmp) {
                pathTmp = path.join(pathTmp, dirname);
            }
            else {
                pathTmp = dirname;
            }
            if (!fs.existsSync(pathTmp)) {
                if (!fs.mkdirSync(pathTmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
}

//文件写入
function writeFile(path, str, callback) {
    callback = callback || function () {
    };
    try {
        fs.writeFile(path, str, function (err) {
            callback(err);
            console.log(err);
        });
    } catch (err) {
        callback(err);
        console.log('--------------------------');
        console.log(err);
    }
}

exports.existDir = existDir;
exports.getSonDir = getSonDir;
exports.dirStatus = dirStatus;
exports.mkDirsSync = mkDirsSync;
exports.writeFile = writeFile;
exports.exec = exec;