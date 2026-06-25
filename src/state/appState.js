const STORAGE_KEY = "la-zanja-demo-state-v3";

export const STATUS = {
  draft: "draft",
  submitted: "submitted",
  underReview: "under_review",
  approved: "approved",
  rejected: "rejected",
  needsFix: "needs_fix",
};

export const statusLabels = {
  [STATUS.draft]: "Borrador",
  [STATUS.submitted]: "Enviado",
  [STATUS.underReview]: "En revision",
  [STATUS.approved]: "Aprobado",
  [STATUS.rejected]: "Rechazado",
  [STATUS.needsFix]: "Requiere correccion",
};

const baseEvents = [
  { at: "2026-06-23 09:10", label: "Tramite demo creado por el viajero." },
  { at: "2026-06-23 09:18", label: "Documentos iniciales cargados." },
];

function initialScreen() {
  if (typeof location === "undefined") return "login";
  return location.hash.replace("#", "") || "login";
}

function createInitialState() {
  return {
    screen: initialScreen(),
    logged: false,
    role: null,
    tripStarted: false,
    showLoginFields: false,
    showAccessibilityPanel: false,
    showLogoutConfirmModal: false,
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      focusVisible: true,
      largeTargets: false,
      confirmActions: false,
    },
    caseId: "LZA-2026-00078941",
    status: STATUS.draft,
    officerNotes: "",
    alerts: [
      "Declaracion SAG con productos de origen animal/vegetal.",
      "Viaje con menores: revisar autorizacion notarial.",
    ],
    argentinaValidation: {
      status: "Pendiente",
      detail: "Validacion Argentina simulada para el prototipo academico.",
    },
    trip: {
      date: "2026-07-05",
      destination: "Mendoza, Argentina",
      plate: "AB-CD-12",
      companions: 2,
      minors: null,
      minorsList: [],
      sagConfirmed: true,
      pets: false,
      sag: true,
    },
    docs: [
      { id: "id", title: "Cedula o pasaporte", desc: "Documento de identidad del viajero", status: "Cargado", type: "ok", file: { name: "cedula_identidad.pdf", size: "1.8 MB" } },
      { id: "permit", title: "Permiso de circulacion", desc: "Vigente del pais de origen", status: "Pendiente", type: "pending", file: null },
      { id: "insurance", title: "Seguro obligatorio", desc: "SOAPEX o equivalente", status: "Pendiente", type: "pending", file: null },
      { id: "minor", title: "Autorizacion notarial para menores", desc: "Si viajas con menores de edad", status: "Pendiente", type: "pending", file: null },
      { id: "car", title: "Documento del vehiculo", desc: "Padron o titulo de propiedad", status: "Cargado", type: "ok", file: { name: "padron_vehiculo.pdf", size: "2.4 MB" } },
    ],
    sagProducts: {
      "Frutas y verduras": true,
      "Semillas y plantas": false,
      "Carnes y embutidos": true,
      "Lacteos y derivados": false,
      Mascotas: false,
    },
    draftSaved: false,
    events: baseEvents,
    queueFilter: "Todos",
    scanningQr: false,
  };
}

export function updateMinorDocStatus(stateRef = state) {
  const minorDoc = stateRef.docs.find(item => item.id === "minor");
  if (!minorDoc) return;
  
  if (stateRef.trip.minors === false) {
    minorDoc.status = "Opcional";
    minorDoc.type = "optional";
    minorDoc.file = null;
  } else if (stateRef.trip.minors === true) {
    const list = stateRef.trip.minorsList || [];
    if (list.length === 0) {
      minorDoc.status = "Pendiente";
      minorDoc.type = "pending";
      minorDoc.file = null;
    } else {
      const needsAuthAndPending = list.some(m => m.withBothParents === "no" && m.authorization === "pending");
      if (needsAuthAndPending) {
        minorDoc.status = "Pendiente";
        minorDoc.type = "pending";
        minorDoc.file = null;
      } else {
        minorDoc.status = "Cargado";
        minorDoc.type = "ok";
        if (!minorDoc.file) {
          minorDoc.file = { name: "autorizacion_notarial.pdf", size: "2.1 MB" };
        }
      }
    }
  } else {
    minorDoc.status = "Pendiente";
    minorDoc.type = "pending";
    minorDoc.file = null;
  }
  updateAlerts(stateRef);
}

export function updateAlerts(stateRef = state) {
  const alerts = [];
  if (stateRef.trip.sag) {
    alerts.push("Declaracion SAG con productos de origen animal/vegetal.");
  }
  if (stateRef.trip.minors === true) {
    alerts.push("Viaje con menores: revisar autorizacion notarial.");
  }
  stateRef.alerts = alerts;
}

export function getOfficerStatusLabel(stateRef = state) {
  if (stateRef.status === STATUS.approved) return "Aprobado";
  if (stateRef.status === STATUS.rejected) return "Rechazado";
  if (stateRef.status === STATUS.needsFix) return "Requiere corrección";
  if (stateRef.alerts && stateRef.alerts.length > 0) return "Con alertas";
  if (stateRef.status === STATUS.submitted || stateRef.status === STATUS.underReview) return "Pendiente de revisión";
  return statusLabels[stateRef.status] || stateRef.status;
}

function loadState() {
  if (typeof localStorage === "undefined") {
    const initial = createInitialState();
    updateMinorDocStatus(initial);
    return initial;
  }

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) {
      const initial = createInitialState();
      updateMinorDocStatus(initial);
      return initial;
    }
    const loaded = {
      ...createInitialState(),
      ...stored,
      screen: initialScreen(),
      accessibility: { ...createInitialState().accessibility, ...stored.accessibility },
      trip: { ...createInitialState().trip, ...stored.trip },
      argentinaValidation: { ...createInitialState().argentinaValidation, ...stored.argentinaValidation },
    };
    
    // Ensure files are mapped correctly for legacy local storage states
    if (loaded.docs) {
      loaded.docs = loaded.docs.map(doc => {
        if ((doc.status === "Completado" || doc.status === "Cargado" || doc.type === "ok") && !doc.file) {
          if (doc.id === "id") doc.file = { name: "cedula_identidad.pdf", size: "1.8 MB" };
          else if (doc.id === "car") doc.file = { name: "padron_vehiculo.pdf", size: "2.4 MB" };
          else if (doc.id === "permit") doc.file = { name: "permiso_circulacion.pdf", size: "1.2 MB" };
          else if (doc.id === "insurance") doc.file = { name: "seguro_soapex.pdf", size: "1.5 MB" };
          else if (doc.id === "minor") doc.file = { name: "autorizacion_notarial.pdf", size: "2.1 MB" };
          else doc.file = { name: "documento.pdf", size: "1.0 MB" };
        }
        if (doc.status === "Completado") {
          doc.status = "Cargado";
        }
        return doc;
      });
    }
    
    updateMinorDocStatus(loaded);
    return loaded;
  } catch {
    const initial = createInitialState();
    updateMinorDocStatus(initial);
    return initial;
  }
}

export const state = loadState();

export function persistState() {
  if (typeof localStorage === "undefined") return;
  updateAlerts(state);
  const { screen, showLoginFields, showAccessibilityPanel, ...persisted } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

export function resetDemoState() {
  const fresh = createInitialState();
  Object.keys(state).forEach(key => delete state[key]);
  Object.assign(state, fresh, { screen: "login" });
  updateMinorDocStatus(state);
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function addEvent(label) {
  if (state.events && state.events.length > 0 && state.events[0].label === label) {
    return;
  }
  const now = new Date();
  const at = now.toLocaleString("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  state.events = [{ at, label }, ...state.events].slice(0, 12);
  persistState();
}

export function setStatus(status, note) {
  state.status = status;
  if (note !== undefined) state.officerNotes = note;
  addEvent(`Estado actualizado a ${statusLabels[status]}.`);
}

export function requiredDocs(stateRef = state) {
  return stateRef.docs.filter(doc => doc.type !== "optional");
}

export function hasRequiredDocs(stateRef = state) {
  return requiredDocs(stateRef).every(doc => doc.type === "ok");
}

export function hasTripBasics(stateRef = state) {
  return Boolean(stateRef.trip.date && stateRef.trip.destination && stateRef.trip.plate);
}

export function qrPayload(stateRef = state) {
  return `LAZANJA|${stateRef.caseId}|${stateRef.status}|${stateRef.trip.plate}|${stateRef.trip.date}`;
}
