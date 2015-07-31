/**
 * User: Eric Ma
 * Email: zjafei@gmail.com
 * Date: 2015/3/2
 * Time: 15:54
 */
var node = require('./node'),
    severStatusAry = ['没事随便关', '项目产出中...', '调试运行中...'],
    dirStatusAry = ['project-error', 'project-empty', 'project'];

//创建单个项目
function createProject(data, i) {
    var status = node.dirStatus(data.dir);
    return '<a href="#" status="' + status + '" draggable="false">' +
        '<i class="' + dirStatusAry[status] + '"></i>' +
        '<span>' + data.name + '</span>' +
        '<small>' + data.dir + '</small>' +
        '<em></em>' +
        '</a>';
}

//创建项目列表html
function createProjectList(data) {
    var html = '';
    var id = null;
    data.forEach(function (project, i, ary) {
        id = ary.length - (i + 1);
        html += createProject(ary[id], id);
    });
    return html;
}

exports.severStatusAry = severStatusAry;
exports.dirStatusAry = dirStatusAry;
exports.createProject = createProject;
exports.createProjectList = createProjectList;
exports.projectDir = [
    '\\css',
    '\\img',
    '\\js',
    '\\modules',
    '\\page',
    '\\modules\\action',
    '\\modules\\lib',
    '\\modules\\widget',
    '\\output',
    '\\page'
];
exports.modJs = 'var require,define;!function(r){function e(r,e){var u=a[r]||(a[r]=[]);u.push(e);var o=n[r]||{},p=o.pkg?i[o.pkg].url:o.url||r;if(!(p in f)){f[p]=!0;var s=document.createElement("script");s.type="text/javascript",s.src=p,t.appendChild(s)}}var n,i,t=document.getElementsByTagName("head")[0],a={},u={},o={},f={};define=function(r,e){u[r]=e;var n=a[r];if(n){for(var i=n.length-1;i>=0;--i)n[i]();delete a[r]}},require=function(r){r=require.alias(r);var e=o[r];if(e)return e.exports;var n=u[r];if(!n)throw Error("Cannot find module `"+r+"`");e=o[r]={exports:{}};var i="function"==typeof n?n.apply(e,[require,e.exports,e]):n;return i&&(e.exports=i),e.exports},require.async=function(i,t){function a(r){for(var i=r.length-1;i>=0;--i){var t=r[i];if(!(t in u||t in p)){p[t]=!0,s++,e(t,o);var f=n[t];f&&"deps"in f&&a(f.deps)}}}function o(){if(0==s--){var e,n,a=[];for(e=0,n=i.length;n>e;++e)a[e]=require(i[e]);t&&t.apply(r,a)}}"string"==typeof i&&(i=[i]);for(var f=i.length-1;f>=0;--f)i[f]=require.alias(i[f]);var p={},s=0;a(i),o()},require.resourceMap=function(r){n=r.res||{},i=r.pkg||{}},require.alias=function(r){return r}}(this);';

exports.README = 'Root\n ' +
'├─ css    —————————— 样式表文件\n ' +
'├─ img    —————————— 页面样式资源图片\n ' +
'├─ js     —————————— 不需要被 define 包装的 javascript\n ' +
'│   └─ mod.js     —————— javascript MVC框架\n ' +
'├─ modules   ———————— 模块\n ' +
'│   ├─ action    —————— 页面专属的 javascript\n ' +
'│   ├─ lib   ———————— 库文件\n ' +
'│   └─ widget    —————— 挂件\n ' +
'├─ output     ———————— 项目产出目录\n ' +
'└─ page   —————————— 需要产出的页面文件,tpl 为页面公用模板文件不会被产出';

exports.topBar = '<div id="topBar" class="top-bar">' +
'<div class="top-bar-drag">' +
//'<span class="red">F</span> <span class="yellow">I</span> <span class="green">S</span><small></small>' +
'<span class="blue">P</span><span class="gray">ure</span><small></small>' +
'</div>' +
'<div class="top-bar-tools">' +
'<a href="#" id="btnMini" class="top-bar-tool-mini"></a><a href="#" id="btnClose" class="top-bar-tool-close"></a>' +
'</div>' +
'</div>';

exports.win = '<div class="win" id="win"><div class="side-bar"><div class="side-bar-tools"><a href="#" class="create-project" id="createProject"><span></span></a></div><div class="project-list" id="projectList"></div></div></div>';

exports.popBOXcreateProject = '<div class="form-group-xs">' +
'<label class="col-xs-12 control-label" for="name">名称：</label>' +
'<div class="col-xs-12">' +
'<input id="name" class="form-control" type="text" placeholder="输入项目名称">' +
'                               </div>' +
'</div>' +
'<div class="form-group-xs">' +
'<label class="col-xs-12 control-label">目录：</label>' +
'<div class="col-xs-12">' +
'<div class="input-group">' +
'<input type="text" readonly class="form-control" placeholder="请选择项目所在目录..." id="newProjectPathShow">' +
'<span class="input-group-btn">' +
'<button class="btn btn-success btn-xs" type="button" id="newProjectPathBtn">添加</button>' +
'</span>' +
'</div>' +
'<input type="file" class="hide" id="newProjectPath" nwdirectory="true"/>' +
'</div>' +
'</div>' +
'<div class="form-group-xs text-center">' +
'<button class="btn btn-success btn-xs" type="button" id="createNewProject">创建新项目</button>' +
'</div>';

exports.popBOXResetProject = '<div class="form-group-xs">' +
'<label class="col-xs-12 control-label" for="name">名称：</label>' +
'<div class="col-xs-12">' +
'<input id="name" class="form-control" type="text" placeholder="输入项目名称">' +
'                               </div>' +
'</div>' +
'<div class="form-group-xs">' +
'<label class="col-xs-12 control-label">目录：</label>' +
'<div class="col-xs-12">' +
'<div class="input-group">' +
'<input type="text" readonly class="form-control" placeholder="请选择项目所在目录..." id="newProjectPathShow">' +
'<span class="input-group-btn">' +
'<button class="btn btn-success btn-xs" type="button" id="newProjectPathBtn">修改</button>' +
'</span>' +
'</div>' +
'<input type="file" class="hide" id="newProjectPath" nwdirectory="true"/>' +
'</div>' +
'</div>' +
'<div class="form-group-xs text-center">' +
'<button class="btn btn-success btn-xs" type="button" id="resetProject">确认修改</button>' +
'</div>';

exports.popBOXprojectOutPut =
    '<div class="form-group-xs text-center" id="projectOutputInfo">' +
    '<div id="msgIcon" class="msg_icon msg_icon_out_put"></div>'+
    '<span id="msgTxt">等待项目产出完成...</span>'+
    '</div>' +
    '<div class="form-group-xs text-center">' +
    '<button class="btn btn-danger btn-xs" type="button" id="projectOutputBtn">终止产出</button>' +
    '</div>';

exports.popBOXopenServer =
    '<div class="form-group-xs text-center" id="projectOutputInfo">' +
    '<div id="msgIcon" class="msg_icon msg_icon_working"></div>'+
    '<span id="msgTxt">测试环境运行中...</span>'+
    '</div>' +
    '<div class="form-group-xs text-center">' +
    '<button class="btn btn-danger btn-xs" type="button" id="projectWorking">停止环境</button>' +
    '</div>';