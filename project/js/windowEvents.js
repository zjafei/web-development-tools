/**
 * User: Eric Ma
 * Email: zjafei@gmail.com
 * Date: 2015/3/2
 * Time: 15:53
 */
var $ = global.jQuery,
    window = global.window,
    mainWindow = global.mainWindow,
    gui = global.gui,
    common = require("./common"),
    views = require('./views'),
    node = require('./node'),
    tools = require('./tools'),
    menu = require('./menu'),
    projectData = require('./projectData'),
    PopBox = require('./widget/popBox/js'),
    popBox = null,
    severStatus = 0,
    severProcess = null;
var $body = $('#body');

//创建项目结构文件
function createProjectFolder(dirPath, views) {
    var projectDirBool = 0;
    views.projectDir.forEach(function (dir) {
        if (!node.mkDirsSync(dirPath + dir)) {
            projectDirBool = 1;
            return true;
        }
    });
    if (projectDirBool === 0) {
        node.writeFile(dirPath + views.projectDir[2] + '\\mod.js', views.modJs, function (error) {
            if (error) {
                projectDirBool = 2;
            } else {
                node.writeFile(dirPath + '\\README.md', views.README, function (error) {
                    if (error) {
                        projectDirBool = 3;
                    }
                });
            }
        });
    }
    return projectDirBool;
}

//写入数据库
function writeData(projectData, cb) {
    var callback = cb || function () {
        };
    node.writeFile('.\\project\\js\\projectData.js', 'module.exports = ' + JSON.stringify(projectData) + ';', function (error) {
        callback(error);
    })
}

//创建托盘
function createTray(o) {
    var tray = new gui.Tray(o);
    tray.on('click', function () {
            mainWindow.show();
            tray.remove();
            tray = null;
        }
    );
}

//检查项目是否存在
function checkProject(keyName, val, data) {
    var b = -1;
    data.forEach(function (i, index) {
        if (i[keyName] === val) {
            b = index;
            return true;
        }
    });
    return b;
}

//删除项目
function delProject(obj) {
    projectData.splice(projectData.length - obj.index() - 1, 1);
    writeData(projectData, function (error) {
        if (error) {
            window.alert('项目删除失败');
        } else {
            obj.remove();
        }
    });
}

//修改项目
function resetProject(obj) {
    var id = projectData.length - obj.index() - 1;
    popBox = new PopBox('resetProject' + id, [{
        'title': '修改项目',
        'width': 205,
        'height': 140,
        'html': views.popBOXResetProject
    }]);
    popBox.showBox();
    $('#name').val(projectData[id].name);
    $('#newProjectPathShow').val(projectData[id].dir);
}

//kill进程
function killProcess(pid, cb) {
    var callback = cb || function () {
        };
    common.execCommand('taskkill /T /F /PID ' + pid, {}, function (err, stdout, stderr) {
        callback(err, stdout, stderr);
    });
}

//cmd删除文件夹
function delFolder(path, cb) {
    var callback = cb || function () {
        };

    common.execCommand('rd/s/q ' + path, {}, function (err, stdout, stderr) {
        callback(err, stdout, stderr);
    });
}

//cmd创建文件夹
function createFolder(path, cb) {
    var callback = cb || function () {
        };
    common.execCommand('md ' + path, {}, function (err, stdout, stderr) {
        callback(err, stdout, stderr);
    });
}

//cmd清空文件夹
function clearFolder(path, cb) {
    var callback = cb || function () {
        };
    delFolder(path, function (err0, stdut0, stderr0) {
        if (!err0) {
            createFolder(path, function (err1, stdout1, stderr1) {
                if (!err1) {
                    callback(err1, stdout1, stderr1);
                } else {
                    console.log(err1);
                    window.alert('操作设备');
                }
            })
        } else {
            console.log(err0);
            window.alert('操作设备');
        }
    })
}

mainWindow.on('close', function () {
    //todo 检查是否在项目产出或测试环境
    if (severStatus !== 0) {
        if (window.confirm(views.severStatusAry[severStatus] + '\r\n\r\n 确认终止？')) {

            switch (severStatus) {
                case 1:
                    killProcess(severProcess.pid, function (err, stdut, stderr) {
                        if (!err) {
                            mainWindow.minimize();
                            gui.App.quit();
                        } else {
                            console.log(err);
                            window.alert('操作失败');
                        }
                    });
                    break;
                case 2:
                    common.execCommand('pure server stop', {}, function (err, stdout, stderr) {
                        if (!err) {
                            killProcess(severProcess.pid, function (err, stdut, stderr) {
                                if (!err) {
                                    severStatus = 0;
                                    severProcess = null;
                                    mainWindow.minimize();
                                    gui.App.quit();
                                } else {
                                    console.log(err);
                                    window.alert('操作失败');
                                }
                            });
                        } else {
                            console.log(err);
                            window.alert('操作失败');
                        }
                    });
                    break;
                default:
                //TODO
            }

        }
    } else {
        mainWindow.minimize();
        gui.App.quit();
    }
});

$body.on('click', '#btnMini', function () {
    mainWindow.hide();
    createTray({title: 'FIS', icon: './project/css/favicon.png', tooltip: '点击打开'});
});

$body.on('click', '#btnClose', function () {
    mainWindow.close();
});

$body.on('click', '#createProject', function () {
    popBox = new PopBox('createProject', [{
        'title': '添加项目',
        'width': 205,
        'height': 140,
        'html': views.popBOXcreateProject
    }]);
    popBox.showBox();
});

$body.on('click', '#newProjectPathBtn', function () {
    $('#newProjectPath').click();
});

$body.on('change', '#newProjectPath', function () {
    $('#newProjectPathShow').val($('#newProjectPath').val());
});

//
$body.on('click', '#projectOutputBtn', function () {
    if (severStatus !== 0) {
        killProcess(severProcess.pid, function (err, stdut, stderr) {
            severStatus = 0;
            if (!err) {
                popBox.hideBox();
            } else {
                console.log(err);
                window.alert('操作失败');
                popBox.hideBox();
            }
        });
    } else {
        popBox.hideBox();
    }
});

$body.on('click', '#projectWorking', function () {
    if (severStatus !== 0) {
        common.execCommand('pure server stop', {}, function (err, stdout, stderr) {
            if (!err) {
                killProcess(severProcess.pid, function (err, stdut, stderr) {
                    if (!err) {
                        severStatus = 0;
                        severProcess = null;
                        popBox.hideBox();
                    } else {
                        console.log(err);
                        window.alert('操作失败');
                    }
                });
            } else {
                console.log(err);
                window.alert('操作失败');
            }
        });

    } else {
        popBox.hideBox();
    }

});

//右键菜单
$body.on('contextmenu', '#projectList a', function (e) {
    e.preventDefault();
    var myThis = $(this);
    var id = myThis.index();
    var projectDir = projectData[id].dir;
    var outPutDir = projectDir + '\\output',
        runTimeDir = __dirname.replace('\\js', '\\.runtime\\www'),
        runTimeConfig = runTimeDir.replace('www', 'runtime-conf.js'),
        projectMenu = new gui.Menu();

    switch (myThis.attr('status')) {
        case '0':
            //TODO
            break;
        case '1':
            projectMenu.append(menu.openFolder);
            projectMenu.append(menu.separator);
            projectMenu.append(menu.openServer);
            projectMenu.append(menu.separator);
            projectMenu.append(menu.createProjectFolder);
            break;
        case '2':
            projectMenu.append(menu.openFolder);
            projectMenu.append(menu.separator);
            projectMenu.append(menu.openServer);
            projectMenu.append(menu.outPut);
            projectMenu.append(menu.separator);
            break;
    }

    projectMenu.append(menu.reSet);
    projectMenu.append(menu.separator);
    projectMenu.append(menu.projectDel);

    projectMenu.popup(e.pageX, e.pageY);

    menu.openServer.click = function () {
        clearFolder(runTimeDir, function (err, stdut, stderr) {
            if (!err) {
                severStatus = 2;
                severProcess = common.execCommand('pure release -d ' + runTimeDir + ' -f ' + runTimeConfig + ' && pure server start -p 80 --root ' + runTimeDir + ' && pure release -d ' + runTimeDir + ' -wL ' + runTimeDir + ' -f ' + runTimeConfig, {
                    cwd: projectDir
                }, function (err, stdout, stderr) {
                    if (err) {
                        severProcess = null;
                        severStatus = 0;
                        $('#msgIcon').removeClass('msg_icon_working').addClass('msg_icon_working_error');
                        $('#msgTxt').text('测试环境启动失败');
                    }
                });
                popBox = new PopBox('outPut' + id, [{
                    'title': '项目测试',
                    'width': 205,
                    'height': 140,
                    'html': views.popBOXopenServer
                }]);
                popBox.showBox();
                $('#popBoxV3Close_' + popBox.id).remove();
            } else {
                window.alert('操作失败');
                console.log(err);
            }
        });
    };

    menu.outPut.click = function () {
        clearFolder(outPutDir, function (err, stdut, stderr) {
            if (!err) {
                severStatus = 1;
                severProcess = common.execCommand('pure release -d ' + outPutDir + ' -f ' + runTimeConfig, {
                    cwd: projectDir
                }, function (err, stdout, stderr) {
                    severProcess = null;
                    severStatus = 0;
                    if (!err) {
                        $('#msgIcon').removeClass('msg_icon_out_put').addClass('msg_icon_out_put_ok');
                        $('#msgTxt').text('项目产出完成');
                        $('#projectOutputBtn').removeClass('btn-danger').addClass('btn-success').text('确认');
                    } else if (severStatus !== 0) {
                        console.log(err);
                        $('#msgIcon').removeClass('msg_icon_out_put').addClass('msg_icon_out_put_error');
                        $('#msgTxt').text('项目产出失败');
                        $('#projectOutputBtn').text('确认');
                    }
                });
                popBox = new PopBox('outPut' + id, [{
                    'title': '项目产出',
                    'width': 205,
                    'height': 140,
                    'html': views.popBOXprojectOutPut
                }]);
                popBox.showBox();
                $('#popBoxV3Close_' + popBox.id).remove();
            } else {
                console.log(err);
                window.alert('操作失败');
            }
        });
    };

    menu.projectDel.click = function () {
        delProject(myThis);
    };

    menu.openFolder.click = function () {
        gui.Shell.openItem(projectDir);
    };

    menu.createProjectFolder.click = function () {
        var createProjectDirStatus = createProjectFolder(projectDir, views);
        switch (createProjectDirStatus) {
            case 0:
                $('#projectList').html(views.createProjectList(projectData));//todo 需要优化
                break;
            case 1:
                window.alert('项目结构目录创建失败');
                break;
            case 2:
                window.alert('mod.js写入失败');
                break;
            case 3:
                window.alert('README.md写入失败');
                break;
        }
    };

    menu.reSet.click = function () {
        resetProject(myThis);
    };

    return false;
});

$body.on('click', '#resetProject', function () {
    var p = {},
        id = popBox.id.replace('resetProject', '');

    p.name = $('#name').val().replace(/(^\s*)|(\s*$)/g, "").toLowerCase();
    p.dir = $('#newProjectPathShow').val().toLowerCase();
    var checkNameId = checkProject('name', p.name, projectData);
    var checkDirId = checkProject('dir', p.dir, projectData);
    if (p.name === '') {
        window.alert('项目名称不能为空');
    } else if (checkNameId !== -1 && p.name !== projectData[id].name) {
        window.alert('项目名以被使用');
    } else if (p.dir === '') {
        window.alert('项目目录不能为空');
    } else if (checkDirId !== -1 && p.dir !== projectData[id].dir) {
        window.alert('目录以被 ' + projectData[checkDirId].name + ' 项目使用');
    } else {
        var index = projectData.length - id - 1;
        var oldStatus = $('#projectList a').eq(index).attr('status');
        if (p.dir !== projectData[id].dir || p.name !== projectData[id].name) {
            var oldDir = projectData[id].dir;
            projectData[id].dir = p.dir;
            projectData[id].name = p.name;
            writeData(projectData, function (error) {
                if (error) {
                    window.alert('项目修改失败');
                } else {
                    $('#projectList span').eq(index).text(p.name);
                    if (p.dir !== oldDir) {
                        var status = node.dirStatus(p.dir);
                        $('#projectList a').eq(index).attr('status', status);
                        $('#projectList i').eq(index).attr('class', views.dirStatusAry[status]);
                        $('#projectList small').eq(index).text(p.dir);
                    } else if (oldStatus === '0') {
                        node.mkDirsSync(p.dir);
                        $('#projectList').html(views.createProjectList(projectData));//todo 需要优化
                    }
                }
            });
        } else if (oldStatus === '0') {
            node.mkDirsSync(p.dir);
            $('#projectList').html(views.createProjectList(projectData));//todo 需要优化
        }
        popBox.hideBox();
    }
});

$body.on('click', '#createNewProject', function () {
    var p = {};
    p.name = $('#name').val().replace(/(^\s*)|(\s*$)/g, "").toLowerCase();
    p.dir = $('#newProjectPathShow').val().toLowerCase();

    var checkNameId = checkProject('name', p.name, projectData);
    var checkDirId = checkProject('dir', p.dir, projectData);
    if (p.name === '') {
        window.alert('项目名称不能为空');
    } else if (checkNameId !== -1) {
        window.alert('项目名以被使用');
    } else if (p.dir === '') {
        window.alert('项目目录不能为空');
    } else if (checkDirId !== -1) {
        window.alert('目录以被 ' + projectData[checkDirId].name + ' 项目使用');
    } else {
        writeData(p.dir, function () {
            p.date = tools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
            projectData.push(p);
            writeData(projectData, function (error) {
                if (error) {
                    window.alert('项目创建失败');
                } else {
                    $('#projectList').prepend(views.createProject(p, projectData.length - 1));
                    popBox.hideBox();
                }
            });
        });
        //var createProjectDirStatus = createProjectFolder(p.dir, views);
        //switch (createProjectDirStatus) {
        //    case 0:
        //        p.date = tools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
        //        projectData.push(p);
        //        writeData(projectData, function (error) {
        //            if (error) {
        //                window.alert('项目创建失败');
        //            } else {
        //                $('#projectList').prepend(views.createProject(p, projectData.length - 1));
        //                popBox.hideBox();
        //            }
        //        });
        //        break;
        //    case 1:
        //        window.alert('项目结构目录创建失败');
        //        break;
        //    case 2:
        //        window.alert('mod.js写入失败');
        //        break;
        //    case 3:
        //        window.alert('README.md写入失败');
        //        break;
        //}
    }
});




