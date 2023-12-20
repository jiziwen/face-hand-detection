const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

// 添加模板
const add = async function(url){
    const res = fs.readFileSync(path.join(__dirname, "../../template/index.json"), "utf8")
    const json = JSON.parse(res)

    if(json.temps.find(v => v.url === url)){
        console.log(`\r\n${chalk.red('已经存在此模板，不能重复添加！')}`)
        return;
    }

    // 通过地址解析其项目名称
    let name = "";
    const arr = url.split('/');
    const text = arr[arr.length - 1];
    if(url.includes("https://")){
        name = text.replace(".git", "");
    }

    const obj = {
        name,
        url
    };
    json.temps.push(obj);
    // 改写文件内容
    fs.writeFileSync(path.join(__dirname, "../../template/index.json"), JSON.stringify(json), "utf8")
    console.log(`\r\n${chalk.cyan('添加自定义模板完成！')}`)
}

// 移除模板
const remove = async function(url){
    const res = fs.readFileSync(path.join(__dirname, "../../template/index.json"), "utf8")
    const json = JSON.parse(res)

    const index = json.temps.findIndex(v => v.url === url)
    index > -1 && json.temps.splice(index, 1);
    // 改写文件内容
    fs.writeFileSync(path.join(__dirname, "../../template/index.json"), JSON.stringify(json), "utf8")
    console.log(`\r\n${chalk.cyan('移除自定义模板完成！')}`)
}

// 清空模板
const clear = async function(){
    const res = fs.readFileSync(path.join(__dirname, "../../template/index.json"), "utf8")
    const json = JSON.parse(res)

    json.temps = [];
    // 改写文件内容
    fs.writeFileSync(path.join(__dirname, "../../template/index.json"), JSON.stringify(json), "utf8")
    console.log(`\r\n${chalk.cyan('清空自定义模板完成！')}`)
}

module.exports = {
    add,
    remove,
    clear
}