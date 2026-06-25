import QRCode from 'qrcode';

export function drawQr() {
  const canvas = document.querySelector("#qr-canvas");
  if (!canvas) return;

  const url = "https://www.youtube.com/watch?v=QDia3e12czc";

  QRCode.toCanvas(
    canvas,
    url,
    {
      width: 250,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }
  ).then(() => {
    const ctx = canvas.getContext("2d");

    // Draw center logo frame (white rounded rectangle with blue triangles)
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(91, 91, 68, 68, 16);
    ctx.fill();

    ctx.fillStyle = "#0b4bc2";
    ctx.font = "700 18px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("△△", 125, 132);
  }).catch(err => {
    console.error("Failed to generate QR Code", err);
  });
}
