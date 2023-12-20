const ora = require("ora");

// 加载loading
module.exports = async function (fn, msg, ...arg) {
    // 使用 ora 初始化，传入提示信息 msg
    const spinner = ora(msg);
    // 开始加载动画
    spinner.start();

    try {
        const result = await fn(...arg);
        spinner.succeed();
        return result;
    } catch (error) {
        spinner.fail("请求失败...");
        return error;
    }
}