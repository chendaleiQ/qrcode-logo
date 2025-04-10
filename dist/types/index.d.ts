import { Canvas } from "canvas";
import { QRCodeOptions } from "./types";
export declare function generateQRCode(text: string, options?: QRCodeOptions): Promise<Canvas>;
export type { QRCodeOptions };
