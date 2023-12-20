const axios = require("axios");
const gitlabJson = require("./gitlab.json");

// 创建axios实例s
const service = axios.create({
  baseURL: (gitlabJson.path || "https://git.17usoft.com") + "/api/v3",
  timeout: 10 * 1000, // 请求超时时间
});

// request拦截器,拦截每一个请求加上请求头
service.interceptors.request.use(
  (config) => {
    config.headers["PRIVATE-TOKEN"] = gitlabJson.token; // 'gYqBhJa_29qNbMHALuVE'
    return config;
  },
  (error) => {
    console.log(error); // for debug
    Promise.reject(error);
  }
);

module.exports = {
  service: service,
};
