const URI = "https://sports.erpsu.com.cn:443"
const API_PREFIX_V1 = URI+"/api/v1/"
const API_V1_LOGIN = API_PREFIX_V1 + "login"
module.exports = {
    URL: URI,
    API_PREFIX_V1: API_PREFIX_V1,
    API_V1_LOGIN: API_V1_LOGIN,

    LOGIN_SUCCESS_CODE: 800,
    LOGIN_FAILED_CODE: 801,
}