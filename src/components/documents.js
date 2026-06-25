import { STATUS } from "../state/appState.js";

export function docRow(doc, state) {
  const isActive = state.activeUploadDocId === doc.id ? "active-upload" : "";
  const isOptional = doc.type === "optional";
  const hasFile = Boolean(doc.file);
  
  // 1. Determine Badge Class and Status Text based on case status and doc state
  let badgeCls = "badge";
  let statusText = doc.status;
  
  if (isOptional) {
    badgeCls = "badge optional";
    statusText = "Opcional";
  } else if (!hasFile && doc.status === "Pendiente") {
    badgeCls = "badge pending";
    statusText = "Pendiente";
  } else if (doc.status === "Rechazado") {
    badgeCls = "badge error";
    statusText = "Rechazado";
  } else if (hasFile) {
    if (state.status === STATUS.draft) {
      badgeCls = "badge cargado";
      statusText = "Cargado";
    } else if (state.status === STATUS.submitted || state.status === STATUS.underReview) {
      badgeCls = "badge review";
      statusText = "En revisión";
    } else if (state.status === STATUS.approved) {
      badgeCls = "badge ok";
      statusText = "Aprobado";
    } else if (state.status === STATUS.needsFix) {
      // If the case needs fix, and this specific doc is rejected (e.g. permit)
      if (doc.id === "permit" || doc.status === "Rechazado") {
        badgeCls = "badge error";
        statusText = "Rechazado";
      } else {
        badgeCls = "badge ok";
        statusText = "Aprobado";
      }
    }
  }

  // 2. Determine Action Button and Meta Text
  let actionText = hasFile ? "Reemplazar" : "Subir";
  let actionData = `data-upload="${doc.id}"`;
  let metaText = doc.desc;

  if (isOptional) {
    metaText = "Opcional · no aplica para este viaje";
    actionText = "Configurar";
    actionData = `data-action="open-minors-modal"`;
  } else if (!hasFile) {
    metaText = "Pendiente · obligatorio";
  } else if (hasFile) {
    if (statusText === "Rechazado") {
      metaText = `Rechazado · corregir archivo (${doc.file ? doc.file.name : "archivo.pdf"})`;
      actionText = "Reemplazar";
    } else {
      const fileName = doc.file ? doc.file.name : "archivo.pdf";
      const fileDetail = doc.id === "id" ? "viajero principal" : doc.id === "car" ? `vehículo ${state.trip.plate}` : "archivo listo";
      metaText = `Cargado · ${fileDetail} (${fileName})`;
    }
  }

  // Special case for minors button: if it requires setting details or loading file
  if (doc.id === "minor" && state.trip.minors === true) {
    const list = state.trip.minorsList || [];
    if (list.length === 0) {
      metaText = "Configuración pendiente · obligatorio";
      actionText = "Configurar";
      actionData = `data-action="open-minors-modal"`;
    } else {
      const needsAuth = list.some(m => m.withBothParents === "no");
      if (needsAuth) {
        if (!hasFile) {
          metaText = "Pendiente · requiere autorización adjunta";
          actionText = "Subir";
          actionData = `data-upload="${doc.id}"`;
        } else {
          metaText = `Cargado · autorización adjunta (${doc.file.name})`;
          actionText = "Reconfigurar";
          actionData = `data-action="open-minors-modal"`;
        }
      } else {
        metaText = "Cargado · viaja con ambos padres (no requiere autorización)";
        actionText = "Configurar";
        actionData = `data-action="open-minors-modal"`;
      }
    }
  }

  // Icon mapping
  let icon = "▤";
  if (statusText === "Aprobado" || statusText === "Cargado" || statusText === "En revisión") {
    icon = "▣";
  } else if (isOptional) {
    icon = "◎";
  } else if (statusText === "Rechazado") {
    icon = "⚠";
  }

  const borderCls = statusText === "Rechazado" ? "doc-row-error" : "";

  return `<article class="doc-row ${isActive} ${borderCls}">
    <span class="doc-icon">${icon}</span>
    <div class="doc-info" style="display:flex; flex-direction:column; gap:2px">
      <strong style="font-size:14.5px; color:var(--blue-950)">${doc.title}</strong>
      <span class="doc-meta" style="font-size:12px; color:var(--muted)">${metaText}</span>
    </div>
    <div class="doc-action" style="display:flex; flex-direction:column; align-items:flex-end; gap:4px">
      <span class="${badgeCls}">${statusText}</span>
      <button class="link-btn small" ${actionData} style="font-size:12.5px; padding:2px 0">${actionText} &rsaquo;</button>
    </div>
  </article>`;
}
