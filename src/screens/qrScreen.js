import { appFrame, topbar } from "../components/chrome.js";
import { detailRow } from "../components/forms.js";
import { qrPayload, STATUS, statusLabels } from "../state/appState.js";
import { formatDate } from "../utils/format.js";

export function qrScreen(state) {
  const isApproved = state.status === STATUS.approved;

  if (!isApproved) {
    return appFrame(`
      ${topbar("Mi QR", { backTo: "home" })}
      <section class="content">
        <article class="card soft" style="padding:24px 20px;text-align:center;margin-top:20px;display:grid;justify-items:center;gap:18px">
          <div class="circle" style="width:68px;height:68px;display:grid;place-items:center;border-radius:50%;color:#d07b00;background:#fff6e5;border:1px solid #ffd5a1">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div>
            <h2 style="margin:0 0 8px;font-size:19px;font-weight:800;color:var(--ink)">Codigo QR no disponible</h2>
            <p class="muted" style="margin:0;font-size:14px;line-height:1.45">Tu tramite <strong>${state.caseId}</strong> esta en estado <strong>${statusLabels[state.status]}</strong>.</p>
          </div>
          <p class="muted" style="margin:0;font-size:13px;line-height:1.4">El QR se activa solamente cuando el funcionario aprueba el cruce.</p>
          <button class="btn" data-go="detail" style="margin-top:8px">Ver seguimiento</button>
        </article>
      </section>
    `, state.screen);
  }

  const activeTab = state.qrActiveTab || "qr";

  let tabContent = "";
  if (activeTab === "qr") {
    tabContent = `
      <article class="qr-main-card">
        <span class="code-label">Código de trámite</span>
        <strong class="code-value">${state.caseId}</strong>
        
        <a href="https://www.youtube.com/watch?v=QDia3e12czc" target="_blank" rel="noopener noreferrer" class="qr-canvas-container" style="display: flex; cursor: pointer; text-decoration: none;">
          <canvas id="qr-canvas" width="250" height="250" aria-label="Codigo QR del tramite"></canvas>
        </a>

        <div class="qr-details-grid">
          <div class="qr-detail-col">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${formatDate(state.trip.date)}</span>
          </div>
          <div class="qr-detail-col">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${state.trip.destination}</span>
          </div>
          <div class="qr-detail-col">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
            <span>Vehículo<br/>${state.trip.plate}</span>
          </div>
          <div class="qr-detail-col">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>${state.trip.companions} acompañantes</span>
          </div>
        </div>

        <div class="qr-info-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>Presenta este QR en control. No requiere impresión.</span>
        </div>
      </article>    `;
  } else {
    tabContent = `
      <article class="card detail-list" style="margin-top:0">
        ${detailRow("#", "Código de trámite", state.caseId)}
        ${detailRow("F", "Fecha de cruce", formatDate(state.trip.date))}
        ${detailRow("D", "Destino", state.trip.destination)}
        ${detailRow("V", "Vehículo", state.trip.plate)}
        ${detailRow("A", "Acompañantes", state.trip.companions)}
      </article>
      <article class="card soft" style="padding:16px;margin-top:16px">
        <strong>Instrucciones</strong>
        <ul class="small">
          <li>Presenta este QR en el control de Aduana de salida.</li>
          <li>Ten a mano tu documento de identidad y documentos del vehículo.</li>
          <li>El funcionario puede consultar el mismo ID desde el centro de control.</li>
        </ul>
      </article>
    `;
  }

  return appFrame(`
    ${topbar("Mi QR", { backTo: "home" })}
    <section class="content">
      <div class="status-bar-card">
        <span class="status-badge approved">
          <span class="badge-icon-container">
            <svg class="badge-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          Aprobado
        </span>
        <span class="status-location-info">
          <svg class="mountain-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m8 3-7 18h22L16 6Z"/>
            <path d="m12 11-3 10h10Z"/>
          </svg>
          Paso Los Libertadores
        </span>
      </div>

      ${tabContent}

      <div class="tab-group" style="margin-top: 16px;">
        <button class="tab-btn ${activeTab === "qr" ? "active" : ""}" data-action="select-tab" data-tab="qr">QR</button>
        <button class="tab-btn ${activeTab === "detalle" ? "active" : ""}" data-action="select-tab" data-tab="detalle">Detalle</button>
      </div>

      <button class="btn" data-download="true" style="margin-top:14px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Descargar comprobante
      </button>
      <button class="btn secondary" data-go="detail" style="margin-top:10px">Ver detalle</button>
    </section>
  `, state.screen);
}

