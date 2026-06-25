export function createQrScanner({ onComplete, delayMs = 1500 }) {
  let timeoutId = null;

  function stop() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function start() {
    stop();
    timeoutId = setTimeout(() => {
      timeoutId = null;
      onComplete();
    }, delayMs);
  }

  return { start, stop };
}
