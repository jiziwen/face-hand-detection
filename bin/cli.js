#! /usr/bin/env node

// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

// 用于检测入口文件是否正常运行
console.log("mall-cli working...");

const program = require("commander");
const figlet = require("figlet");
const checkVersion = require("../lib/updateVersion");

program
  .command("create <app-name>")
  .description("创建一个新项目")
  .option("-f, --force", "如果创建的目录存在则直接覆盖")
  .action(async (name, options) => {
    await checkVersion();
    require("../lib/create")(name, options);
  });

program
  .command("set <cli-token>")
  .description("设置gitlab仓库地址")
  .action(async (path) => {
    console.log("path: ", path);
    require("../lib/utils/op-token").set(path);
  });

program
  .command("write <cli-token>")
  .description("写入gitlab的AccessToken")
  .action(async (token) => {
    console.log("token: ", token);
    require("../lib/utils/op-token").write(token);
  });

program
  .command("viewToken")
  .description("查看token")
  .action(async (token) => {
    require("../lib/utils/op-token").show();
  });

program
  .command("add <template-url>")
  .description("添加自定义模板")
  .action(async (url) => {
    require("../lib/utils/op-template").add(url);
  });

program
  .command("remove <template-url>")
  .description("移除自定义模板")
  .action(async (url) => {
    require("../lib/utils/op-template").remove(url);
  });

program
  .command("clear")
  .description("清空自定义模板")
  .action(async () => {
    require("../lib/utils/op-template").clear();
  });

program
  .version(`v${require("../package.json").version}`)
  .usage("<command> [option]");

program.on("--help", () => {
  console.log(
    "\r\n" +
      figlet.textSync("mall-cli", {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
  );
});

// 解析用户执行命令传入参数
program.parse(process.argv);
