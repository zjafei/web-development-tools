/**
 * User: Eric Ma
 * Email: zjafei@gmail.com
 * Date: 2015/3/7
 * Time: 9:32
 */
module.exports = {
    'locales':'zh_cn',
    "software":{
        'Java': 'Java',
        'Node': 'node.js',
        'fis': 'fis',
        'pure': 'pure'
    },
    'softwareDownloadPath': {
        'Java': 'http://www.java.com/zh_CN/download/',
        'Node': 'http://nodejs.org/download/',
        'fis': 'npm install fis -g --registry=http://registry.npm.taobao.org/',
        'pure': 'npm install fis-pure -g --registry=http://registry.npm.taobao.org/'
    },
    'command':{
        'checkJava':'java -version',
        'checkNode':'node -v',
        'checkFis':'fis --no-color -v',
        'checkPure':'pure --no-color -v'

    }
};

