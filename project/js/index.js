/**
 * User: Eric Ma
 * Email: zjafei@gmail.com
 * Date: 2015/3/6
 * Time: 21:42 Language
 */

var common = require('./js/common'),
    setting = require('./js/setting'),
    gui = require('nw.gui');

var locales = require('./locales/' + setting.locales),
    guiWindow = gui.Window,
    $loadLine = $('#loadLine');

var mainWindow = guiWindow.get(),
    msg = locales.index.s000;

function winClose() {
    mainWindow.minimize();
    gui.App.quit();
}

function showError(str) {
    mainWindow.setAlwaysOnTop(false);
    window.alert(str);
    winClose()
}

mainWindow.on('close', function () {
    winClose()
});

mainWindow.setAlwaysOnTop(true);
mainWindow.show();

common.execCommand(setting.command.checkJava, {}, function (err, stdout, stderr) {
    if (!err) {
        $loadLine.css({'width': '25%'});
    } else {
        msg += setting.software.Java + ' ' + locales.index.s001 + ' ' + setting.softwareDownloadPath.Java;
        showError(msg);
    }
    common.execCommand(setting.command.checkNode, {}, function (err, stdout, stderr) {
        if (!err) {
            $loadLine.css({'width': '50%'});
        } else {
            msg += setting.software.Java + ' ' + locales.index.s001 + ' ' + setting.softwareDownloadPath.Node;
            showError(msg);
        }
        common.execCommand(setting.command.checkFis, {}, function (err, stdout, stderr) {
            if (!err) {
                $loadLine.css({'width': '75%'});
            } else {
                msg += setting.software.Java + ' ' + locales.index.s001 + ' ' + setting.softwareDownloadPath.fis;
                showError(msg);
            }
            common.execCommand(setting.command.checkPure, {}, function (err, stdout, stderr) {
                if (!err) {
                    $loadLine.css({'width': '100%'});
                    mainWindow.hide();
                    guiWindow.open('main.html', {
                        "debug": false,
                        "icon": "project/css/favicon.png",
                        "toolbar": false,
                        "width": 215,
                        "height": 556,
                        "resizable": false,
                        "position": "center",
                        "show": false,
                        "frame": false
                    });
                } else {
                    msg += setting.software.Java + ' ' + locales.index.s001 + ' ' + setting.softwareDownloadPath.pure;
                    showError(msg);
                }
            });
        });
    });
});