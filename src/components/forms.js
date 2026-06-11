export function smallToggle(key, label, selected) {
  return `<button class="choice ${selected ? "selected" : ""}" data-trip-toggle="${key}">
    <span>${label}</span><strong>${selected ? "Si OK" : "No ○"}</strong>
  </button>`;
}

export function detailRow(icon, label, value) {
  return `<div class="detail-row"><span style="color:var(--blue-700);font-weight:900">${icon}</span><span>${label}</span><strong>${value}</strong></div>`;
}
