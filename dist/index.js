"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = void 0;
const canvas_1 = require("canvas");
const qrcode_1 = __importDefault(require("qrcode"));
async function generateQRCode(text, options = {}) {
    const { size = 400, margin = 0, color = "#000000", background = "#FFFFFF", logoSize = size * 0.25, } = options;
    const canvas = (0, canvas_1.createCanvas)(size, size);
    const ctx = canvas.getContext("2d");
    if (!ctx)
        throw new Error("Cannot get canvas context");
    await qrcode_1.default.toCanvas(canvas, text, {
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
            const logo = await (0, canvas_1.loadImage)(options.logo);
            const x = (size - logoSize) / 2;
            const y = (size - logoSize) / 2;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(x, y, logoSize, logoSize);
            ctx.drawImage(logo, x, y, logoSize, logoSize);
        }
        catch (error) {
            console.error("Error loading logo:", error);
            throw error;
        }
    }
    return canvas;
}
exports.generateQRCode = generateQRCode;
