/**
 * User: Eric Ma
 * Email: zjafei@gmail.com
 * Date: 2015/3/2
 * Time: 21:42
 */
var views = require('./views'),
    projectData = require('./projectData'),
    $ = global.jQuery;

//console.log(createProjectList(projectData));
$body = $('#body');
$body.append(views.topBar);
$body.append(views.win);

$('#projectList').append(views.createProjectList(projectData));
$('a').attr('draggable','false');
global.mainWindow.show();