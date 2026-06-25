import { appFrame, topbar } from "../components/chrome.js";
import { selectedSagItems } from "../components/sag.js";
import { qrPayload, statusLabels } from "../state/appState.js";
import { formatDate } from "../utils/format.js";

function section(title, body) {
  return `<article class="card soft control-section"><strong>${title}</strong>${body}</article>`;
}

function docStatus(doc) {
  return `<li><span>${doc.title}</span><strong>${doc.status}</strong></li>`;
}

export function controlCaseScreen(state) {
  const sagItems = selectedSagItems(state);

  return appFrame(`
    ${topbar("Ficha de tramite", { backTo: "controlQueue" })}
    <section class="content stack control-space">
      <article class="card summary-card">
        <div class="row">
          <div>
            <h2 style="margin:0">${state.caseId}</h2>
            <p class="muted" style="margin:6px 0 0">Payload QR: ${qrPayload(state)}</p>
          </div>
          <span class="badge">${statusLabels[state.status]}</span>
        </div>
      </article>

      ${section("Datos del viaje", `
        <ul class="control-kv">
          <li><span>Fecha</span><strong>${formatDate(state.trip.date)}</strong></li>
          <li><span>Destino</span><strong>${state.trip.destination}</strong></li>
          <li><span>Patente</span><strong>${state.trip.plate}</strong></li>
          <li><span>Acompanantes</span><strong>${state.trip.companions}</strong></li>
          <li><span>Menores</span><strong>${state.trip.minors === true ? "Sí" : state.trip.minors === false ? "No" : "Pendiente"}</strong></li>
          ${state.trip.minors === true && state.trip.minorsList && state.trip.minorsList.length > 0 ? `
            <li style="grid-column: 1 / -1; display: block; border-top: 1px dashed var(--line); margin-top: 8px; padding-top: 8px;">
              <span style="font-weight: 700; color: var(--muted); font-size: 11.5px; display: block; margin-bottom: 4px;">Detalles de menores:</span>
              <ul style="padding-left: 14px; margin: 0; font-size: 12px; color: var(--ink); list-style-type: disc;">
                ${state.trip.minorsList.map((m, i) => `
                  <li style="margin-bottom: 4px;">
                    <strong>${m.name || "Sin nombre"}</strong> (${m.document || "Sin doc"})<br/>
                    <small class="muted">Viaja con padres: ${m.withBothParents === "yes" ? "Sí" : "No"} · Autorización: ${m.withBothParents === "yes" ? "No aplica" : (m.authorization === "pending" ? "Pendiente" : "Adjunta")}</small>
                  </li>
                `).join("")}
              </ul>
            </li>
          ` : ""}
        </ul>
      `)}

      ${section("Documentos", `<ul class="control-kv">${state.docs.map(docStatus).join("")}</ul>`)}

      ${section("SAG y validacion Argentina", `
        <p class="muted">${sagItems.length ? sagItems.join(", ") : "Sin productos declarados."}</p>
        <p><strong>${state.argentinaValidation.status}</strong> - ${state.argentinaValidation.detail}</p>
      `)}

      ${section("Alertas", `<ul class="small control-list">${state.alerts.map(alert => `<li>${alert}</li>`).join("")}</ul>`)}

      <article class="card soft control-section">
        <label class="field">
          <span>Observacion del funcionario</span>
          <textarea class="control-note" data-note rows="4" placeholder="Motivo de rechazo, correccion solicitada o nota de aprobacion">${state.officerNotes}</textarea>
        </label>
        <div class="button-row">
          <button class="btn" data-officer-action="approve">Aprobar</button>
          <button class="btn secondary" data-officer-action="needs_fix">Solicitar correccion</button>
        </div>
        <button class="btn danger" data-officer-action="reject">Rechazar cruce</button>
      </article>

      ${section("Trazabilidad", `
        <ol class="timeline-list">
          ${state.events.map(event => `<li><span>${event.at}</span><strong>${event.label}</strong></li>`).join("")}
        </ol>
      `)}
    </section>
  `, state.screen, false);
}
