import { appFrame, stepper, topbar } from "../components/chrome.js";
import { STATUS, statusLabels } from "../state/appState.js";

function formatEventTime(atString) {
  if (atString.includes(",")) {
    let timePart = atString.split(",")[1].trim();
    const match = timePart.match(/(\d{2}):(\d{2})/);
    if (match) {
      let hh = parseInt(match[1]);
      const mm = match[2];
      const isPm = timePart.toLowerCase().includes("p.") || timePart.toLowerCase().includes("pm");
      const isAm = timePart.toLowerCase().includes("a.") || timePart.toLowerCase().includes("am");
      if (isPm && hh < 12) hh += 12;
      if (isAm && hh === 12) hh = 0;
      return `${String(hh).padStart(2, '0')}:${mm}`;
    }
    return timePart;
  }
  const match = atString.match(/\d{2}:\d{2}/);
  return match ? match[0] : atString;
}

export function detailScreen(state) {
  let badgeCls = "badge";
  let userStatusText = statusLabels[state.status];
  
  if (state.status === STATUS.approved) {
    badgeCls = "badge ok";
    userStatusText = "Aprobado";
  } else if (state.status === STATUS.submitted || state.status === STATUS.underReview) {
    badgeCls = "badge";
    userStatusText = "En revisión";
  } else if (state.status === STATUS.needsFix) {
    badgeCls = "badge error";
    userStatusText = "Requiere corrección";
  } else if (state.status === STATUS.rejected) {
    badgeCls = "badge error";
    userStatusText = "Rechazado";
  } else if (state.status === STATUS.draft) {
    badgeCls = "badge optional";
    userStatusText = "Borrador";
  }

  let step = 1;
  if (state.status === STATUS.approved) {
    step = 4;
  } else if (state.status === STATUS.submitted || state.status === STATUS.underReview) {
    step = 3;
  } else if (state.status === STATUS.needsFix) {
    step = 2;
  } else if (state.status === STATUS.draft) {
    step = 2;
  }

  const progressHtml = Array.from({ length: 4 }, (_, i) => {
    const isDone = (i + 1) <= step;
    return `<span class="${isDone ? "done" : ""}"></span>`;
  }).join("");

  const stepsData = [
    { label: "Datos", markerDone: "●", markerTodo: "○" },
    { label: "Docs", markerDone: "●", markerTodo: "○" },
    { label: "Revisión", markerDone: "●", markerTodo: "○" },
    { label: "QR", markerDone: "●", markerTodo: "○" },
  ];

  const labelsHtml = stepsData.map((s, i) => {
    const stepNum = i + 1;
    const isComplete = stepNum < step;
    const isActive = stepNum === step;
    let cls = "";
    if (isComplete) cls = "complete";
    else if (isActive) cls = "active";
    
    if (isActive && state.status === STATUS.needsFix) {
      cls += " error-step";
    }

    const marker = (isComplete || isActive) ? s.markerDone : s.markerTodo;
    return `<span class="${cls}">${marker} ${s.label}</span>`;
  }).join("");

  let stateDesc = "";
  if (state.status === STATUS.approved) {
    stateDesc = "Tu trámite ha sido aprobado por el funcionario. Presenta el código QR en los puntos de control.";
  } else if (state.status === STATUS.submitted || state.status === STATUS.underReview) {
    stateDesc = "Recibimos tu solicitud. Un funcionario revisará tus documentos antes del cruce.";
  } else if (state.status === STATUS.needsFix) {
    stateDesc = "Tu solicitud requiere corrección de documentos. Por favor revisa las observaciones del funcionario.";
  } else if (state.status === STATUS.rejected) {
    stateDesc = "Tu trámite ha sido rechazado. Revisa las observaciones adjuntas.";
  } else {
    stateDesc = "Completa los antecedentes y envía el trámite para revisión.";
  }

  let buttonsHtml = "";
  if (state.status === STATUS.approved) {
    buttonsHtml = `
      <button class="btn" data-go="qr" style="margin-top:14px">Ver código QR</button>
      <button class="btn secondary" data-go="history" style="margin-top:8px">Volver a mis trámites</button>
      <button class="btn ghost" data-go="home" style="margin-top:8px">Ir al inicio</button>
    `;
  } else if (state.status === STATUS.draft || state.status === STATUS.needsFix) {
    if (state.status === STATUS.needsFix) {
      buttonsHtml = `
        <button class="btn" data-go="docs" style="margin-top:14px">Corregir documentos</button>
        <button class="btn secondary" data-go="history" style="margin-top:8px">Volver a mis trámites</button>
        <button class="btn ghost" data-go="home" style="margin-top:8px">Ir al inicio</button>
      `;
    } else {
      buttonsHtml = `
        <button class="btn" data-submit-case="true" style="margin-top:14px">Enviar a revisión</button>
        <button class="btn secondary" data-go="history" style="margin-top:8px">Volver a mis trámites</button>
        <button class="btn ghost" data-go="home" style="margin-top:8px">Ir al inicio</button>
      `;
    }
  } else {
    buttonsHtml = `
      <button class="btn" data-go="history" style="margin-top:14px">Volver a mis trámites</button>
      <button class="btn ghost" data-go="home" style="margin-top:8px">Ir al inicio</button>
    `;
  }

  const eventsHtml = state.events.slice(0, 5).map(event => {
    const timeStr = formatEventTime(event.at);
    return `
      <li class="timeline-v2-item">
        <span class="timeline-v2-check">✓</span>
        <span class="timeline-v2-time">${timeStr}</span>
        <span class="timeline-v2-label">${event.label}</span>
      </li>
    `;
  }).join("");

  return appFrame(`
    <style>
      .progress-labels {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        text-align: center;
        font-size: 11px;
        color: var(--muted);
        margin-top: 6px;
      }
      .progress-labels span {
        font-weight: 500;
        white-space: nowrap;
      }
      .progress-labels span.active {
        color: var(--blue-600);
        font-weight: 700;
      }
      .progress-labels span.active.error-step {
        color: #b91c1c;
      }
      .progress-labels span.complete {
        color: var(--ink);
        font-weight: 600;
      }
      .timeline-v2-list {
        margin: 12px 0 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .timeline-v2-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-size: 13.0px;
        color: var(--ink);
        line-height: 1.4;
      }
      .timeline-v2-check {
        color: var(--green-600);
        font-weight: bold;
        font-size: 14px;
        flex-shrink: 0;
      }
      .timeline-v2-time {
        color: var(--muted);
        font-size: 12px;
        font-weight: 600;
        min-width: 38px;
        flex-shrink: 0;
      }
      .timeline-v2-label {
        font-weight: 500;
        color: var(--ink);
      }
    </style>

    <div class="header-group">
      ${topbar("Seguimiento del trámite", { backTo: "history" })}
      ${stepper(["Viaje", "Documentos", "Seguimiento"], 3)}
    </div>
    <section class="content">
      <article class="card summary-card" style="margin-top:14px">
        <div class="row">
          <div>
            <h2 style="margin:0">Trámite ${state.caseId}</h2>
            <p class="muted" style="margin:6px 0 0">Validación previa al viaje</p>
          </div>
          <span class="${badgeCls}">${userStatusText}</span>
        </div>
        <div class="progress" style="margin-bottom:6px">${progressHtml}</div>
        <div class="progress-labels">${labelsHtml}</div>
      </article>
      <article class="card soft" style="padding:16px;margin-top:14px">
        <strong>Estado actual</strong>
        <p class="muted" style="margin-top: 4px; line-height: 1.3;">${stateDesc}</p>
        ${state.officerNotes ? `<p style="margin-top: 8px; font-size: 13.5px;"><strong>Observación:</strong> ${state.officerNotes}</p>` : ""}
      </article>
      <article class="card soft" style="padding:16px;margin-top:14px">
        <strong>Historial del trámite</strong>
        <ul class="timeline-v2-list">
          ${eventsHtml}
        </ul>
      </article>
      ${buttonsHtml}
    </section>
  `, state.screen);
}
