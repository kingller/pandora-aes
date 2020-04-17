# pandora-aes
Javascript AES Crypto Library which support web and nodejs

## Install

```bash
npm install pandora-aes
``` 

## Usage

AES 加密解密。默认使用`gcm`模式。

### createKey 生成密钥

```javascript
import AES from 'pandora-aes';

AES.createKey();
```

使用该方法生成密钥后，会缓存该密钥，使用加密（encrypt）或解密（decrypt）方法时也可不提供密钥。

### encrypt 加密

```javascript
import AES from 'pandora-aes';

AES.encrypt(data, '密钥');
```

该方法会先执行JSON.stringify(data)，将数据转为json格式的字符串，然后使用AES加密。

### decrypt 解密

```javascript
import AES from 'pandora-aes';

AES.decrypt('encrypted message', '密钥');
```

该方法会使用AES解密，再执行JSON.parse，获取数据。

### getKey 获取密钥

```javascript
import AES from 'pandora-aes';

AES.getKey();
```

### setKey 设置密钥

```javascript
import AES from 'pandora-aes';

AES.setKey('密钥');
```

### clearKey 清除密钥

```javascript
import AES from 'pandora-aes';

AES.clearKey();
```

## 代码示例
[AES加解密代码示例](https://www.jianshu.com/p/50a868842501)
