const { service: axios} = require('../utils/http')
const chalk = require("chalk");

// 获取git代码库 模板list
const getRepositories = function(){
    return new Promise((resolve) => {
        axios.get('/projects', {
            params:{simple: true, per_page:100}
        }).then(res => {
            const arr = res.data.filter(v => v.name.indexOf('template-') === 0);

            if(arr.length > 0){
                resolve(arr)
            }else{
                console.log(`\r\n${chalk.red("没有查到以template-开始的项目名！")}`);
                resolve();
            }
        }).catch(err => {
            resolve(new Error());
        })
    })
}

// 获取选定模板的所有tag（版本）
const getTags = function(id){
    return new Promise((resolve) => {
        axios.get(`/projects/${id}/repository/tags`).then(res => {
            const arr = res.data.map(v => v.name)
            resolve(arr)
        }).catch(err => {
            resolve(new Error());
        })
    })
}
module.exports = {
    getRepositories,
    getTags
}