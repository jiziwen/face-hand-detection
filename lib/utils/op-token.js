const fs = require("fs");
const chalk = require("chalk");

const set = async function (path) {
  // gitlab.json文件
  const res = fs.readFileSync(__dirname + "/gitlab.json", "utf8");
  const obj = JSON.parse(res);
  // 替换用户输入的path
  obj.path = path;
  // 改写文件内容
  fs.writeFileSync(__dirname + "/gitlab.json", JSON.stringify(obj), "utf8");
  console.log(`\r\n${chalk.cyan("设置path完成！")}\r\n`);
};

const write = async function (token) {
  // 读取gitlab.json文件
  const res = fs.readFileSync(__dirname + "/gitlab.json", "utf8");
  const obj = JSON.parse(res);
  // 替换用户输入的token
  obj.token = token;
  // 改写文件内容
  fs.writeFileSync(__dirname + "/gitlab.json", JSON.stringify(obj), "utf8");
  console.log(`\r\n${chalk.cyan("写入token完成！")}\r\n`);
};

const show = function (token) {
  // 读取gitlab.json文件
  const res = fs.readFileSync(__dirname + "/gitlab.json", "utf8");
  const obj = JSON.parse(res);
  console.log(`\r\n${chalk.cyan("gitlab仓库地址：" + obj.path)}\r\n`);
  console.log(`\r\n${chalk.cyan("token：" + obj.token)}\r\n`);
};

module.exports = {
  set,
  write,
  show,
};
