import { appFrame, frameOptions, topbar } from "../components/chrome.js";
import { STATUS } from "../state/appState.js";

function reportRow(label, value) {
  return `<li><span>${label}</span><strong>${value}</strong></li>`;
}

export function controlReportsScreen(state) {
  const isPending = [STATUS.submitted, STATUS.underReview, STATUS.needsFix].includes(state.status);
  const pendingCount = isPending ? 1 : 0;
  const approvedCount = state.status === STATUS.approved ? 1 : 0;
  const rejectedCount = state.status === STATUS.rejected ? 1 : 0;

  return appFrame(`
    ${topbar("Reportes operativos", { backTo: "control", role: state.role })}
    <section class="content stack control-space">
      <article class="card summary-card">
        <h2 style="margin:0 0 12px; font-size: 15px; font-weight: 800; color: var(--ink);">Métricas consolidadas</h2>
        <ul class="control-kv" style="margin-top: 4px;">
          ${reportRow("Total de trámites", 1)}
          ${reportRow("Trámites pendientes", pendingCount)}
          ${reportRow("Trámites aprobados", approvedCount)}
          ${reportRow("Trámites rechazados", rejectedCount)}
          ${reportRow("Alertas de control", state.alerts ? state.alerts.length : 0)}
        </ul>
      </article>

      <article class="card soft" style="display: grid; gap: 12px;">
        <strong style="font-size: 13.5px; font-weight: 800; color: var(--ink);">Filtros de consulta</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="field" style="margin:0;">
            <label for="report-start-date" style="font-size: 11px;">Desde</label>
            <input type="date" id="report-start-date" value="2026-06-18" style="padding: 8px 10px; font-size: 13px;" />
          </div>
          <div class="field" style="margin:0;">
            <label for="report-end-date" style="font-size: 11px;">Hasta</label>
            <input type="date" id="report-end-date" value="2026-06-25" style="padding: 8px 10px; font-size: 13px;" />
          </div>
        </div>
        <div class="field" style="margin:0;">
          <label for="report-service-filter" style="font-size: 11px;">Servicio adscrito</label>
          <select id="report-service-filter" style="padding: 8px 10px; font-size: 13px;">
            <option value="all">Todos los servicios (SAG, PDI, Aduana)</option>
            <option value="sag">SAG - Agrícola y Ganadero</option>
            <option value="pdi">PDI - Migraciones</option>
            <option value="aduana">Aduanas - Equipaje y Vehículo</option>
          </select>
        </div>
      </article>

      <article class="card soft" style="display: grid; gap: 10px;">
        <strong style="font-size: 13.5px; font-weight: 800; color: var(--ink);">Exportación de datos</strong>
        <p class="muted" style="font-size:12px; margin: 0 0 4px 0; line-height: 1.45;">Descargue el reporte operacional consolidado correspondiente al rango de fechas seleccionado en formato procesable.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button class="btn secondary" data-action="export-report" data-format="PDF" style="margin:0; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; padding: 10px 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Exportar PDF</span>
          </button>
          <button class="btn secondary" data-action="export-report" data-format="Excel" style="margin:0; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; padding: 10px 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="15" y2="17"></line>
            </svg>
            <span>Exportar Excel</span>
          </button>
        </div>
      </article>
    </section>
  `, state.screen, frameOptions(state, false));
}
