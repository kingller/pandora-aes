"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sjcl_1 = __importDefault(require("sjcl"));
var AES = /** @class */ (function () {
    function AES() {
        var _this = this;
        /** 生成秘钥 */
        this.createKey = function (length) {
            if (length === void 0) { length = 32; }
            var str = '';
            for (var i = 0; i < length; i++) {
                var num = ((Math.random() * 10000) % 94) + 33;
                str += String.fromCharCode(num);
            }
            _this._key = str;
            return _this._key;
        };
        /** 获取秘钥 */
        this.getKey = function () {
            return _this._key;
        };
        /** 设置秘钥 */
        this.setKey = function (key) {
            _this._key = key;
        };
        /** 清除秘钥 */
        this.clearKey = function () {
            _this._key = undefined;
        };
        /**
         * 加密
         * @param data 数据
         * @param key 秘钥（可选）
         * @param options 自定义选项（可选 { ts?: number, mode?: 'ccm' | 'gcm' | 'ocb2', iv?: base64 encode string, salt?: base64 encode string }）
         */
        this.encrypt = function (data, key, options) {
            if (!key) {
                key = _this._key;
            }
            var iv = _this.createRandomIv();
            var encryptParams = {
                mode: 'gcm',
                ts: 128,
                iv: iv,
            };
            if (options) {
                for (var _i = 0, _a = Object.keys(options); _i < _a.length; _i++) {
                    var k = _a[_i];
                    var paramValue = options[k];
                    if ((k === 'salt' || k === 'iv') && typeof paramValue === 'string') {
                        paramValue = sjcl_1.default.codec.base64.toBits(paramValue);
                    }
                    encryptParams[k] = paramValue;
                }
            }
            var encryptedData = sjcl_1.default.encrypt(sjcl_1.default.codec.utf8String.toBits(key), JSON.stringify(data), encryptParams);
            var encryptedDataObj = JSON.parse(encryptedData);
            var encryptMsg = "" + encryptedDataObj.iv + encryptedDataObj.ct;
            return encryptMsg;
        };
        /**
         * 解密
         * @param message 密文
         * @param key 秘钥（可选）
         * @param options 自定义选项（可选 { ts?: number, mode?: 'ccm' | 'gcm' | 'ocb2', iv?: base64 encode string, salt?: base64 encode string }）
         */
        this.decrypt = function (message, key, options) {
            if (!message) {
                return null;
            }
            if (!key) {
                key = _this._key;
            }
            var iv;
            var ct;
            if (options && options.iv) {
                iv = options.iv;
                ct = message;
            }
            else {
                var dataBitArray = sjcl_1.default.codec.base64.toBits(message);
                iv = sjcl_1.default.codec.base64.fromBits(dataBitArray.slice(0, 3));
                ct = sjcl_1.default.codec.base64.fromBits(dataBitArray.slice(3));
            }
            var decryptParams = {
                mode: 'gcm',
                ts: 128,
                ct: ct,
                iv: iv,
            };
            if (options) {
                for (var _i = 0, _a = Object.keys(options); _i < _a.length; _i++) {
                    var k = _a[_i];
                    decryptParams[k] = options[k];
                }
            }
            var plainText = sjcl_1.default.decrypt(sjcl_1.default.codec.utf8String.toBits(key), JSON.stringify(decryptParams));
            return JSON.parse(plainText);
        };
    }
    /** 12 bytes 的iv */
    AES.prototype.createRandomIv = function () {
        return sjcl_1.default.random.randomWords(3);
    };
    return AES;
}());
exports.AES = AES;
exports.default = new AES();
