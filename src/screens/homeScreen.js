import { appFrame, topbar } from "../components/chrome.js";

export function homeScreen(state) {
  return appFrame(`
    ${topbar("Inicio", { back: false, menu: true, bell: true })}
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
          <span class="badge ${state.approved ? 'ok' : 'yellow-badge'}">${state.approved ? 'Aprobado' : 'Pendiente'}</span>
        </div>
        <div class="row small" style="margin-top: 10px; margin-bottom: 4px;">
          <span style="font-weight:500;color:var(--muted)">Progreso del trámite</span><strong style="font-size:14px;color:var(--ink)">${state.approved ? '4 / 4' : '3 / 4'}</strong>
        </div>
        <div class="progress">
          <span class="done"></span>
          <span class="done"></span>
          <span class="done"></span>
          <span class="${state.approved ? 'done' : ''}"></span>
        </div>
        <div class="row" style="margin-top: 10px;">
          <p style="margin:0;font-size:13px;color:var(--muted);line-height:1.3">${state.approved ? 'Tu trámite ha sido aprobado. QR disponible para cruce.' : 'Completa los pasos para agilizar tu cruce.'}</p>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5d6984" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer;flex-shrink:0" data-go="detail">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </article>

      <div class="quick-grid">
        <button class="quick-action" data-go="trip">
          <span class="circle" style="background:#0d63f3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </span>
          <span>Registrar viaje</span>
        </button>
        <button class="quick-action" data-go="docs">
          <span class="circle" style="background:#0d63f3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg>
          </span>
          <span>Subir documentos</span>
        </button>
        <button class="quick-action" data-go="sag">
          <span class="circle" style="background:#24a148">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.2a7.5 7.5 0 0 1-9 8.8z"></path><path d="M19 2L9.8 11.2"></path></svg>
          </span>
          <span>Declaración SAG</span>
        </button>
        <button class="quick-action" data-go="trip">
          <span class="circle" style="background:#0d63f3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10 L8.5 6h7L17 10Z" fill="white" fill-opacity="0.15" /><rect x="4" y="10" width="16" height="6" rx="2" /><circle cx="7" cy="13" r="1.2" fill="white" /><circle cx="17" cy="13" r="1.2" fill="white" /><rect x="6" y="16" width="3" height="1.5" rx="0.5" /><rect x="15" y="16" width="3" height="1.5" rx="0.5" /></svg>
          </span>
          <span>Vehículo</span>
        </button>
        <button class="quick-action" data-go="trip">
          <span class="circle" style="background:#8a3ffc">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"></circle><path d="M4 18c0-2.5 3-4 5-4s5 1.5 5 4"></path><circle cx="15" cy="7" r="3.2"></circle><path d="M10 18c0-3 3.5-5 6-5s6 2 6 5"></path></svg>
          </span>
          <span>Menores</span>
        </button>
        <button class="quick-action" data-go="qr">
          <span class="circle" style="background:#0d63f3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="3" height="3" rx="0.5" fill="white"></rect><rect x="18" y="18" width="3" height="3" rx="0.5" fill="white"></rect><rect x="14" y="18" width="3" height="3" rx="0.5" fill="white"></rect><rect x="18" y="14" width="3" height="3" rx="0.5" fill="white"></rect></svg>
          </span>
          <span>Mi QR</span>
        </button>
      </div>

      <article class="card soft">
        <div class="info-link" data-go="detail" style="cursor:pointer; padding:0">
          <div class="row" style="justify-content:start; gap:12px; width:100%">
            <div class="requisitos-icon-bg">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d63f3" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="9" y1="16" x2="15" y2="16"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
              </svg>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:2px">
              <strong style="font-size:15px; font-weight:750; color:#0e1d45">Requisitos principales</strong>
              <span style="font-size:12px; color:var(--muted); line-height:1.25">Revisa los documentos y condiciones necesarias para tu cruce.</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d63f3" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </article>
    </section>
  `, state.screen);
}

