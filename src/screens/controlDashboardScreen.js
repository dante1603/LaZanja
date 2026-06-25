import { appFrame, topbar } from "../components/chrome.js";
import { STATUS, getOfficerStatusLabel } from "../state/appState.js";

function metric(label, value, colorClass = "") {
  return `
    <article class="control-metric ${colorClass}">
      <strong>${value}</strong>
      <span>${label}</span>
    </article>
  `;
}

export function controlDashboardScreen(state) {
  const isPending = [STATUS.submitted, STATUS.underReview, STATUS.needsFix].includes(state.status);
  const pendingCount = isPending ? 1 : 0;
  const alertCount = (isPending && state.alerts && state.alerts.length > 0) ? 1 : 0;
  const approvedCount = state.status === STATUS.approved ? 1 : 0;

  let priorityCardHtml = "";
  if (isPending) {
    const simplifiedAlerts = state.alerts.map(a => {
      if (a.toLowerCase().includes("sag")) return "SAG";
      if (a.toLowerCase().includes("menor")) return "Menor de edad";
      return "Alerta";
    }).join(" · ") || "Ninguna";

    priorityCardHtml = `
      <article class="card priority-card">
        <div class="priority-header">
          <span class="priority-label">Siguiente trámite prioritario</span>
          <span class="badge warning animate-flash">Prioridad Alta</span>
        </div>
        <div class="priority-body">
          <div class="priority-title-row">
            <h3 class="priority-title">${state.caseId}</h3>
            <span class="badge danger">${getOfficerStatusLabel(state)}</span>
          </div>
          <div class="priority-meta">
            <div class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Patente: <strong>${state.trip.plate}</strong></span>
            </div>
            <div class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 0 0-10 10c0 5.25 10 12 10 12s10-6.75 10-12a10 10 0 0 0-10-10z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Destino: <strong>${state.trip.destination}</strong></span>
            </div>
          </div>
          ${state.alerts.length > 0 ? `
            <div class="priority-alerts-row">
              <strong>Alertas:</strong>
              <span class="alert-pill">${simplifiedAlerts}</span>
            </div>
          ` : ""}
        </div>
        <div class="priority-footer">
          <button class="btn" data-go="controlCase" style="width: 100%; margin: 0;">Revisar ahora</button>
        </div>
      </article>
    `;
  } else {
    priorityCardHtml = `
      <article class="card priority-card empty-priority" style="text-align: center; padding: 28px 20px; display: flex; flex-direction: column; align-items: center; gap: 14px;">
        <div class="success-icon-container" style="background: var(--teal-50); color: var(--teal-600); width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--teal-100);">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div>
          <h3 style="margin: 0; font-size: 15px; font-weight: 800; color: var(--ink);">Bandeja de trabajo al día</h3>
          <p class="muted" style="margin: 4px 0 0; font-size: 12.5px; line-height: 1.4;">Todos los trámites prioritarios han sido revisados y procesados.</p>
        </div>
      </article>
    `;
  }

  return appFrame(`
    ${topbar("Turno Paso Los Libertadores", { back: false, menu: true })}
    <section class="content stack control-space">
      <article class="card summary-card" style="padding-bottom: 16px;">
        <div class="row">
          <div>
            <h2 style="margin:0; font-size: 16px; font-weight: 800; color: var(--ink);">Centro de Control</h2>
            <p class="muted" style="margin:4px 0 0; font-size: 12.5px;">Resumen operativo del turno actual.</p>
          </div>
        </div>
        <div class="control-metrics">
          ${metric("Pendientes", pendingCount, pendingCount > 0 ? "metric-pending" : "")}
          ${metric("Con alertas", alertCount, alertCount > 0 ? "metric-alerts" : "")}
          ${metric("Aprobados", approvedCount, approvedCount > 0 ? "metric-approved" : "")}
        </div>
      </article>

      ${priorityCardHtml}

      <div class="control-actions-menu">
        <button class="btn-menu-item" data-go="controlQueue">
          <div class="menu-item-icon bg-blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </div>
          <div class="menu-item-text">
            <strong>Bandeja de trámites</strong>
            <span>Lista de trámites y escaneo QR</span>
          </div>
          <svg class="chevron-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button class="btn-menu-item" data-go="controlReports">
          <div class="menu-item-icon bg-green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <div class="menu-item-text">
            <strong>Reportes operativos</strong>
            <span>Estadísticas de cruce y exportaciones</span>
          </div>
          <svg class="chevron-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button class="btn-menu-item" data-go="controlPrototype">
          <div class="menu-item-icon bg-purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <div class="menu-item-text">
            <strong>Panel del prototipo</strong>
            <span>Configuración de roles y simulación</span>
          </div>
          <svg class="chevron-right" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <button class="btn-menu-item logout-item" data-logout-trigger="true" style="margin-top: 8px;">
          <div class="menu-item-icon bg-red">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <div class="menu-item-text">
            <strong>Cerrar sesión</strong>
            <span>Salir de la cuenta de funcionario</span>
          </div>
        </button>
      </div>
    </section>
  `, state.screen, false);
}
