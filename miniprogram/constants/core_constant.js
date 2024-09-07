const URI = "https://sports.erpsu.com.cn:443"
const API_PREFIX_V1 = URI + "/api/v1/"
const API_V1_FITNESS = API_PREFIX_V1 + "fitness/"
module.exports = {
    URL: URI,
    API_PREFIX_V1: API_PREFIX_V1,
    API_V1_LOGIN: API_PREFIX_V1 + "login",
    API_V1_CHECK_TOKEN: API_PREFIX_V1 + "get",
    API_V1_GETRESOURCE: API_V1_FITNESS + "wxresource",

    LOGIN_SUCCESS_CODE: 800,
    LOGIN_FAILED_CODE: 801,
}