# qrcode-in-logo

一个支持添加 logo 的二维码生成器，支持nodejs。

## 安装

```bash
npm install qrcode-in-logo
```

## 使用方法
```
import { generateQRCode } from 'qrcode-in-logo';
import { writeFileSync } from 'fs';

async function example() {
  const canvas = await generateQRCode('https://github.com', {
    size: 400,
    logo: 'path/to/logo.png', // 支持本地文件路径或URL
    logoSize: 100,
    color: '#000000',
    background: '#FFFFFF'
  });

  const buffer = canvas.toBuffer('image/png');
  writeFileSync('qrcode.png', buffer);
}
```

## 选项
- size: 二维码尺寸 (默认: 400)
- logo: logo 图片路径或 URL
- logoSize: logo 尺寸 (默认: size * 0.25)
- margin: 边距 (默认: 0)
- color: 二维码颜色 (默认: #000000)
- background: 背景颜色 (默认: #FFFFFF)

## 许可证
MIT