import { appFrame, frameOptions, stepper, topbar } from "../components/chrome.js";
import { docRow } from "../components/documents.js";
import { getMinorsModalHtml, getSagModalHtml } from "./tripScreen.js";
import { STATUS } from "../state/appState.js";
import { selectedSagItems } from "../components/sag.js";
import { getDocumentProgress, getVisibleTripDocuments } from "../services/documentSummaryService.js";

export function docsScreen(state) {
  const { totalRequired, loadedRequired, pendingDocs, progressPercent } = getDocumentProgress(state);

  // 2. Inline question if travelWithMinors is not defined (null)
  let inlineMinorsHtml = "";
  if (state.trip.minors === null) {
    inlineMinorsHtml = `
      <article class="card soft inline-question-card" style="padding:14px; border: 1.5px dashed #ffe4ad; background: #fffcf8; border-radius:13px; margin-bottom:14px">
        <div style="display:flex; flex-direction:column; gap:8px">
          <div>
            <strong style="color:var(--blue-950); font-size:14px; display:block">¿Viajas con menores de edad?</strong>
            <small class="muted" style="font-size:11.5px; line-height:1.35; display:block; margin-top:2px">
              Esta información es obligatoria para solicitar la autorización notarial correspondiente ante las autoridades de frontera.
            </small>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:4px">
            <button class="btn secondary small" data-action="select-minors-inline" data-value="no" style="padding:8px 0; font-size:13px">No, viajo solo/adultos</button>
            <button class="btn small" data-action="select-minors-inline" data-value="yes" style="padding:8px 0; font-size:13px">Sí, viajo con menores</button>
          </div>
        </div>
      </article>
    `;
  }

  const docsToRender = getVisibleTripDocuments(state);

  // 4. Conditional SAG document card (if they declared SAG products)
  let sagDocHtml = "";
  if (state.trip.sag) {
    const items = selectedSagItems(state);
    const detailText = items.length ? items.join(", ") : "Productos declarados";
    sagDocHtml = `
      <article class="doc-row">
        <span class="doc-icon" style="color:var(--green-700); background:var(--green-100)">▣</span>
        <div class="doc-info" style="display:flex; flex-direction:column; gap:2px">
          <strong style="font-size:14.5px; color:var(--blue-950)">Declaración jurada SAG</strong>
          <span class="doc-meta" style="font-size:12px; color:var(--muted)">Completada · declaraste: ${detailText}</span>
        </div>
        <div class="doc-action" style="display:flex; flex-direction:column; align-items:flex-end; gap:4px">
          <span class="badge ok">Declarada</span>
          <button class="link-btn small" data-action="open-sag-modal" style="font-size:12.5px; padding:2px 0">Modificar &rsaquo;</button>
        </div>
      </article>
    `;
  }

  // 5. Contextual upload panel
  const activeDoc = state.docs.find(d => d.id === state.activeUploadDocId);
  let uploadPanelHtml = "";
  if (activeDoc) {
    const hasFile = Boolean(activeDoc.file);
    const isRechazado = activeDoc.status === "Rechazado";
    const titleLabel = isRechazado ? `Corregir ${activeDoc.title}` : `Subir ${activeDoc.title}`;
    
    let fileDetailHtml = "";
    if (hasFile) {
      fileDetailHtml = `
        <div class="file-pill" style="margin-top:12px; border:1px solid var(--line); border-radius:12px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; background:#fff">
          <div style="display:flex; align-items:center; gap:8px">
            <span style="font-size:20px">📄</span>
            <div>
              <strong style="font-size:13px; color:var(--blue-950); display:block; max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">${activeDoc.file.name}</strong>
              <small class="muted" style="font-size:11px">${activeDoc.file.size} · Cargado en borrador</small>
            </div>
          </div>
          <div style="display:flex; gap:6px; flex-shrink: 0">
            <button class="btn secondary mini" data-action="view-file" data-id="${activeDoc.id}" style="padding:4px 8px; font-size:11px; height:auto; width:auto; font-weight:800">Ver</button>
            <button class="btn danger mini" data-action="delete-file" data-id="${activeDoc.id}" style="padding:4px 8px; font-size:11px; height:auto; width:auto; font-weight:800; background:#fee2e2; color:#ef4444; border: 1px solid #fca5a5">Eliminar</button>
          </div>
        </div>
      `;
    }
    
    uploadPanelHtml = `
      <section class="dropzone contextual-upload" style="margin: 18px 0 10px; padding: 18px 16px; border: 1.5px dashed var(--blue-400); border-radius: 14px; background: #f8fbff; text-align: left; position: relative; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.05)">
        <button class="bottom-sheet-close" data-action="close-upload" aria-label="Cerrar panel de carga" style="position:absolute; right:12px; top:8px; background:none; border:none; font-size:22px; color:var(--muted); cursor:pointer">&times;</button>
        
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px">
          <span style="font-size:18px; color:var(--blue-700)">⇧</span>
          <strong style="color:var(--blue-950); font-size:14.5px">${titleLabel}</strong>
        </div>
        <span class="muted" style="font-size:12px; display:block; margin-bottom:12px">Formatos PDF, JPG o PNG · Máximo 10 MB</span>
        
        <div style="display:flex; flex-direction:column; gap:8px">
          <button class="btn secondary" data-action="select-file" data-id="${activeDoc.id}" style="width:100%; display:flex; justify-content:center; align-items:center; gap:8px; background:#fff; font-weight:800">
            📁 Seleccionar archivo
          </button>
        </div>
        ${fileDetailHtml}
      </section>
    `;
  }

  // 6. Preview Modal floating overlay
  let previewModalHtml = "";
  if (state.previewingDocId) {
    const doc = state.docs.find(d => d.id === state.previewingDocId);
    if (doc && doc.file) {
      previewModalHtml = `
        <div id="file-preview-overlay" class="bottom-sheet-overlay active" style="display:flex; align-items:center; justify-content:center; z-index:2000">
          <div class="bottom-sheet" style="max-height: 85%; width: 90%; max-width: 450px; border-radius: 18px; margin: auto; display:flex; flex-direction:column">
            <div class="bottom-sheet-header" style="border-bottom:1.5px solid var(--line); padding: 14px 20px; display:flex; justify-content:space-between; align-items:center">
              <h3 class="bottom-sheet-title" style="font-size:15px; margin:0; font-weight:800; color:var(--blue-950)">Vista previa: ${doc.file.name}</h3>
              <button class="bottom-sheet-close" data-action="close-preview" aria-label="Cerrar vista previa" style="background:none; border:none; font-size:24px; color:var(--muted); cursor:pointer">&times;</button>
            </div>
            <div class="bottom-sheet-content" style="padding: 24px; display:flex; flex-direction:column; align-items:center; gap:16px; background:#f1f5f9; min-height: 260px; justify-content: center; overflow-y:auto">
              <!-- Mock document visualization -->
              <div style="background:#fff; border-radius:8px; padding:24px; box-shadow:0 4px 16px rgba(0,0,0,0.08); width:85%; display:flex; flex-direction:column; gap:12px; border:1px solid #cbd5e1">
                <div style="display:flex; justify-content:space-between; align-items:center">
                  <span style="font-weight:bold; font-size:11px; color:var(--blue-900); letter-spacing:0.5px">REPÚBLICA DE CHILE</span>
                  <span style="font-size:18px">🇨🇱</span>
                </div>
                <div style="height:2px; background:var(--blue-700)"></div>
                <strong style="text-align:center; font-size:12.5px; color:var(--ink); margin: 8px 0; font-weight:800">${doc.title.toUpperCase()}</strong>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:10.5px; color:var(--muted)">
                  <div>Nombre del Titular: <strong style="color:var(--blue-950)">DEMO USER</strong></div>
                  <div>Patente Relacionada: <strong style="color:var(--blue-950)">${state.trip.plate}</strong></div>
                  <div>Archivo Cargado: <strong style="color:var(--blue-950)">${doc.file.name}</strong></div>
                  <div>Fecha Registro: <strong style="color:var(--blue-950)">2026-06-25</strong></div>
                </div>
                <div style="border: 1px dashed var(--blue-200); padding:8px; text-align:center; font-size:9.5px; color:var(--blue-800); background:#f0f7ff; margin-top:8px; border-radius:6px">
                  Validación Digital Paso Los Libertadores<br/><strong style="font-size:8px">ID: ${state.caseId.slice(0, 12)}...</strong>
                </div>
              </div>
              <small class="muted" style="font-size:11px">${doc.file.name} · ${doc.file.size} · Archivo simulado para propósitos de prototipo</small>
            </div>
            <div class="bottom-sheet-footer" style="padding:14px 20px">
              <button class="btn" data-action="close-preview">Cerrar Vista Previa</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // 7. Officer Fix Banner (if state.status is needsFix)
  let fixBannerHtml = "";
  if (state.status === STATUS.needsFix) {
    fixBannerHtml = `
      <article class="card soft error-banner" style="padding:12px; border: 1.5px solid #ef4444; background: #fef2f2; border-radius:13px; margin-bottom:14px">
        <div style="display:flex; gap:10px; align-items:start">
          <span style="font-size:18px; line-height:1.2">⚠️</span>
          <div>
            <strong style="color:#b91c1c; font-size:13.5px; display:block">Corrección requerida por el funcionario</strong>
            <p style="margin:4px 0 0; font-size:12px; color:#7f1d1d; line-height:1.4">
              "${state.officerNotes || "Por favor reemplace el permiso de circulación por uno vigente."}"
            </p>
          </div>
        </div>
      </article>
    `;
  }

  return appFrame(`
    <div class="header-group">
      ${topbar("Subir documentos", { backTo: "trip", bell: true, role: state.role })}
      ${stepper(["Viaje", "Documentos", "Seguimiento"], 2)}
    </div>
    <section class="sheet" style="padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px))">
      <!-- 1. Progress Banner -->
      <article class="card soft progress-summary" style="padding:14px; margin-bottom:14px; border-radius:13px; background:#fff; border:1px solid var(--line); box-shadow:0 4px 12px rgba(5,32,78,0.03)">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
          <strong style="color:var(--blue-950); font-size:14.5px">${loadedRequired} de ${totalRequired} obligatorios cargados</strong>
          <span style="font-size:12.5px; font-weight:800; color:var(--blue-700)">${Math.round(progressPercent)}%</span>
        </div>
        <div class="progress-bar-container" style="background:#f1f5f9; height:8px; border-radius:99px; overflow:hidden; margin-bottom:8px">
          <div class="progress-bar-fill" style="width:${progressPercent}%; background:linear-gradient(90deg, var(--blue-600), #28aa6e); height:100%; border-radius:99px; transition: width 0.3s ease"></div>
        </div>
        ${loadedRequired < totalRequired 
          ? `<span class="muted" style="font-size:11.5px; display:block">Faltan: <strong style="color:var(--blue-950)">${pendingDocs.map(d => d.title.toLowerCase()).join(", ")}</strong></span>`
          : `<span style="font-size:11.5px; display:block; color:#108552; font-weight:750">✓ ¡Todos los documentos obligatorios listos para continuar!</span>`
        }
      </article>

      <!-- 2. Officer Fix Banner (if rejected) -->
      ${fixBannerHtml}

      <!-- 3. Inline Question for Minors (if null) -->
      ${inlineMinorsHtml}

      <h2 style="font-size:16px; margin: 16px 0 10px; color:var(--blue-950); font-weight:800">Documentos del viaje</h2>
      
      <!-- 4. Main Document List -->
      <div class="doc-list" style="display:grid; gap:10px">
        ${docsToRender.map(doc => docRow(doc, state)).join("")}
        ${sagDocHtml}
      </div>

      <!-- 5. Contextual Upload Panel -->
      ${uploadPanelHtml}

      <!-- 6. Compact Help Accordion -->
      <article class="card soft help-compact" style="margin-top:16px; padding:10px 12px; border-radius:12px; border: 1px solid var(--line); background:#fff">
        <details style="cursor:pointer">
          <summary style="font-size:13px; font-weight:800; color:var(--blue-900); list-style-type: none; display:flex; align-items:center; justify-content:space-between">
            <span>❓ ¿Qué documentos necesito?</span>
            <span style="font-size:16px; color:var(--muted)">&rsaquo;</span>
          </summary>
          <div style="margin-top:8px; font-size:11.5px; color:var(--muted); line-height:1.45; display:flex; flex-direction:column; gap:8px; border-top:1px dashed var(--line); padding-top:8px">
            <div><strong>Cédula o pasaporte:</strong> Original y vigente. Permite validar tu identidad de forma segura.</div>
            <div><strong>Documento del vehículo:</strong> Padrón oficial o título de propiedad que acredite el registro.</div>
            <div><strong>Permiso de circulación:</strong> Impuesto vehicular vigente del país de origen de la patente.</div>
            <div><strong>Seguro obligatorio (SOAPEX):</strong> Cobertura de responsabilidad civil obligatoria para transitar.</div>
            <div><strong>Autorización de menores:</strong> Si viajan menores de edad sin uno de los progenitores, visado notarial legalizado.</div>
          </div>
        </details>
      </article>

      <!-- 7. Sticky Bottom buttons (or standard buttons since we have appFrame framing) -->
      <div class="button-row" style="margin-top:20px; display:grid; grid-template-columns:1fr 1.5fr; gap:10px">
        <button class="btn secondary" data-go="trip">Volver</button>
        ${loadedRequired < totalRequired 
          ? `<button class="btn" disabled style="opacity:0.65; cursor:not-allowed; font-size:12.5px; padding: 12px 6px">Faltan ${totalRequired - loadedRequired} obligatorios</button>`
          : `<button class="btn" data-go="detail">Continuar</button>`
        }
      </div>
      
      <div style="text-align:center; margin-top:12px">
        <button class="link-btn" data-save-draft="true" style="font-size:13.5px; font-weight:800">${state.draftSaved ? "✓ Borrador guardado" : "Guardar borrador"}</button>
      </div>
    </section>
    
    <!-- 8. Interactive Modals -->
    ${getMinorsModalHtml(state)}
    ${getSagModalHtml(state)}
    ${previewModalHtml}
  `, state.screen, frameOptions(state));
}
