const path = require("path");
const inquirer = require("inquirer");
const gitlabJson = require("./utils/gitlab.json");
const templates = require("../template/index.json");
const downloadGitRepo = require("download-git-repo");
const util = require("util");
const chalk = require("chalk");
const fs = require("fs-extra");
const ejs = require("ejs");
const spawn = require("cross-spawn");
// const npminstall = require('npminstall');
const child_process = require("child_process");
const request = require("./service/index");
const loading =require("./utils/loading");

// 如果没有token 且 自定义模板数据不为空，就下载自定义模板
const isDownloadCustomTemp = !gitlabJson.token && templates.temps.length;

class Generator {
    constructor(name, targetDir) {
        this.name = name;
        this.targetDir = targetDir;
        this.list = [];
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    // 获取模板列表 并选择
    async getRepo() {
        const _this = this;
        // 调用获取git代码库
        function fn() {
            return new Promise(async (resolve, reject) => {
                if(isDownloadCustomTemp){
                    resolve(templates.temps);
                }else if(gitlabJson.token){
                    const list = await request.getRepositories();
                    resolve(list);
                }else{
                    reject()
                }
            });
        }

        this.list = await loading(fn, "获取模板列表...");
        if(this.list && this.list.toString().indexOf("Error") > -1){
            console.log(`\r\n${chalk.red("请添加自定义模板或者写入token后再重试！")}`);
            return;
        }else if(!this.list){
            return;
        }

        // 取出项目列表的项目名称
        const repos = this.list.map((v) => v.name);

        const { repo } = await inquirer.prompt([
            {
                name: "repo",
                type: "list",
                choices: repos,
                message: "请选择你需要的项目模板",
            },
        ]);

        return repo;
    }

    // 选择模板的版本（tag）
    async selectTemplateVersion(repo) {
        const repoItem = this.list.find((v) => v.name === repo);
        if (repoItem && !isDownloadCustomTemp) {
            // 接口获取tags
            function fn() {
                return new Promise(async (resolve) => {
                    const list = await request.getTags(repoItem.id);
                    resolve(list);
                });
            }

            const tags = await loading(fn, "获取模板版本...");

            // 如果tags数量大于1 让用户选择版本 以供下载
            if (tags && tags.length > 1) {
                const { selectTag } = await inquirer.prompt([
                    {
                        name: "selectTag",
                        type: "list",
                        choices: tags,
                        message: "请选择项目模板版本",
                    },
                ]);

                return selectTag;
            }
        }
    }

    // 下载项目
    download(tempName, tempTag) {
        return new Promise(async resolve => {
            const repo = this.list.find((v) => v.name === tempName);
            // 自定义模板取url，gitlab取http_url_to_repo
            const url = isDownloadCustomTemp ? repo.url : repo.http_url_to_repo;
            // 如果是自定义的github模板，且使用的地址是类似 chuzhixin/vue-admin-better，就不使用direct：
            const requestUrl = `${url.includes('https://') || url.includes('http://') ? 'direct:' : ''}${url}${tempTag ? "#" + tempTag : ""
                }`;
            const result = await loading(
                this.downloadGitRepo,
                "下载模板中...",
                requestUrl,
                path.resolve(process.cwd(), this.targetDir),
                { clone: true }
            );
            resolve(!result);
        })
    }

    // 注入项目名称
    async injectName() {
        return new Promise((resolve) => {
            const dir = path.resolve(process.cwd(), this.targetDir);
            fs.readdir(dir, (err, files) => {
                if (err) throw err;
                if (!files.length) resolve();
                files.forEach((file) => {
                    // 通过ejs 注入
                    // console.log(file);
                    let f = false;
                    [".js", ".html", ".vue", ".wxml", ".jsx", ".ts", ".json"].forEach(
                        (v) => {
                            if (file.toString().indexOf(v) > -1) {
                                f = true;
                                ejs
                                    .renderFile(path.join(dir, file), { name: this.name })
                                    .then((data) => {
                                        fs.writeFileSync(path.join(dir, file), data);
                                        resolve();
                                        // console.log(`\r\n注入项目名称完成`);
                                    });
                            }
                        }
                    );
                    if (!f) resolve();
                });
            });
        });
    }

    // 下载依赖
    async npmInstall() {
        const dir = path.resolve(process.cwd(), this.targetDir);
        // 存在package.json 再下载依赖
        if (fs.pathExistsSync(path.join(dir, "package.json"))) {
            const isCountinue = await this.installOrNot();
            if (!isCountinue) {
                console.log(`\r\n${chalk.cyan("可以开始一段快乐的编码啦！")}`);
                return;
            }

            const { packager } = await inquirer.prompt([
                {
                    name: "packager",
                    type: "list",
                    choices: ["npm", "yarn"],
                    message: "请选择你使用的包管理工具",
                },
            ]);

            // 使用 node版本 12.22.1
            // spawn(
            //     'nvm',
            //     ['use', '12.22.1'],
            //     { cwd: dir, stdio: 'inherit' }
            // ).once('close', (val, val2)=>{
            //     console.log(val, val2)
            // })

            // 执行install 命令
            const process = spawn(
                packager,
                ["install", "--save", "--save-exact", "--loglevel", "error"],
                { cwd: dir, stdio: "inherit" }
            );
            process.once("close", (code, val2) => {
                if (code == "0") {
                    console.log(`\r\n${chalk.cyan("下载依赖完成！")}`);
                    console.log(`\r\n${chalk.cyan("可以开始一段快乐的编码啦！")}`);
                }
            });
        }
    }

    // 让用户选择是否下载依赖
    async installOrNot() {
        return new Promise(async (resolve) => {
            const { action } = await inquirer.prompt([
                {
                    name: "action",
                    type: "list", // 列表选择
                    message: "是否立即下载依赖",
                    choices: [
                        {
                            name: "立即下载",
                            value: "install",
                        },
                        {
                            name: "取消",
                            value: false,
                        },
                    ],
                },
            ]);

            if (!action) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    }

    async create() {
        // 1. 获取模板列表 并选择项目模板
        const repo = await this.getRepo();
        if(!repo){
            return;
        }
        console.log("您选择了：" + repo);

        // 2. 选择模板的版本
        const tag = await this.selectTemplateVersion(repo);

        // 3. 下载项目模板
        const isSuccess = await this.download(repo, tag);
        if(!isSuccess){
            console.log(`\r\n下载项目失败，请重试`);
            return;
        }

        // 4. 下载完成使用提示
        console.log(`\r\n成功下载项目：${chalk.cyan(this.name)}`);

        // // 5. 注入项目名称
        // await this.injectName();

        // // 6. 下载依赖
        // this.npmInstall();
    }
}

module.exports = Generator;
