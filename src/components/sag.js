export function selectedSagItems(state) {
  return Object.entries(state.sagProducts).filter(([, value]) => value).map(([key]) => key);
}

export function declarationSummary(state) {
  const selected = selectedSagItems(state);
  const label = selected.length ? `${selected.length} declarados` : "Sin productos declarados";
  const preview = selected.length ? selected.slice(0, 2).join(", ") : "La declaracion SAG se completa en su propia seccion.";
  return `<article class="declaration-summary">
    <div>
      <strong>Declaracion SAG</strong>
      <span>${label}</span>
      <small>${preview}${selected.length > 2 ? "..." : ""}</small>
    </div>
    <button class="link-btn" data-go="sag">Revisar</button>
  </article>`;
}

export function productCard(label, selected) {
  const imageNames = {
    "Frutas y verduras": "premium_frutas_y_verduras",
    "Semillas y plantas": "premium_semillas_y_plantas",
    "Carnes y embutidos": "premium_carnes_y_embutidos",
    "Lacteos y derivados": "premium_lacteos_y_derivados",
    "Mascotas": "premium_mascotas"
  };
  
  return `<button class="product-card ${selected ? "selected" : ""}" data-sag="${label}">
    <span class="product-art-frame">
      <img src="assets/sag/${imageNames[label]}.png" class="product-illustration" alt="${label}" />
    </span>
    <span class="label-text">${label}</span>
    <div class="status-row">
      <span>${selected ? "Sí" : "No"}</span>
      ${selected ? `
        <svg class="check-badge" width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#28aa6e"/>
          <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      ` : `
        <span class="empty-dot"></span>
      `}
    </div>
  </button>`;
}
