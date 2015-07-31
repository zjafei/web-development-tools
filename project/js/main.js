/**
 * User: Eric Ma
 * Email: zjafei@gmail.com
 * Date: 2015/3/2
 * Time: 14:38
 */
//设定全局函数
global.gui = require('nw.gui');
global.win = global.gui.Window;
global.mainWindow = global.win.get();
global.jQuery = jQuery;
global.window = window;

//global.mainWindow.showDevTools();
require('./js/windowEvents');
require('./js/createWin');