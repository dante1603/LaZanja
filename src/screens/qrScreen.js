import { appFrame, topbar } from "../components/chrome.js";
import { detailRow } from "../components/forms.js";
import { formatDate } from "../utils/format.js";

export function qrScreen(state) {
  const isApproved = state && state.approved;

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
            <h2 style="margin:0 0 8px;font-size:19px;font-weight:800;color:var(--ink)">Código QR no disponible</h2>
            <p class="muted" style="margin:0;font-size:14px;line-height:1.45">Tu trámite <strong>LZA-2025-00078941</strong> se encuentra actualmente <strong>en revisión</strong> por Aduana.</p>
          </div>
          <p class="muted" style="margin:0;font-size:13px;line-height:1.4">Una vez validada la documentación e información del viaje, el código de cruce digital se activará de forma automática.</p>
          <button class="btn" data-go="detail" style="margin-top:8px">Ver seguimiento</button>
        </article>
      </section>
    `, state.screen);
  }

  return appFrame(`
    ${topbar("Mi QR", { backTo: "home" })}
    <section class="content">
      <p style="text-align:center;color:var(--blue-900);margin:-8px 0 16px;font-weight:800">△ Paso Los Libertadores</p>
      <article class="card soft" style="padding:18px">
        <div class="row" style="justify-content:start">
          <span class="check-dot" style="width:58px;height:58px;font-size:18px">OK</span>
          <span><strong style="font-size:24px;color:var(--green-700)">Tramite aprobado</strong><br/>Listo para presentar en el control</span>
        </div>
        <p style="margin:14px 0 0">Presenta este codigo QR al llegar a Aduana.</p>
      </article>
      <article class="card qr-card" style="margin-top:16px">
        <canvas id="qr-canvas" class="qr" width="250" height="250" aria-label="Codigo QR del tramite"></canvas>
        <p class="muted">Muestra este codigo en la pantalla del dispositivo. No requiere impresion.</p>
      </article>
      <article class="card detail-list" style="margin-top:16px">
        ${detailRow("▣", "Codigo de tramite", "LZA-2025-00078941")}
        ${detailRow("▤", "Fecha de cruce", formatDate(state.trip.date))}
        ${detailRow("⌖", "Destino", state.trip.destination)}
        ${detailRow("▰", "Vehiculo", state.trip.plate)}
        ${detailRow("◎", "Acompanantes", state.trip.companions)}
      </article>
      <article class="card soft" style="padding:16px;margin-top:16px">
        <strong>Instrucciones</strong>
        <ul class="small">
          <li>Presenta este QR en el control de Aduana de salida.</li>
          <li>Luego presentalo en el control de Aduana de ingreso.</li>
          <li>Ten a mano tu documento de identidad y documentos del vehiculo.</li>
        </ul>
      </article>
      <button class="btn" data-download="true" style="margin-top:14px">Descargar comprobante</button>
      <button class="btn secondary" data-go="detail" style="margin-top:10px">Ver detalle</button>
    </section>
  `, state.screen);
}
