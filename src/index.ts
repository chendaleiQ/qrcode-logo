import { createCanvas, loadImage, Canvas } from "canvas";
import QRCode from "qrcode";
import { QRCodeOptions } from "./types";
import https from "https";
import http from "http";

// 设置全局的 https 代理选项
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// 创建一个自定义的 loadImage 函数来处理 SSL 证书错误
async function loadImageWithSSL(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = url.startsWith('https') ? { rejectUnauthorized: false } : {};
    
    protocol.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to load image: ${response.statusCode}`));
        return;
      }

      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to decode image data'));
        img.src = `data:${response.headers['content-type']};base64,${buffer.toString('base64')}`;
      });
    }).on('error', (err) => {
      reject(new Error(`Failed to load image: ${err.message}`));
    });
  });
}

export async function generateQRCode(
  text: string,
  options: QRCodeOptions = {}
): Promise<Canvas> {
  const {
    size = 400,
    margin = 0,
    color = "#000000",
    background = "#FFFFFF",
    logoSize = size * 0.2, // 减小 logo 的默认大小
  } = options;

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get canvas context");

  // 先绘制二维码
  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin,
    color: {
      dark: color,
      light: background,
    },
    errorCorrectionLevel: "H",
  });

  if (options.logo) {
    try {
      // 设置全局的 https 代理
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      const logo = await loadImage(options.logo);
      // 恢复默认的 SSL 验证
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
      
      // 计算 logo 的位置和大小
      const logoMargin = size * 0.05; // logo 周围的空白区域
      const logoAreaSize = logoSize + logoMargin * 2;
      const x = (size - logoAreaSize) / 2;
      const y = (size - logoAreaSize) / 2;

      // 绘制白色背景
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(x, y, logoAreaSize, logoAreaSize);

      // 绘制 logo
      const logoX = x + logoMargin;
      const logoY = y + logoMargin;
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

      // 在 logo 周围添加一个细边框，提高识别率
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, logoAreaSize, logoAreaSize);
    } catch (error) {
      console.error("Error loading logo:", error);
      // 恢复默认的 SSL 验证
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
      // 不再抛出错误，而是继续生成没有 logo 的二维码
      console.warn("Proceeding without logo due to loading error");
    }
  }

  return canvas;
}

export type { QRCodeOptions };
