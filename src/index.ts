import { createCanvas, loadImage, Canvas } from "canvas";
import QRCode from "qrcode";
import { QRCodeOptions } from "./types";

export async function generateQRCode(
  text: string,
  options: QRCodeOptions = {}
): Promise<Canvas> {
  const {
    size = 400,
    margin = 0,
    color = "#000000",
    background = "#FFFFFF",
    logoSize = size * 0.25,
  } = options;

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get canvas context");

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
      const logo = await loadImage(options.logo);
      const x = (size - logoSize) / 2;
      const y = (size - logoSize) / 2;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(x, y, logoSize, logoSize);
      ctx.drawImage(logo, x, y, logoSize, logoSize);
    } catch (error) {
      console.error("Error loading logo:", error);
      throw error;
    }
  }

  return canvas;
}

export type { QRCodeOptions };
