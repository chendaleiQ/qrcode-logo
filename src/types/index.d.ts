import { Canvas } from "canvas";

export interface QRCodeOptions {
  size?: number;
  logo?: string;
  logoSize?: number;
  margin?: number;
  color?: string;
  background?: string;
}

export function generateQRCode(
  text: string,
  options?: QRCodeOptions
): Promise<Canvas>;
