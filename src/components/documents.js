export function docRow(doc) {
  const cls = doc.type === "pending" ? "pending" : doc.type === "optional" ? "optional" : "";
  const action = doc.status === "Completado" ? "Reemplazar" : "Subir";
  return `<article class="doc-row ${cls}">
    <span class="doc-icon">${doc.type === "ok" ? "▣" : doc.type === "optional" ? "◎" : "▤"}</span>
    <span><strong>${doc.title}</strong><br/><small class="muted">${doc.desc}</small></span>
    <span style="text-align:right">
      <span class="badge ${doc.type === "ok" ? "ok" : ""}">${doc.status}</span><br/>
      <button class="link-btn" data-upload="${doc.id}" style="margin-top:8px">${action} &rsaquo;</button>
    </span>
  </article>`;
}
