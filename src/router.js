import {
  STATUS,
  addEvent,
  hasRequiredDocs,
  hasTripBasics,
  persistState,
  resetDemoState,
  setStatus,
  state,
  updateMinorDocStatus,
} from "./state/appState.js";
import { selectedSagItems } from "./components/sag.js";
import { drawQr } from "./qr/drawQr.js";
import { downloadReceipt } from "./services/receiptService.js";
import { createQrScanner } from "./services/qrScannerService.js";
import { loginScreen } from "./screens/loginScreen.js";
import { homeScreen } from "./screens/homeScreen.js";
import { tripScreen } from "./screens/tripScreen.js";
import { docsScreen } from "./screens/docsScreen.js";
import { detailScreen } from "./screens/detailScreen.js";
import { qrScreen } from "./screens/qrScreen.js";
import { historyScreen } from "./screens/historyScreen.js";
import { controlDashboardScreen } from "./screens/controlDashboardScreen.js";
import { controlQueueScreen } from "./screens/controlQueueScreen.js";
import { controlCaseScreen } from "./screens/controlCaseScreen.js";
import { controlReportsScreen } from "./screens/controlReportsScreen.js";
import { controlPrototypeScreen } from "./screens/controlPrototypeScreen.js";

const screens = {
  login: loginScreen,
  home: homeScreen,
  trip: tripScreen,
  docs: docsScreen,
  detail: detailScreen,
  qr: qrScreen,
  history: historyScreen,
  control: controlDashboardScreen,
  controlQueue: controlQueueScreen,
  controlCase: controlCaseScreen,
  controlReports: controlReportsScreen,
  controlPrototype: controlPrototypeScreen,
};

const travelerRoutes = new Set(["home", "trip", "docs", "detail", "qr", "history"]);
const officerRoutes = new Set(["control", "controlQueue", "controlCase", "controlReports", "controlPrototype"]);

export function createApp(root) {
  const qrScanner = createQrScanner({
    onComplete() {
      if (state.scanningQr) {
        state.scanningQr = false;
        go("controlCase");
      }
    },
  });
  function go(screen) {
    state.screen = normalizeScreen(screen);
    if (state.screen === "trip") {
      state.tripStarted = true;
    }
    if (state.screen !== "login") {
      state.showLoginFields = false;
    }
    history.replaceState(null, "", `#${state.screen}`);
    persistState();
    render();
  }

  function normalizeScreen(screen) {
    if (!screens[screen]) return state.logged ? (state.role === "officer" ? "control" : "home") : "login";
    if (screen === "login") return "login";
    if (!state.logged) return "login";
    if (state.role === "officer") return officerRoutes.has(screen) ? screen : "control";
    return travelerRoutes.has(screen) ? screen : "home";
  }

  function render() {
    state.screen = normalizeScreen(state.screen);
    const screen = screens[state.screen] || screens.login;
    root.innerHTML = screen(state);
    if (state.screen === "qr") drawQr();
  }

  root.addEventListener("click", event => {
    if (event.target.id === "minors-modal-overlay") {
      event.preventDefault();
      state.showMinorsModal = false;
      return render();
    }

    if (event.target.id === "sag-modal-overlay") {
      event.preventDefault();
      state.showSagModal = false;
      return render();
    }

    if (event.target.id === "logout-modal-overlay") {
      event.preventDefault();
      state.showLogoutConfirmModal = false;
      return render();
    }

    const target = event.target.closest("[data-go], [data-count], [data-trip-toggle], [data-upload], [data-save-draft], [data-sag], [data-submit-case], [data-officer-action], [data-download], [data-action], [data-logout-trigger], [data-logout-cancel], [data-logout-confirm]");
    if (!target) return;

    event.preventDefault();

    if (target.dataset.logoutTrigger) {
      state.showLogoutConfirmModal = true;
      return render();
    }

    if (target.dataset.logoutCancel) {
      state.showLogoutConfirmModal = false;
      return render();
    }

    if (target.dataset.logoutConfirm) {
      state.showLogoutConfirmModal = false;
      state.logged = false;
      state.role = null;
      persistState();
      return go("login");
    }

    if (target.dataset.action === "login-click") {
      const container = root.querySelector(".inputs-container");
      const panel = root.querySelector(".login-panel");
      if (container && container.classList.contains("collapsed")) {
        container.classList.remove("collapsed");
        container.classList.add("expanded");
        if (panel) {
          panel.classList.add("expanded");
        }
        state.showLoginFields = true;
      } else {
        const selectedRole = target.dataset.role || root.querySelector("#login-id")?.value || "traveler";
        login(selectedRole);
      }
      return;
    }

    if (target.dataset.action === "toggle-stepper") {
      const container = root.querySelector(".stepper-container");
      if (container) {
        const isExpanded = container.classList.contains("expanded");
        container.classList.toggle("expanded");
        target.setAttribute("aria-expanded", !isExpanded);
      }
      return;
    }

    if (target.dataset.action === "toggle-accessibility-panel") {
      state.showAccessibilityPanel = !state.showAccessibilityPanel;
      return render();
    }

    if (target.dataset.action === "toggle-accessibility-setting") {
      const setting = target.dataset.setting;
      if (setting && state.accessibility && Object.prototype.hasOwnProperty.call(state.accessibility, setting)) {
        state.accessibility[setting] = !state.accessibility[setting];
        addEvent(`Accesibilidad actualizada: ${target.querySelector("strong")?.textContent || setting}.`);
        persistState();
      }
      return render();
    }

    if (target.dataset.action === "reset-accessibility") {
      state.accessibility = {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        focusVisible: true,
        largeTargets: false,
        confirmActions: false,
      };
      addEvent("Accesibilidad restablecida a valores por defecto.");
      persistState();
      return render();
    }

    if (target.dataset.action === "apply-accessibility") {
      state.showAccessibilityPanel = false;
      persistState();
      return render();
    }

    if (target.dataset.action === "select-queue-filter") {
      state.queueFilter = target.dataset.filter;
      persistState();
      return render();
    }

    if (target.dataset.action === "clear-queue-filter") {
      state.queueFilter = "Todos";
      persistState();
      return render();
    }

    if (target.dataset.action === "start-qr-scan") {
      state.scanningQr = true;
      render();
      qrScanner.start();
      return;
    }

    if (target.dataset.action === "cancel-qr-scan") {
      state.scanningQr = false;
      qrScanner.stop();
      return render();
    }

    if (target.dataset.action === "export-report") {
      const format = target.dataset.format || "PDF";
      alert(`Exportando reporte operativo en formato ${format}...\nLa descarga se iniciará automáticamente.`);
      return;
    }

    if (target.dataset.action === "change-role-switch") {
      const newRole = target.dataset.role;
      state.role = newRole;
      addEvent(`Cambio de rol simulado a ${newRole === "officer" ? "Funcionario" : "Viajero"}.`);
      persistState();
      return go(newRole === "officer" ? "control" : "home");
    }

    if (target.dataset.action === "go-trip-minors") {
      state.showMinorsModal = true;
      if (state.trip.minors && (!state.trip.minorsList || state.trip.minorsList.length === 0)) {
        state.trip.minorsList = [{ name: "", document: "", withBothParents: "yes", authorization: "pending" }];
      }
      return go("trip");
    }

    if (target.dataset.action === "select-tab") {
      state.qrActiveTab = target.dataset.tab;
      persistState();
      return render();
    }

    if (target.dataset.action === "open-minors-modal") {
      state.showMinorsModal = true;
      if (state.trip.minors && (!state.trip.minorsList || state.trip.minorsList.length === 0)) {
        state.trip.minorsList = [{ name: "", document: "", withBothParents: "yes", authorization: "pending" }];
      }
      return render();
    }

    if (target.dataset.action === "close-minors-modal") {
      state.showMinorsModal = false;
      return render();
    }

    if (target.dataset.action === "select-minors-option") {
      const val = target.dataset.value === "yes";
      state.trip.minors = val;
      if (val && (!state.trip.minorsList || state.trip.minorsList.length === 0)) {
        state.trip.minorsList = [{ name: "", document: "", withBothParents: "yes", authorization: "pending" }];
      }
      updateMinorDocStatus(state);
      persistState();
      return render();
    }

    if (target.dataset.action === "add-minor-field") {
      if (!state.trip.minorsList) state.trip.minorsList = [];
      state.trip.minorsList.push({ name: "", document: "", withBothParents: "yes", authorization: "pending" });
      updateMinorDocStatus(state);
      persistState();
      return render();
    }

    if (target.dataset.action === "remove-minor-field") {
      const idx = Number(target.dataset.index);
      if (state.trip.minorsList && state.trip.minorsList[idx]) {
        state.trip.minorsList.splice(idx, 1);
      }
      updateMinorDocStatus(state);
      persistState();
      return render();
    }

    if (target.dataset.action === "save-minors-modal") {
      state.showMinorsModal = false;
      updateMinorDocStatus(state);
      addEvent(state.trip.minors ? "Detalles de menores de edad actualizados." : "Declarado que no viajan menores.");
      persistState();
      return render();
    }

    if (target.dataset.action === "open-sag-modal") {
      state.showSagModal = true;
      return render();
    }

    if (target.dataset.action === "close-sag-modal") {
      state.showSagModal = false;
      return render();
    }

    if (target.dataset.action === "save-sag-modal") {
      state.showSagModal = false;
      state.trip.sagConfirmed = true;
      addEvent("Declaración SAG actualizada.");
      persistState();
      return render();
    }

    if (target.dataset.action === "go-trip-sag") {
      state.showSagModal = true;
      return go("trip");
    }

    if (target.dataset.action === "select-minors-inline") {
      const val = target.dataset.value === "yes";
      state.trip.minors = val;
      if (val && (!state.trip.minorsList || state.trip.minorsList.length === 0)) {
        state.trip.minorsList = [{ name: "", document: "", withBothParents: "yes", authorization: "pending" }];
      }
      updateMinorDocStatus(state);
      addEvent(val ? "Declarado que viaja con menores de edad." : "Declarado que no viaja con menores.");
      persistState();
      return render();
    }

    if (target.dataset.action === "select-file") {
      const id = target.dataset.id;
      const doc = state.docs.find(item => item.id === id);
      if (doc) {
        let fileName = "documento.pdf";
        let fileSize = "1.0 MB";
        if (id === "permit") { fileName = "permiso_circulacion.pdf"; fileSize = "1.2 MB"; }
        else if (id === "insurance") { fileName = "seguro_soapex.pdf"; fileSize = "1.5 MB"; }
        else if (id === "minor") { fileName = "autorizacion_notarial.pdf"; fileSize = "2.1 MB"; }
        else if (id === "id") { fileName = "cedula_identidad.pdf"; fileSize = "1.8 MB"; }
        else if (id === "car") { fileName = "padron_vehiculo.pdf"; fileSize = "2.4 MB"; }
        
        doc.file = { name: fileName, size: fileSize };
        doc.status = "Cargado";
        doc.type = "ok";
        addEvent(`Documento cargado: ${doc.title}.`);
        persistState();
      }
      return render();
    }

    if (target.dataset.action === "delete-file") {
      const id = target.dataset.id;
      const doc = state.docs.find(item => item.id === id);
      if (doc) {
        doc.file = null;
        doc.status = "Pendiente";
        doc.type = "pending";
        addEvent(`Documento eliminado: ${doc.title}.`);
        persistState();
      }
      return render();
    }

    if (target.dataset.action === "view-file") {
      state.previewingDocId = target.dataset.id;
      return render();
    }

    if (target.dataset.action === "close-preview") {
      state.previewingDocId = null;
      return render();
    }

    if (target.dataset.action === "close-upload") {
      state.activeUploadDocId = null;
      return render();
    }

    if (target.dataset.go) return go(target.dataset.go);
    if (target.dataset.count) return updateCompanions(target.dataset.count);
    if (target.dataset.tripToggle) return toggleTripFlag(target.dataset.tripToggle);
    if (target.dataset.upload) return completeDocument(target.dataset.upload);
    if (target.dataset.saveDraft) return saveDraft();
    if (target.dataset.sag) return toggleSagProduct(target.dataset.sag);
    if (target.dataset.submitCase) return submitCase();
    if (target.dataset.officerAction) return officerAction(target.dataset.officerAction);
    if (target.dataset.download) return downloadReceipt(target.dataset.download === "true" ? null : target.dataset.download, state);
  });

  root.addEventListener("change", event => {
    const minorTarget = event.target.closest("[data-minor-index]");
    if (minorTarget) {
      const idx = Number(minorTarget.dataset.minorIndex);
      const field = minorTarget.dataset.minorField;
      if (state.trip.minorsList && state.trip.minorsList[idx]) {
        state.trip.minorsList[idx][field] = minorTarget.value;
        updateMinorDocStatus(state);
        persistState();
      }
      return;
    }

    const target = event.target.closest("[data-bind]");
    if (!target) return;
    state.trip[target.dataset.bind] = target.value;
    persistState();
  });

  root.addEventListener("input", event => {
    const target = event.target.closest("[data-note]");
    if (!target) return;
    state.officerNotes = target.value;
    persistState();
  });

  window.addEventListener("hashchange", () => {
    state.screen = location.hash.replace("#", "") || "login";
    render();
  });

  function login(role) {
    state.logged = true;
    state.role = role === "officer" ? "officer" : "traveler";
    addEvent(state.role === "officer" ? "Funcionario ingreso al centro de control." : "Viajero ingreso a la app demo.");
    go(state.role === "officer" ? "control" : "home");
  }

  function updateCompanions(delta) {
    state.trip.companions = Math.max(0, state.trip.companions + Number(delta));
    persistState();
    render();
  }

  function toggleTripFlag(key) {
    state.trip[key] = !state.trip[key];
    if (key === "minors") {
      const minorDoc = state.docs.find(item => item.id === "minor");
      if (minorDoc) {
        minorDoc.type = state.trip.minors ? (minorDoc.status === "Completado" ? "ok" : "pending") : "optional";
        minorDoc.status = state.trip.minors ? minorDoc.status : "Opcional";
      }
    }
    persistState();
    render();
  }

  function completeDocument(id) {
    state.activeUploadDocId = id;
    render();
  }

  function saveDraft() {
    state.draftSaved = true;
    persistState();
    render();
  }

  function toggleSagProduct(key) {
    state.sagProducts[key] = !state.sagProducts[key];
    state.trip.pets = Boolean(state.sagProducts.Mascotas);
    state.trip.sag = selectedSagItems(state).some(item => item !== "Mascotas");
    persistState();
    render();
  }

  function submitCase() {
    if (!hasTripBasics()) {
      addEvent("Intento de envio bloqueado: faltan datos basicos del viaje.");
      return go("trip");
    }

    if (!hasRequiredDocs()) {
      addEvent("Intento de envio bloqueado: faltan documentos requeridos.");
      return go("docs");
    }

    setStatus(STATUS.submitted);
    state.docs.forEach(doc => {
      if (doc.file) {
        doc.status = "En revisión";
      }
    });
    persistState();
    return go("detail");
  }

  function officerAction(action) {
    const note = state.officerNotes.trim();
    if (action === "approve") {
      setStatus(STATUS.approved, note || "Aprobado en revision demo.");
      state.argentinaValidation.status = "Validada";
      state.docs.forEach(doc => {
        if (doc.file) {
          doc.status = "Aprobado";
        }
      });
    }
    if (action === "reject") {
      setStatus(STATUS.rejected, note || "Rechazo demo: documentacion insuficiente.");
    }
    if (action === "needs_fix") {
      setStatus(STATUS.needsFix, note || "Solicitar correccion de antecedentes.");
      const permitDoc = state.docs.find(d => d.id === "permit");
      if (permitDoc) {
        permitDoc.status = "Rechazado";
        permitDoc.type = "pending";
      }
    }
    persistState();
    return go("controlCase");
  }

  root.addEventListener("click", event => {
    const target = event.target.closest("[data-reset-demo], [data-logout]");
    if (!target) return;
    event.preventDefault();
    if (target.dataset.resetDemo) {
      resetDemoState();
      history.replaceState(null, "", "#login");
      return render();
    }
    if (target.dataset.logout) {
      state.logged = false;
      state.role = null;
      persistState();
      return go("login");
    }
  });

  return { render, go };
}
