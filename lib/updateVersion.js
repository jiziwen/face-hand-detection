const spawn = require('cross-spawn')
const child_process = require('child_process');
const inquirer = require('inquirer')
const chalk = require('chalk')

function needUpdate(){
    return new Promise(async resolve => {
        const { needUpdate } = await inquirer.prompt([
            {
                name:'needUpdate',
                type: 'list',
                choices: [
                    {
                        name: '马上更新',
                        value: true
                    },
                    {
                        name: '以后再说',
                        value: false
                    },
                ],
                message: '发现新版本是否要更新？'
            }
        ])
        resolve(needUpdate);
    })
}

module.exports = function checkVersion(){
    return new Promise(resolve => {
        child_process.exec('npm view mall-cli-project version ', function (error, stdout, stderr) {
            if (error) {
                // console.log(error.stack);
                // console.log('Error code: '+error.code);
                // console.log('Signal received: '+error.signal);
            }
            if(stdout){
                const currentVersion = require('../package.json').version;
                if(stdout.trim() != currentVersion.trim()){
                    console.log('仓库最新版本: ' + stdout);
                    console.log('当前版本: ' + currentVersion);
                    console.log(`\r\n${chalk.cyan('有新版本哦 请更新版本！')}\r\n`);
                    
                    resolve();
                    // const isNeed = await needUpdate();
                    // if(isNeed){
                    //     console.log(`\r\n${chalk.cyan('马上更新！')}`);
                    //     const workerProcess = child_process.exec('npm install -g mall-cli-project', function (stdout3) {
                    //         console.log('stdout: ' + stdout3);
                    //     });
                    //     workerProcess.on('exit', function (code) {
                    //         console.log(`\r\n${chalk.cyan('更新完成！')}`);

                    //         resolve();
                    //     });
                    // }else{
                    //     resolve();
                    // }
                }else{
                    resolve();
                }
            }else{
                resolve();
            }
        });
    })
};