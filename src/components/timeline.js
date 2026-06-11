export function timeline(title, status, done, pending = false) {
  return `<div class="timeline-item ${done ? "" : "pending"}">
    <span class="timeline-dot">${done ? "OK" : "&bull;"}</span>
    <span><strong>${title}</strong><br/><small class="muted">${status}</small></span>
    <span>${pending ? "QR" : ""}</span>
  </div>`;
}
