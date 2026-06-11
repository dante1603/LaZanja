import { state } from "./state/appState.js";
import { selectedSagItems } from "./components/sag.js";
import { formatDate } from "./utils/format.js";
import { drawQr } from "./qr/drawQr.js";
import { loginScreen } from "./screens/loginScreen.js";
import { homeScreen } from "./screens/homeScreen.js";
import { tripScreen } from "./screens/tripScreen.js";
import { docsScreen } from "./screens/docsScreen.js";
import { sagScreen } from "./screens/sagScreen.js";
import { detailScreen } from "./screens/detailScreen.js";
import { qrScreen } from "./screens/qrScreen.js";
import { historyScreen } from "./screens/historyScreen.js";

const screens = {
  login: loginScreen,
  home: homeScreen,
  trip: tripScreen,
  docs: docsScreen,
  sag: sagScreen,
  detail: detailScreen,
  qr: qrScreen,
  history: historyScreen,
};

export function createApp(root) {
  function go(screen) {
    state.screen = screens[screen] ? screen : "home";
    if (state.screen !== "login") {
      state.showLoginFields = false;
    }
    history.replaceState(null, "", `#${state.screen}`);
    render();
  }

  function render() {
    const screen = screens[state.screen] || screens.login;
    root.innerHTML = screen(state);
    if (state.screen === "qr") drawQr();
  }

  root.addEventListener("click", event => {
    const target = event.target.closest("[data-go], [data-count], [data-trip-toggle], [data-upload], [data-save-draft], [data-sag], [data-approve], [data-download], [data-action]");
    if (!target) return;

    event.preventDefault();

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
        go("home");
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

    if (target.dataset.go) return go(target.dataset.go);
    if (target.dataset.count) return updateCompanions(target.dataset.count);
    if (target.dataset.tripToggle) return toggleTripFlag(target.dataset.tripToggle);
    if (target.dataset.upload) return completeDocument(target.dataset.upload);
    if (target.dataset.saveDraft) return saveDraft();
    if (target.dataset.sag) return toggleSagProduct(target.dataset.sag);
    if (target.dataset.approve) {
      state.approved = true;
      return go("qr");
    }
    if (target.dataset.download) return downloadReceipt();
  });

  root.addEventListener("change", event => {
    const target = event.target.closest("[data-bind]");
    if (!target) return;
    state.trip[target.dataset.bind] = target.value;
  });

  function updateCompanions(delta) {
    state.trip.companions = Math.max(0, state.trip.companions + Number(delta));
    render();
  }

  function toggleTripFlag(key) {
    state.trip[key] = !state.trip[key];
    render();
  }

  function completeDocument(id) {
    const doc = state.docs.find(item => item.id === id);
    if (doc) {
      doc.status = "Completado";
      doc.type = "ok";
    }
    render();
  }

  function saveDraft() {
    state.draftSaved = true;
    render();
  }

  function toggleSagProduct(key) {
    state.sagProducts[key] = !state.sagProducts[key];
    state.trip.pets = Boolean(state.sagProducts.Mascotas);
    state.trip.sag = selectedSagItems(state).some(item => item !== "Mascotas");
    render();
  }

  function downloadReceipt() {
    const blob = new Blob([`Comprobante La Zanja\nTramite: LZA-2025-00078941\nFecha: ${formatDate(state.trip.date)}\nDestino: ${state.trip.destination}\nVehiculo: ${state.trip.plate}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "comprobante-la-zanja.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return { render, go };
}
