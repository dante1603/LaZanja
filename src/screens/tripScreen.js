import { appFrame, frameOptions, stepper, topbar } from "../components/chrome.js";
import { selectedSagItems, productCard } from "../components/sag.js";

function getMinorsCardHtml(state) {
  const minorsFlag = state.trip.minors; // null, false, true
  const minorsList = state.trip.minorsList || [];
  
  let statusClass = "state-pending";
  let iconHtml = "";
  let statusLabel = "";
  let summary = "";
  let actionText = "Completar";
  
  if (minorsFlag === null) {
    statusClass = "state-pending";
    iconHtml = `<svg class="req-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>`;
    statusLabel = "Pendiente";
    summary = "Indica si viajan menores";
    actionText = "Responder";
  } else if (minorsFlag === false) {
    statusClass = "state-complete";
    iconHtml = `<svg class="req-icon" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#28aa6e"/>
      <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    statusLabel = "Completo";
    summary = "No viajan menores";
    actionText = "Revisar";
  } else if (minorsFlag === true) {
    if (minorsList.length === 0) {
      statusClass = "state-pending";
      iconHtml = `<svg class="req-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>`;
      statusLabel = "Incompleto";
      summary = "Agrega al menos 1 menor";
      actionText = "Completar";
    } else {
      const hasMissingData = minorsList.some(m => !m.name || !m.name.trim() || !m.document || !m.document.trim());
      const pendingCount = minorsList.filter(m => m.withBothParents === "no" && m.authorization === "pending").length;
      
      if (hasMissingData) {
        statusClass = "state-observation";
        iconHtml = `<svg class="req-icon" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`;
        statusLabel = "Falta información";
        summary = "Nombre o documento vacío";
        actionText = "Completar";
      } else if (pendingCount > 0) {
        statusClass = "state-observation";
        iconHtml = `<svg class="req-icon" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>`;
        statusLabel = `${pendingCount} documento${pendingCount > 1 ? "s" : ""} pendiente${pendingCount > 1 ? "s" : ""}`;
        summary = "Autorización notarial faltante";
        actionText = "Completar";
      } else {
        statusClass = "state-complete";
        iconHtml = `<svg class="req-icon" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#28aa6e"/>
          <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        statusLabel = `${minorsList.length} menor${minorsList.length > 1 ? "es" : ""} declarado${minorsList.length > 1 ? "s" : ""}`;
        summary = "Documentos completos";
        actionText = "Revisar";
      }
    }
  }
  
  return `
    <article class="requirement-card ${statusClass}" aria-label="Requisito menores de edad">
      <div class="req-icon-container">
        ${iconHtml}
      </div>
      <div class="req-content">
        <strong class="req-title">Menores de edad</strong>
        <span class="req-status">${statusLabel}</span>
        <small class="req-description">${summary}</small>
      </div>
      <button class="link-btn" data-action="open-minors-modal">${actionText}</button>
    </article>
  `;
}

function getSagCardHtml(state) {
  const selected = selectedSagItems(state);
  
  if (state.trip.sagConfirmed === false) {
    return `
      <article class="requirement-card state-pending" aria-label="Requisito declaración SAG">
        <div class="req-icon-container">
          <svg class="req-icon" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div class="req-content">
          <strong class="req-title">Declaración SAG</strong>
          <span class="req-status">Pendiente</span>
          <small class="req-description">Debes confirmar si llevas productos</small>
        </div>
        <button class="link-btn" data-action="open-sag-modal">Completar</button>
      </article>
    `;
  }

  if (selected.length === 0) {
    return `
      <article class="requirement-card state-complete" aria-label="Requisito declaración SAG">
        <div class="req-icon-container">
          <svg class="req-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#28aa6e"/>
            <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="req-content">
          <strong class="req-title">Declaración SAG</strong>
          <span class="req-status">Sin productos declarados</span>
          <small class="req-description">Declarado sin productos restringidos</small>
        </div>
        <button class="link-btn" data-action="open-sag-modal">Revisar</button>
      </article>
    `;
  }

  const formattedItems = selected.map(item => {
    if (item === "Frutas y verduras") return "Frutas/verduras";
    if (item === "Semillas y plantas") return "Semillas/plantas";
    if (item === "Carnes y embutidos") return "Carnes/embutidos";
    if (item === "Lacteos y derivados") return "Lácteos/derivados";
    return item;
  }).join(" · ");

  return `
    <article class="requirement-card state-info" aria-label="Requisito declaración SAG">
      <div class="req-icon-container">
        <svg class="req-icon" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </div>
      <div class="req-content">
        <strong class="req-title">Declaración SAG</strong>
        <span class="req-status">${selected.length} producto${selected.length > 1 ? "s" : ""} declarado${selected.length > 1 ? "s" : ""}</span>
        <small class="req-description">${formattedItems}</small>
      </div>
      <button class="link-btn" data-action="open-sag-modal">Revisar</button>
    </article>
  `;
}

export function getMinorsModalHtml(state) {
  const isActive = state.showMinorsModal ? "active" : "";
  const isMinors = state.trip.minors; // null, false, true
  const minorsList = state.trip.minorsList || [];

  const optionNoSelected = isMinors === false ? "selected" : "";
  const optionYesSelected = isMinors === true ? "selected" : "";

  let innerContentHtml = "";

  if (isMinors === null) {
    innerContentHtml = `
      <div style="text-align: center; padding: 20px 0; color: var(--muted); font-size: 13.5px; font-style: italic;">
        Selecciona si viajas con menores para continuar.
      </div>
    `;
  } else if (isMinors === false) {
    innerContentHtml = `
      <div style="background: #f4fbf7; border: 1.5px solid #28aa6e; border-radius: 12px; padding: 16px; text-align: center; color: #108552; font-weight: 750; margin-top: 10px;">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="vertical-align: middle; margin-right: 6px; display: inline-block;">
          <circle cx="10" cy="10" r="10" fill="#28aa6e"/>
          <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        No se registrarán menores para este viaje.
      </div>
    `;
  } else if (isMinors === true) {
    if (minorsList.length === 0) {
      innerContentHtml = `
        <div style="text-align: center; padding: 24px 16px; border: 1.5px dashed var(--line); border-radius: 14px; background: #fafafa; margin-top: 10px; display: grid; gap: 12px;">
          <span style="color: var(--muted); font-size: 13.5px; font-weight: 700;">Aún no has agregado menores.</span>
          <button class="add-minor-btn" data-action="add-minor-field" style="margin: 0 auto; width: auto; padding: 8px 16px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:middle; margin-right:2px">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            + Agregar menor
          </button>
        </div>
      `;
    } else {
      innerContentHtml = `
        <div class="minors-form-list" style="display:grid; gap:12px; margin-top:10px">
          ${minorsList.map((minor, index) => {
            const authDisabled = minor.withBothParents === "yes";
            
            let authSelectHtml = "";
            if (authDisabled) {
              authSelectHtml = `
                <select disabled style="background:#f1f5f9; color:#94a3b8; border-color:#e2e8f0; font-weight: 600;">
                  <option selected>No aplica</option>
                </select>
              `;
            } else {
              authSelectHtml = `
                <select data-minor-index="${index}" data-minor-field="authorization">
                  <option value="pending" ${minor.authorization === "pending" ? "selected" : ""}>Pendiente</option>
                  <option value="attached" ${minor.authorization === "attached" ? "selected" : ""}>Adjunta</option>
                </select>
              `;
            }

            return `
              <div class="minor-item-box">
                <div class="minor-item-header">
                  <span class="minor-item-title">Menor ${index + 1}</span>
                  <button class="remove-minor-btn" data-action="remove-minor-field" data-index="${index}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle; margin-right:2px">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Quitar
                  </button>
                </div>
                <div>
                  <label style="display:block; margin-bottom:4px; font-size:12.5px; font-weight:700">Nombre completo</label>
                  <input type="text" placeholder="Ej. Mateo Silva" value="${minor.name || ""}" data-minor-index="${index}" data-minor-field="name" />
                </div>
                <div>
                  <label style="display:block; margin-bottom:4px; font-size:12.5px; font-weight:700">Documento (RUT o pasaporte)</label>
                  <input type="text" placeholder="Ej. 24.567.890-K" value="${minor.document || ""}" data-minor-index="${index}" data-minor-field="document" />
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
                  <div>
                    <label style="display:block; margin-bottom:4px; font-size:12.5px; font-weight:700">¿Viaja con ambos padres?</label>
                    <select data-minor-index="${index}" data-minor-field="withBothParents">
                      <option value="yes" ${minor.withBothParents === "yes" ? "selected" : ""}>Sí</option>
                      <option value="no" ${minor.withBothParents === "no" ? "selected" : ""}>No</option>
                    </select>
                  </div>
                  <div>
                    <label style="display:block; margin-bottom:4px; font-size:12.5px; font-weight:700">Autorización notarial</label>
                    ${authSelectHtml}
                  </div>
                </div>
              </div>
            `;
          }).join("")}
          <button class="add-minor-btn" data-action="add-minor-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:middle; margin-right:2px">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Agregar menor
          </button>
        </div>
      `;
    }
  }

  return `
    <div id="minors-modal-overlay" class="bottom-sheet-overlay ${isActive}">
      <div class="bottom-sheet">
        <div class="bottom-sheet-header">
          <h3 class="bottom-sheet-title">Configurar menores de edad</h3>
          <button class="bottom-sheet-close" data-action="close-minors-modal" aria-label="Cerrar modal">&times;</button>
        </div>
        <div class="bottom-sheet-content">
          <label style="display:block; margin-bottom:6px; font-size:13px; font-weight:700">¿Viajan menores de edad en este viaje?</label>
          <div class="sheet-option-group">
            <div class="sheet-option-card ${optionNoSelected}" data-action="select-minors-option" data-value="no">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-bottom:2px">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              No viajan menores
            </div>
            <div class="sheet-option-card ${optionYesSelected}" data-action="select-minors-option" data-value="yes">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-bottom:2px">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Sí, viajan menores
            </div>
          </div>
          ${innerContentHtml}
        </div>
        <div class="bottom-sheet-footer">
          <button class="btn" data-action="save-minors-modal" ${isMinors === null ? "disabled" : ""}>Guardar</button>
        </div>
      </div>
    </div>
  `;
}

export function getSagModalHtml(state) {
  const isActive = state.showSagModal ? "active" : "";

  return `
    <div id="sag-modal-overlay" class="bottom-sheet-overlay ${isActive}">
      <div class="bottom-sheet" style="max-height: 90%;">
        <div class="bottom-sheet-header">
          <h3 class="bottom-sheet-title">Declaración SAG</h3>
          <button class="bottom-sheet-close" data-action="close-sag-modal" aria-label="Cerrar modal">&times;</button>
        </div>
        <div class="bottom-sheet-content" style="max-height: 500px;">
          <label style="display:block; margin-bottom:2px; font-size:14px; font-weight:700">¿Llevas productos de origen animal o vegetal?</label>
          <p style="font-size:12.0px; color:var(--muted); margin:0 0 10px; line-height:1.4">Indica si llevas contigo alguno de estos productos. Esta declaración es obligatoria antes de ingresar al país.</p>
          
          <div class="product-grid" style="padding: 0 0 10px;">
            ${Object.entries(state.sagProducts).map(([label, value]) => productCard(label, value)).join("")}
          </div>

          <div class="info-box orange-box" style="margin-top: 4px; padding: 12px; display: flex; gap: 10px;">
            <div class="info-box-icon orange-icon" style="flex-shrink: 0;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div class="info-box-content">
              <p class="info-box-text" style="color: #7c2d12; font-weight: 750; font-size: 12px; margin: 0;">
                Omitir productos puede tener consecuencias legales.
              </p>
              <p class="info-box-text" style="color: #7c2d12; font-size: 11px; margin: 2px 0 0; line-height: 1.3">
                La no declaración puede derivar en multas, decomiso de productos o prohibición de ingreso al país.
              </p>
            </div>
          </div>
        </div>
        <div class="bottom-sheet-footer">
          <button class="btn" data-action="save-sag-modal">Guardar</button>
        </div>
      </div>
    </div>
  `;
}

export function tripScreen(state) {
  const travelWithMinors = state.trip.minors; // null, false, true
  const list = state.trip.minorsList || [];
  
  let canContinue = true;
  if (travelWithMinors === null) {
    canContinue = false;
  } else if (travelWithMinors === true) {
    if (list.length === 0) {
      canContinue = false;
    } else {
      const hasIncompleteMinors = list.some(m => 
        !m.name || !m.name.trim() || 
        !m.document || !m.document.trim() || 
        (m.withBothParents === "no" && m.authorization === "pending")
      );
      if (hasIncompleteMinors) {
        canContinue = false;
      }
    }
  }

  return appFrame(`
    <div class="header-group">
      ${topbar("Registrar viaje", { backTo: "home", role: state.role })}
      ${stepper(["Viaje", "Documentos", "Seguimiento"], 1)}
    </div>
    <section class="sheet">
      <div class="field">
        <label for="date">Fecha de cruce</label>
        <input id="date" type="date" value="${state.trip.date}" data-bind="date" />
      </div>
      <div class="field">
        <label for="destination">Destino</label>
        <select id="destination" data-bind="destination">
          <option ${state.trip.destination === "Mendoza, Argentina" ? "selected" : ""}>Mendoza, Argentina</option>
          <option ${state.trip.destination === "San Luis, Argentina" ? "selected" : ""}>San Luis, Argentina</option>
          <option ${state.trip.destination === "Buenos Aires, Argentina" ? "selected" : ""}>Buenos Aires, Argentina</option>
        </select>
      </div>
      <div class="field">
        <label for="plate">Patente del vehículo</label>
        <input id="plate" value="${state.trip.plate}" data-bind="plate" />
      </div>
      <label class="field">
        <span>Acompañantes (mayores)</span>
        <div class="counter">
          <strong>${state.trip.companions}</strong>
          <span class="counter-controls">
            <button class="round" data-count="-1" aria-label="Restar acompañante">-</button>
            <button class="round" data-count="1" aria-label="Sumar acompañante">+</button>
          </span>
        </div>
      </label>
      
      <div class="requirements-container">
        <h2 class="requirements-title">Requisitos del viaje</h2>
        ${getMinorsCardHtml(state)}
        ${getSagCardHtml(state)}
      </div>

      <button class="btn" ${!canContinue ? "disabled" : ""} data-go="docs" style="margin-top:24px">Continuar</button>
    </section>
    ${getMinorsModalHtml(state)}
    ${getSagModalHtml(state)}
  `, state.screen, frameOptions(state));
}
