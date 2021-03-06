define(function (require, exports, module) {
    var toString = Object.prototype.toString;
    var isString = function (obj) {
        return toString.call(obj) === '[object String]';
    };

    var forEach = function (obj, func) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && func) {
                func.call(obj, obj[key], key, obj);
            }
        }
    };

    /* @note    用于登录注册的邮箱、手机号、密码等等的统一验证，将其与错误消息提醒分开
     *          以防验证规则不一致 各处代码随意编写导致的混乱情况
     * @author  Xaber
     * @rely    nothing
     * @see     https://github.com/Xaber20110202/Container/blob/master/JavaScript/2015.05.01-validate.js
     */
    var validateConfig = {
        rEmail : /^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/i,
        rPassword : /^[a-zA-Z0-9`~@!#$%^&*()-=_+]{6,16}$/,
        rPhone : /^1[3-578]\d{9}$/,
        rCharacter : /^[a-zA-Z\d]+$/,
        rNumber : /^\d+$/
    },
        validate = {};

    forEach(validateConfig, function (reg, key) {
        var name = 'check' + key.slice(1);
        validate[key] = reg;
        validate[name] = function (str) {
            return !!str && this[key].test(str);
        };
    });

    validate.ltLength = function (str, length) {
        return isString(str) && str.length < length;
    };

    validate.lteLength = function (str, length) {
        return isString(str) && str.length <= length;
    };

    validate.gtLength = function (str, length) {
        return isString(str) && str.length > length;
    };

    validate.gteLength = function (str, length) {
        return isString(str) && str.length >= length;
    };

    validate.eqLength = function (str, length) {
        return isString(str) && str.length === length;
    };

    module.exports = validate;
});