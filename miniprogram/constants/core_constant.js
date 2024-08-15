const URI = "https://sports.erpsu.com.cn:443"
const API_PREFIX_V1 = URI + "/api/v1/"
module.exports = {
    URL: URI,
    API_PREFIX_V1: API_PREFIX_V1,
    API_V1_LOGIN: API_PREFIX_V1 + "login",
    API_V1_CHECK_TOKEN: API_PREFIX_V1 + "get",

    LOGIN_SUCCESS_CODE: 800,
    LOGIN_FAILED_CODE: 801,
}