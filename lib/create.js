const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator =  require('./Generator')

module.exports = async function(name, options){
    // 当前命令执行的路劲
    const cwd = process.cwd();

    // 需要创建的目录地址
    const targetDir = path.join(cwd, name)

    // 如果目录已存在
    if(fs.existsSync(targetDir)){
        // 是否强制创建
        if(options.force){
            await fs.removeSync(targetDir);
        }else{
            const { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type:'list',  // 列表选择
                    message: '目标目录已经存在，请选择是否覆盖',
                    choices: [
                        {
                            name: '覆盖',
                            value: 'overwrite'
                        },
                        {
                            name: '取消',
                            value: false
                        },
                    ]
                }
            ])


            if(!action){
                return
            }else{
                console.log('\r\n移除中...')
                await fs.removeSync(targetDir)
            }
        }
    }


    const generator = new Generator(name, targetDir);
    // 开始创建项目
    generator.create();
}