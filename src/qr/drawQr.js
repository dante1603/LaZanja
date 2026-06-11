export function drawQr() {
  const canvas = document.querySelector("#qr-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const cells = 29;
  const cell = size / cells;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, size, size);

  function finder(x, y) {
    ctx.fillStyle = "#000";
    ctx.fillRect(x * cell, y * cell, 7 * cell, 7 * cell);
    ctx.fillStyle = "#fff";
    ctx.fillRect((x + 1) * cell, (y + 1) * cell, 5 * cell, 5 * cell);
    ctx.fillStyle = "#000";
    ctx.fillRect((x + 2) * cell, (y + 2) * cell, 3 * cell, 3 * cell);
  }

  finder(2, 2);
  finder(20, 2);
  finder(2, 20);

  let seed = 78941;
  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      const inFinder = (x >= 2 && x < 9 && y >= 2 && y < 9) || (x >= 20 && x < 27 && y >= 2 && y < 9) || (x >= 2 && x < 9 && y >= 20 && y < 27);
      if (inFinder) continue;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      if ((seed + x * 7 + y * 11) % 4 === 0) {
        ctx.fillStyle = "#000";
        ctx.fillRect(Math.floor(x * cell), Math.floor(y * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
  }

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(91, 91, 68, 68, 16);
  ctx.fill();
  ctx.fillStyle = "#0b4bc2";
  ctx.font = "700 18px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("△△", 125, 132);
}
