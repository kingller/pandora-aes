export declare class AES {
    private _key;
    /** 生成秘钥 */
    createKey: (length?: number) => string;
    /** 获取秘钥 */
    getKey: () => string;
    /** 设置秘钥 */
    setKey: (key: string) => void;
    /** 清除秘钥 */
    clearKey: () => void;
    /** 12 bytes 的iv */
    private createRandomIv;
    /**
     * 加密
     * @param data 数据
     * @param key 秘钥（可选）
     * @param options 自定义选项（可选 { ts?: number, mode?: 'ccm' | 'gcm' | 'ocb2', iv?: base64 encode string, salt?: base64 encode string }）
     */
    encrypt: (data: any, key?: string, options?: {
        /** ts */
        ts?: number;
        /** mode */
        mode?: 'ccm' | 'gcm' | 'ocb2';
        /** iv (base64 encode) */
        iv?: string;
        /** salt (base64 encode) */
        salt?: string;
    }) => string;
    /**
     * 解密
     * @param message 密文
     * @param key 秘钥（可选）
     * @param options 自定义选项（可选 { ts?: number, mode?: 'ccm' | 'gcm' | 'ocb2', iv?: base64 encode string, salt?: base64 encode string }）
     */
    decrypt: <T = any>(message: string, key?: string, options?: {
        /** ts */
        ts?: number;
        /** mode */
        mode?: 'ccm' | 'gcm' | 'ocb2';
        /** iv (base64 encode) */
        iv?: string;
        /** salt (base64 encode) */
        salt?: string;
    }) => T;
}
declare const _default: AES;
export default _default;
