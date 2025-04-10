import { generateQRCode } from "../src";
import { writeFileSync } from "fs";
import { join } from "path";

async function demo() {
  try {
    // 在线logo示例
    const onlineLogo =
      "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";

    // 本地logo示例
    const localLogo = join(__dirname, "logo.png");

    const canvas = await generateQRCode("https://github.com", {
      size: 400,
      logo: onlineLogo, // 或者使用 localLogo
      logoSize: 100,
      color: "#000000",
      background: "#FFFFFF",
    });

    const buffer = canvas.toBuffer("image/png");
    writeFileSync("qrcode.png", buffer);

    console.log("QR code generated successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

demo();
