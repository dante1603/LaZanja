import { appFrame, stepper, topbar } from "../components/chrome.js";
import { docRow } from "../components/documents.js";

export function docsScreen(state) {
  return appFrame(`
    <div class="header-group">
      ${topbar("Subir documentos", { backTo: "trip", bell: true })}
      ${stepper(["Viaje", "Documentos", "Declaración SAG", "Seguimiento"], 2)}
    </div>
    <section class="sheet">
      <article class="card soft" style="padding:16px;margin-bottom:18px">
        <div class="row" style="justify-content:start">
          <span class="doc-icon">⇧</span>
          <p style="margin:0">Para continuar, sube los documentos requeridos para tu cruce por el Paso Los Libertadores. Seran validados por Aduana antes de tu viaje.</p>
        </div>
      </article>
      <h2 style="font-size:17px">Documentos requeridos</h2>
      <div class="doc-list">
        ${state.docs.map(docRow).join("")}
      </div>
      <section class="dropzone">
        <div style="font-size:32px;color:var(--blue-700)">⇧</div>
        <strong>Arrastra y suelta tu archivo aqui</strong><br/>
        <button class="link-btn" data-upload="permit">o selecciona desde tu dispositivo</button>
        <div class="file-pill">
          <span><strong>permiso_circulacion.pdf</strong><br/><small class="muted">PDF · 1.2 MB · Subido hace 2 min</small></span>
          <span class="check-dot">OK</span>
        </div>
      </section>
      <article class="card soft">
        <a href="#" class="info-link">
          <span class="doc-icon">?</span>
          <span><strong>Que documentos necesito?</strong><br/><small class="muted">Consulta la lista completa de documentos aceptados y requisitos.</small></span>
          <strong>&rsaquo;</strong>
        </a>
      </article>
      <div class="button-row">
        <button class="btn secondary" data-go="trip">Volver</button>
        <button class="btn" data-go="sag">Continuar</button>
      </div>
      <button class="btn secondary ghost" data-save-draft="true" style="margin-top:10px">${state.draftSaved ? "Borrador guardado" : "Guardar borrador"}</button>
    </section>
  `, state.screen);
}
