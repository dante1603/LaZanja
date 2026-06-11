import { appFrame, topbar } from "../components/chrome.js";
import { formatDate } from "../utils/format.js";

export function historyScreen(state) {
  return appFrame(`
    ${topbar("Mis tramites", { backTo: "home" })}
    <section class="content stack">
      <article class="card summary-card">
        <div class="row"><strong>Viaje a Mendoza</strong><span class="badge">En revision</span></div>
        <p class="muted">Cruce programado para ${formatDate(state.trip.date)}.</p>
        <button class="btn secondary" data-go="detail">Ver seguimiento</button>
      </article>
      <article class="card summary-card">
        <div class="row"><strong>Viaje anterior</strong><span class="badge ok">Aprobado</span></div>
        <p class="muted">Comprobante usado en control.</p>
      </article>
    </section>
  `, state.screen);
}
