import { appFrame, topbar } from "../components/chrome.js";
import { STATUS, statusLabels } from "../state/appState.js";

export function homeScreen(state) {
  const isApproved = state.status === STATUS.approved;
  const isSubmitted = state.status !== STATUS.draft;

  // Let's decide if there's an active/started trámite
  const hasActiveTramite = state.status !== STATUS.draft || state.tripStarted;

  if (!hasActiveTramite) {
    // ----------------------------------------------------
    // CASE A: NO ACTIVE TRÁMITE (DRAFT/EMPTY)
    // ----------------------------------------------------
    return appFrame(`
      ${topbar("Inicio", { back: false, menu: true })}
      <section class="content">
        <div class="no-tramite-container">
          <div class="no-tramite-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="no-tramite-text">
            <h2>Aún no tienes un trámite activo</h2>
            <p>Registra tu viaje antes de llegar al complejo fronterizo.</p>
          </div>
          <button class="btn" data-go="trip" style="width: 100%;">
            Registrar viaje
          </button>
        </div>

        <h3 class="section-title" style="color: #ffffff;">Antes de viajar</h3>
        <div class="quick-grid double">
          <button class="quick-action" data-go="detail">
            <span class="circle" style="background:#0d63f3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="15" x2="15" y2="15"></line>
                <line x1="9" y1="11" x2="15" y2="11"></line>
                <line x1="9" y1="19" x2="15" y2="19"></line>
              </svg>
            </span>
            <span>Requisitos</span>
          </button>
          <button class="quick-action" data-action="go-trip-sag">
            <span class="circle" style="background:#24a148">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.2a7.5 7.5 0 0 1-9 8.8z"></path>
                <path d="M19 2L9.8 11.2"></path>
              </svg>
            </span>
            <span>Declaración SAG</span>
          </button>
        </div>
      </section>
    `, state.screen);
  }

  // ----------------------------------------------------
  // CASE B: ACTIVE/STARTED TRÁMITE (draft in-progress, submitted, underReview, approved, rejected, needsFix)
  // ----------------------------------------------------
  let progressText = "3 / 4";
  let progressBarsHtml = `
    <span class="done"></span>
    <span class="done"></span>
    <span class="done"></span>
    <span class=""></span>
  `;

  if (state.status === STATUS.draft || state.status === STATUS.needsFix) {
    progressText = "2 / 4";
    progressBarsHtml = `
      <span class="done"></span>
      <span class="done"></span>
      <span></span>
      <span></span>
    `;
  } else if (state.status === STATUS.approved) {
    progressText = "4 / 4";
    progressBarsHtml = `
      <span class="done"></span>
      <span class="done"></span>
      <span class="done"></span>
      <span class="done"></span>
    `;
  }
  
  // Decide which alert message to show
  let alertHtml = "";
  if (state.status === STATUS.submitted || state.status === STATUS.underReview) {
    alertHtml = `
      <div class="row info-alert-box">
        <svg class="alert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
        </svg>
        <p class="alert-text">Tu trámite fue enviado y está pendiente de revisión.</p>
      </div>
    `;
  } else if (state.status === STATUS.approved) {
    alertHtml = `
      <div class="row success-alert-box">
        <svg class="alert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <p class="alert-text">Tu trámite ha sido aprobado. QR disponible para cruce.</p>
      </div>
    `;
  } else if (state.status === STATUS.needsFix) {
    alertHtml = `
      <div class="row warning-alert-box">
        <svg class="alert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <p class="alert-text">El trámite requiere correcciones en los documentos.</p>
      </div>
    `;
  } else if (state.status === STATUS.rejected) {
    alertHtml = `
      <div class="row danger-alert-box">
        <svg class="alert-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <p class="alert-text">Trámite rechazado por la autoridad de control.</p>
      </div>
    `;
  }

  // Action button underneath the alert
  let mainCardBtn = "";
  if (state.status === STATUS.draft) {
    mainCardBtn = `<button class="btn" data-go="trip" style="margin-top: 14px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;">
        Continuar trámite
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
       </button>`;
  } else if (state.status === STATUS.needsFix) {
    mainCardBtn = `<button class="btn" data-go="docs" style="margin-top: 14px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;">
        Corregir documentos
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
       </button>`;
  } else {
    mainCardBtn = `<button class="btn" data-go="detail" style="margin-top: 14px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;">
        Ver seguimiento
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
       </button>`;
  }

  return appFrame(`
    ${topbar("Inicio", { back: false, menu: true })}
    <section class="content">
      <article class="card summary-card">
        <div class="row" style="margin-bottom: 10px;">
          <div class="row" style="justify-content:start; gap: 10px;">
            <div class="circle-icon-bg blue-bg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="9" y1="16" x2="15" y2="16"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
              </svg>
            </div>
            <h2 style="margin:0;font-size:16.5px;font-weight:750;color:var(--ink)">Mi trámite</h2>
          </div>
          <span class="badge ${isApproved ? 'ok' : 'yellow-badge'}">${statusLabels[state.status]}</span>
        </div>
        <div class="row small" style="margin-top: 10px; margin-bottom: 4px;">
          <span style="font-weight:500;color:var(--muted)">Progreso del trámite</span><strong style="font-size:14px;color:var(--ink)">${progressText}</strong>
        </div>
        <div class="progress">
          ${progressBarsHtml}
        </div>
        ${alertHtml}
        ${mainCardBtn}
      </article>

      <h3 class="section-title" style="color: #ffffff;">Acciones recomendadas</h3>
      <div class="quick-grid recommended-grid">
        <button class="quick-action" data-go="docs">
          <span class="circle" style="background:#0d63f3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg>
          </span>
          <span>Subir<br/>documentos</span>
        </button>
        <button class="quick-action" data-go="qr">
          <span class="circle" style="background:#0d63f3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="3" height="3" rx="0.5" fill="white"></rect><rect x="18" y="18" width="3" height="3" rx="0.5" fill="white"></rect><rect x="14" y="18" width="3" height="3" rx="0.5" fill="white"></rect><rect x="18" y="14" width="3" height="3" rx="0.5" fill="white"></rect></svg>
          </span>
          <span>Mi QR</span>
        </button>
        <button class="quick-action" data-action="go-trip-sag">
          <span class="circle" style="background:#24a148">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.2a7.5 7.5 0 0 1-9 8.8z"></path><path d="M19 2L9.8 11.2"></path></svg>
          </span>
          <span>Declaración<br/>SAG</span>
        </button>
        <button class="quick-action" data-go="detail">
          <span class="circle" style="background:#0d63f3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="15" x2="15" y2="15"></line>
              <line x1="9" y1="11" x2="15" y2="11"></line>
              <line x1="9" y1="19" x2="15" y2="19"></line>
            </svg>
          </span>
          <span>Requisitos</span>
        </button>
      </div>

      <h3 class="section-title" style="color: #ffffff;">Opcionales según tu viaje</h3>
      <div class="optional-grid">
        <button class="optional-row-btn" data-go="trip">
          <div class="optional-icon-box blue-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10 L8.5 6h7L17 10Z" fill="currentColor" fill-opacity="0.15" /><rect x="4" y="10" width="16" height="6" rx="2" /><circle cx="7" cy="13" r="1.2" fill="currentColor" /><circle cx="17" cy="13" r="1.2" fill="currentColor" /><rect x="6" y="16" width="3" height="1.5" rx="0.5" /><rect x="15" y="16" width="3" height="1.5" rx="0.5" /></svg>
          </div>
          <div class="optional-text-box">
            <strong>Vehículo</strong>
            <small>Ingresa o declara</small>
          </div>
          <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <button class="optional-row-btn" data-action="go-trip-minors">
          <div class="optional-icon-box purple-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="optional-text-box">
            <strong>Menores</strong>
            <small>Viajas con niños</small>
          </div>
          <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  `, state.screen);
}
