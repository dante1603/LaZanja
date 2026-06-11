import { appFrame, stepper, topbar } from "../components/chrome.js";

export function detailScreen(state) {
  const isApproved = state && state.approved;
  const badgeCls = isApproved ? "badge ok" : "badge";
  const badgeText = isApproved ? "Aprobado" : "En revision";
  const progressHtml = isApproved 
    ? `<span class="done"></span><span class="done"></span><span class="done"></span><span class="done"></span>`
    : `<span class="done"></span><span class="done"></span><span class="done"></span><span></span>`;
  const stateDesc = isApproved
    ? "Tu trámite ha sido aprobado por Aduana. Presenta el código QR en los puntos de control del cruce."
    : "Tu informacion fue recibida. Aduana validara los documentos antes del cruce y te notificara si existe una observacion.";
  const buttonHtml = isApproved
    ? `<button class="btn" data-go="qr" style="margin-top:14px">Ver código QR</button>`
    : `<button class="btn" data-approve="true" style="margin-top:14px">Simular aprobacion y ver QR</button>`;

  return appFrame(`
    <div class="header-group">
      ${topbar("Seguimiento", { backTo: "home" })}
      ${stepper(["Viaje", "Documentos", "Declaración SAG", "Seguimiento"], 4)}
    </div>
    <section class="content">
      <article class="card summary-card" style="margin-top:14px">
        <div class="row">
          <div>
            <h2 style="margin:0">Tramite LZA-2025-00078941</h2>
            <p class="muted" style="margin:6px 0 0">Validacion previa al viaje</p>
          </div>
          <span class="${badgeCls}">${badgeText}</span>
        </div>
        <div class="progress">${progressHtml}</div>
      </article>
      <article class="card soft" style="padding:16px;margin-top:14px">
        <strong>Estado actual</strong>
        <p class="muted">${stateDesc}</p>
      </article>
      ${buttonHtml}
    </section>
  `, state.screen);
}
