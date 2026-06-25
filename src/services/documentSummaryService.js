import { requiredDocs } from "../state/appState.js";

const COMPLETED_STATUSES = new Set(["Cargado", "Aprobado"]);

export function getDocumentProgress(appState) {
  const required = requiredDocs(appState);
  const loaded = required.filter(isLoadedDocument);
  const pending = required.filter(doc => !isLoadedDocument(doc));

  return {
    totalRequired: required.length,
    loadedRequired: loaded.length,
    pendingDocs: pending,
    progressPercent: required.length > 0 ? (loaded.length / required.length) * 100 : 0,
  };
}

export function getVisibleTripDocuments(appState) {
  return appState.docs.filter(doc => {
    if (doc.id === "minor") {
      return appState.trip.minors === true;
    }
    return true;
  });
}

function isLoadedDocument(doc) {
  return Boolean(doc.file) || COMPLETED_STATUSES.has(doc.status) || doc.type === "ok";
}
