/**
 * User: Eric Ma
 * Email: zjafei@gmail.com
 * Date: 2015/3/3
 * Time: 19:16
 */
//

var gui = global.gui;
var projectDel = new gui.MenuItem({label: '删除'}),
    separator = new gui.MenuItem({type: 'separator'}),
    openFolder = new gui.MenuItem({label: '打开目录'}),
    createProjectFolder = new gui.MenuItem({label: '创建项目结构'}),
    reSet = new gui.MenuItem({label: '修改项目'}),
    openServer = new gui.MenuItem({label: '启动调试'}),
    outPut = new gui.MenuItem({label: '项目产出'});

exports.projectDel = projectDel;
exports.separator = separator;
exports.openFolder = openFolder;
exports.createProjectFolder = createProjectFolder;
exports.reSet = reSet;
exports.openServer = openServer;
exports.outPut = outPut;