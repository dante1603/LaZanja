import { formatDate } from "../utils/format.js";

export function buildReceipt(caseId, appState) {
  if (caseId === "LZA-2026-00065412") {
    return {
      filename: "comprobante-LZA-2026-00065412.txt",
      text: [
        "Comprobante La Zanja",
        "Tramite: LZA-2026-00065412",
        "Estado: Usado en control",
        "Fecha: 2026-06-12",
        "Destino: Mendoza, Argentina",
        "Vehiculo: AB-CD-12",
        "Cruce realizado con exito el 12 de junio de 2026.",
      ].join("\n"),
    };
  }

  return {
    filename: `comprobante-${appState.caseId}.txt`,
    text: [
      "Comprobante La Zanja",
      `Tramite: ${appState.caseId}`,
      `Estado: ${appState.status}`,
      `Fecha: ${formatDate(appState.trip.date)}`,
      `Destino: ${appState.trip.destination}`,
      `Vehiculo: ${appState.trip.plate}`,
    ].join("\n"),
  };
}

export function downloadReceipt(caseId, appState) {
  const receipt = buildReceipt(caseId, appState);
  const blob = new Blob([receipt.text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = receipt.filename;
  link.click();
  URL.revokeObjectURL(url);
}
