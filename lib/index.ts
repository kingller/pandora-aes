import sjcl, { BitArray } from 'sjcl';

interface IEncryptParams {
    ts?: number;
    mode?: string;
    salt: BitArray;
    iv: BitArray;
}

export class AES {
    private _key: string;

    /** 生成秘钥 */
    createKey = (length = 32): string => {
        let str = '';
        for (let i = 0; i < length; i++) {
            let num = ((Math.random() * 10000) % 94) + 33;
            str += String.fromCharCode(num);
        }
        this._key = str;
        return this._key;
    };

    /** 获取秘钥 */
    getKey = (): string => {
        return this._key;
    };

    /** 设置秘钥 */
    setKey = (key: string): void => {
        this._key = key;
    };

    /** 清除秘钥 */
    clearKey = (): void => {
        this._key = undefined;
    };

    /** 12 bytes 的iv */
    private createRandomIv(): BitArray {
        return sjcl.random.randomWords(3);
    }

    /**
     * 加密
     * @param data 数据
     * @param key 秘钥（可选）
     * @param options 自定义选项（可选 { ts?: number, mode?: 'ccm' | 'gcm' | 'ocb2', iv?: base64 encode string, salt?: base64 encode string }）
     */
    encrypt = (
        data: any,
        key?: string,
        options?: {
            /** ts */
            ts?: number;
            /** mode */
            mode?: 'ccm' | 'gcm' | 'ocb2';
            /** iv (base64 encode) */
            iv?: string;
            /** salt (base64 encode) */
            salt?: string;
        }
    ): string => {
        if (!key) {
            key = this._key;
        }
        const iv = this.createRandomIv();
        const encryptParams: Partial<IEncryptParams> = {
            mode: 'gcm',
            ts: 128,
            iv,
        };
        if (options) {
            for (const k of Object.keys(options)) {
                let paramValue: string | number | BitArray = (options as { [name: string]: number | string })[k];
                if ((k === 'salt' || k === 'iv') && typeof paramValue === 'string') {
                    paramValue = sjcl.codec.base64.toBits(paramValue);
                }
                (encryptParams as { [name: string]: number | string | BitArray })[k] = paramValue;
            }
        }
        const encryptedData = (sjcl.encrypt(
            sjcl.codec.utf8String.toBits(key),
            JSON.stringify(data),
            encryptParams as IEncryptParams
        ) as any) as string;
        const encryptedDataObj = JSON.parse(encryptedData);
        const encryptMsg = `${encryptedDataObj.iv}${encryptedDataObj.ct}`;
        return encryptMsg;
    };

    /**
     * 解密
     * @param message 密文
     * @param key 秘钥（可选）
     * @param options 自定义选项（可选 { ts?: number, mode?: 'ccm' | 'gcm' | 'ocb2', iv?: base64 encode string, salt?: base64 encode string }）
     */
    decrypt = <T = any>(
        message: string,
        key?: string,
        options?: {
            /** ts */
            ts?: number;
            /** mode */
            mode?: 'ccm' | 'gcm' | 'ocb2';
            /** iv (base64 encode) */
            iv?: string;
            /** salt (base64 encode) */
            salt?: string;
        }
    ): T => {
        if (!message) {
            return null;
        }

        if (!key) {
            key = this._key;
        }

        let iv: string;
        let ct: string;
        if (options && options.iv) {
            iv = options.iv;
            ct = message;
        } else {
            const dataBitArray = sjcl.codec.base64.toBits(message);
            iv = sjcl.codec.base64.fromBits(dataBitArray.slice(0, 3));
            ct = sjcl.codec.base64.fromBits(dataBitArray.slice(3));
        }

        const decryptParams: {
            ct: string;
            iv: string;
            /** ts */
            ts?: number;
            /** mode */
            mode?: 'ccm' | 'gcm' | 'ocb2';
            /** salt (base64 encode) */
            salt?: string;
        } = {
            mode: 'gcm',
            ts: 128,
            ct,
            iv,
        };
        if (options) {
            for (const k of Object.keys(options)) {
                (decryptParams as { [name: string]: number | string })[k] = (options as {
                    [name: string]: number | string;
                })[k];
            }
        }

        const plainText = sjcl.decrypt(sjcl.codec.utf8String.toBits(key), JSON.stringify(decryptParams));
        return JSON.parse(plainText);
    };
}

export default new AES();
