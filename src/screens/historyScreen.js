import { appFrame, topbar } from "../components/chrome.js";
import { formatDate } from "../utils/format.js";

function renderActiveCaseCard(state) {
  const isApproved = state.status === "approved";
  const isDraft = state.status === "draft";
  const isNeedsFix = state.status === "needs_fix";
  const isRejected = state.status === "rejected";
  
  if (isDraft) {
    const pendingDocs = state.docs.filter(d => d.type === "pending" || d.status === "Pendiente");
    let missingInfo = "Completa la información del viaje.";
    if (state.trip.date && state.trip.destination && state.trip.plate) {
      if (pendingDocs.length > 0) {
        missingInfo = `Falta cargar: ${pendingDocs.map(d => d.title.toLowerCase()).join(", ")}`;
      } else {
        missingInfo = "Listo para enviar a revisión.";
      }
    }
    const hasBasics = Boolean(state.trip.date && state.trip.destination && state.trip.plate);
    const targetGo = hasBasics ? "docs" : "trip";

    return `
      <div class="section-title">Trámites activos / Borradores</div>
      <article class="card summary-card">
        <div class="row">
          <strong>Trámite incompleto</strong>
          <span class="badge optional">Borrador</span>
        </div>
        <p class="muted" style="margin-top: 6px; font-size: 13.5px; line-height: 1.3;">${missingInfo}</p>
        <button class="btn" data-go="${targetGo}" style="margin-top: 12px;">Continuar</button>
      </article>
    `;
  }
  
  if (isNeedsFix) {
    const obs = state.officerNotes || "Revisa las observaciones del funcionario.";
    return `
      <div class="section-title">Trámites con observaciones</div>
      <article class="card summary-card">
        <div class="row">
          <strong>${state.caseId}</strong>
          <span class="badge error">Requiere corrección</span>
        </div>
        <p class="muted" style="margin-top: 6px; font-size: 13.5px; line-height: 1.3;"><strong>Observación:</strong> ${obs}</p>
        <button class="btn" data-go="docs" style="margin-top: 12px;">Corregir</button>
      </article>
    `;
  }

  if (isRejected) {
    const obs = state.officerNotes || "Documentación insuficiente.";
    return `
      <div class="section-title">Trámites rechazados</div>
      <article class="card summary-card">
        <div class="row">
          <strong>${state.caseId}</strong>
          <span class="badge error">Rechazado</span>
        </div>
        <p class="muted" style="margin-top: 6px; font-size: 13.5px; line-height: 1.3;"><strong>Motivo:</strong> ${obs}</p>
        <button class="btn secondary" data-go="detail" style="margin-top: 12px;">Ver seguimiento</button>
      </article>
    `;
  }

  if (isApproved) {
    return `
      <div class="section-title">Trámites aprobados</div>
      <article class="card summary-card">
        <div class="row">
          <strong>${state.caseId}</strong>
          <span class="badge ok">Aprobado</span>
        </div>
        <p class="muted" style="margin-top: 6px; font-size: 13.5px; line-height: 1.3;">Cruce aprobado. Presenta el QR en control.</p>
        <button class="btn" data-go="qr" style="margin-top: 12px;">Ver QR</button>
      </article>
    `;
  }

  // submitted or under_review
  return `
    <div class="section-title">Trámites activos</div>
    <article class="card summary-card">
      <div class="row">
        <strong>${state.caseId}</strong>
        <span class="badge">En revisión</span>
      </div>
      <p class="muted" style="margin-top: 6px; font-size: 13.5px; line-height: 1.3;">Cruce programado: ${formatDate(state.trip.date)}</p>
      <button class="btn secondary" data-go="detail" style="margin-top: 12px;">Ver seguimiento</button>
    </article>
  `;
}

export function historyScreen(state) {
  const activeCardHtml = renderActiveCaseCard(state);

  return appFrame(`
    <style>
      .section-title {
        font-size: 13.5px;
        font-weight: 750;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 18px 0 8px;
        padding-left: 2px;
      }
    </style>
    
    ${topbar("Mis trámites", { backTo: "home" })}
    <section class="content stack" style="gap: 4px;">
      ${activeCardHtml}
      
      <div class="section-title" style="margin-top: 16px;">Historial</div>
      <article class="card summary-card">
        <div class="row">
          <strong>LZA-2026-00065412</strong>
          <span class="badge" style="color: #475569; background: #e2e8f0;">Usado en control</span>
        </div>
        <p class="muted" style="margin-top: 6px; font-size: 13.5px; line-height: 1.3;">Cruce realizado: 12 junio 2026</p>
        <button class="btn secondary" data-download="LZA-2026-00065412" style="margin-top: 12px;">Ver comprobante</button>
      </article>
    </section>
  `, state.screen);
}
