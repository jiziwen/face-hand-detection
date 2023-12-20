|-- work
    |-- .DS_Store
    |-- .npmignore
    |-- README.md
    |-- directoryList.md
    |-- package.json
    |-- assets
    |   |-- github.png  // 示例图片
    |-- bin
    |   |-- .DS_Store
    |   |-- cli.js  // 命令入口文件
    |-- lib
    |   |-- Generator.js    // 核心功能
    |   |-- create.js   // 创建项目之前的操作
    |   |-- updateVersion.js    // 检查此项目版本
    |   |-- service
    |   |   |-- index.js    // 请求api
    |   |-- utils
    |       |-- http.js     // axios封装
    |       |-- loading.js  // 加载器
    |       |-- op-template.js  // 操作自定义模板
    |       |-- op-token.js // 操作token
    |       |-- token.json  // token文件
    |-- template
        |-- index.json  // 自定义模板文件
