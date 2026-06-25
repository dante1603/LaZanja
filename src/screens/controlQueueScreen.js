import { appFrame, frameOptions, topbar } from "../components/chrome.js";
import { STATUS, getOfficerStatusLabel } from "../state/appState.js";
import { formatDate } from "../utils/format.js";

function matchFilter(state, filter) {
  if (filter === "Todos") return true;
  if (filter === "Pendientes") return [STATUS.submitted, STATUS.underReview, STATUS.needsFix].includes(state.status);
  if (filter === "Con alertas") return [STATUS.submitted, STATUS.underReview, STATUS.needsFix].includes(state.status) && state.alerts.length > 0;
  if (filter === "Aprobados") return state.status === STATUS.approved;
  if (filter === "Rechazados") return state.status === STATUS.rejected;
  if (filter === "Aduana") return state.trip.plate !== "";
  if (filter === "SAG") return state.trip.sag === true;
  if (filter === "PDI") return state.trip.minors === true;
  return true;
}

export function controlQueueScreen(state) {
  const activeFilter = state.queueFilter || "Todos";
  const caseMatches = matchFilter(state, activeFilter);

  const filters = ["Todos", "Pendientes", "Con alertas", "Aprobados", "Rechazados", "Aduana", "SAG", "PDI"];

  let listContent = "";
  if (caseMatches) {
    const totalPeople = (state.trip.companions || 0) + 1;
    const isAlertCase = state.alerts && state.alerts.length > 0;
    const derivedStatus = getOfficerStatusLabel(state);
    
    // Determine badge class for styling
    let statusClass = "info";
    if (state.status === STATUS.approved) statusClass = "success";
    else if (state.status === STATUS.rejected) statusClass = "danger";
    else if (isAlertCase && [STATUS.submitted, STATUS.underReview, STATUS.needsFix].includes(state.status)) statusClass = "warning";

    const alertsHtml = state.alerts.length > 0
      ? state.alerts.map(a => {
          const type = a.toLowerCase().includes("sag") ? "SAG" : a.toLowerCase().includes("menor") ? "Menor de edad" : "Alerta";
          return `<span class="alert-badge-pill">${type}</span>`;
        }).join(" ")
      : `<span class="alert-badge-pill success">Sin alertas</span>`;

    listContent = `
      <article class="card summary-card officer-case-card">
        <div class="row" style="margin-bottom: 12px; align-items: flex-start;">
          <div>
            <h3 class="case-id-title">${state.caseId}</h3>
            <p class="muted" style="margin: 2px 0 0; font-size: 11.5px;">Cruce: <strong>${formatDate(state.trip.date)}</strong></p>
          </div>
          <span class="badge ${statusClass}">${derivedStatus}</span>
        </div>
        
        <div class="case-details-grid">
          <div class="detail-item">
            <span>Patente</span>
            <strong>${state.trip.plate}</strong>
          </div>
          <div class="detail-item">
            <span>Destino</span>
            <strong>${state.trip.destination}</strong>
          </div>
          <div class="detail-item">
            <span>Personas</span>
            <strong>${totalPeople} viajeros</strong>
          </div>
        </div>

        <div class="case-alerts-tags-row">
          <strong>Alertas:</strong>
          <div class="tags-container">
            ${alertsHtml}
          </div>
        </div>

        <button class="btn" data-go="controlCase" style="width: 100%; margin: 12px 0 0 0;">Revisar trámite</button>
      </article>
    `;
  } else {
    listContent = `
      <article class="card empty-filter-state" style="text-align: center; padding: 36px 20px; border: 1.5px dashed var(--line); background: transparent; display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <div style="background: var(--line); color: var(--muted); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <div>
          <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: var(--ink);">No hay trámites para este filtro</h4>
          <p class="muted" style="margin: 4px 0 0; font-size: 12px; line-height: 1.45;">No se encontraron registros activos en esta bandeja con el criterio seleccionado.</p>
        </div>
        <button class="btn secondary compact" data-action="clear-queue-filter" style="margin: 8px 0 0 0;">Ver todos</button>
      </article>
    `;
  }

  const scannerOverlayHtml = state.scanningQr ? `
    <div class="scanner-overlay animate-fade-in">
      <div class="scanner-container">
        <div class="scanner-header">
          <h3>Escanear Código QR</h3>
          <p class="muted">Coloque el código QR del viajero dentro del recuadro para iniciar la validación</p>
        </div>
        
        <div class="scanner-viewfinder">
          <div class="viewfinder-corner top-left"></div>
          <div class="viewfinder-corner top-right"></div>
          <div class="viewfinder-corner bottom-left"></div>
          <div class="viewfinder-corner bottom-right"></div>
          <div class="scanner-laser-line"></div>
          
          <div class="scanner-qr-ghost">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5">
              <rect x="2" y="2" width="8" height="8" rx="1"></rect>
              <rect x="14" y="2" width="8" height="8" rx="1"></rect>
              <rect x="2" y="14" width="8" height="8" rx="1"></rect>
              <rect x="14" y="14" width="4" height="4" rx="0.5"></rect>
              <rect x="18" y="18" width="4" height="4" rx="0.5"></rect>
              <rect x="14" y="18" width="4" height="4" rx="0.5"></rect>
              <rect x="18" y="14" width="4" height="4" rx="0.5"></rect>
            </svg>
          </div>
        </div>
        
        <div class="scanner-footer">
          <span class="scanner-status-pulse">Buscando código de barras o QR...</span>
          <button class="btn secondary scanner-cancel-btn" data-action="cancel-qr-scan" style="background: rgba(255,255,255,0.08) !important; color: white !important; border-color: rgba(255,255,255,0.15) !important;">Cancelar escaneo</button>
        </div>
      </div>
    </div>
  ` : "";

  return appFrame(`
    ${topbar("Bandeja de trámites", { backTo: "control", role: state.role })}
    <section class="content stack control-space" style="position: relative;">
      
      <div class="search-bar-row">
        <div class="field" style="margin: 0; flex: 1;">
          <label for="case-search" style="font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px;">Buscar trámite</label>
          <div style="position: relative; display: flex; align-items: center;">
            <input id="case-search" class="search-input-field" placeholder="ID, patente o documento..." value="" />
            <svg class="search-icon-inside" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        <button class="btn secondary icon-only-mobile-btn" data-action="start-qr-scan" title="Escanear QR" style="margin: 18px 0 0 0; align-self: flex-start; display: flex; align-items: center; gap: 8px; padding: 11px 14px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"></path>
            <rect x="7" y="7" width="10" height="10" rx="1"></rect>
          </svg>
          <span class="btn-text-desktop">Escanear QR</span>
        </button>
      </div>

      <div class="filter-section-container">
        <span class="filter-label-title">Filtrar por:</span>
        <div class="filter-pills-row">
          ${filters.map(f => {
            const isActive = activeFilter === f;
            return `<button class="filter-pill ${isActive ? "active" : ""}" data-action="select-queue-filter" data-filter="${f}">${f}</button>`;
          }).join("")}
        </div>
      </div>

      <div class="queue-list-container">
        ${listContent}
      </div>

      ${scannerOverlayHtml}
    </section>
  `, state.screen, frameOptions(state, false));
}
