import { appFrame, stepper, topbar } from "../components/chrome.js";
import { smallToggle } from "../components/forms.js";
import { declarationSummary } from "../components/sag.js";

export function tripScreen(state) {
  return appFrame(`
    <div class="header-group">
      ${topbar("Registrar viaje", { backTo: "home" })}
      ${stepper(["Viaje", "Documentos", "Declaración SAG", "Seguimiento"], 1)}
    </div>
    <section class="sheet">
      <div class="field">
        <label for="date">Fecha de cruce</label>
        <input id="date" type="date" value="${state.trip.date}" data-bind="date" />
      </div>
      <div class="field">
        <label for="destination">Destino</label>
        <select id="destination" data-bind="destination">
          <option ${state.trip.destination === "Mendoza, Argentina" ? "selected" : ""}>Mendoza, Argentina</option>
          <option ${state.trip.destination === "San Luis, Argentina" ? "selected" : ""}>San Luis, Argentina</option>
          <option ${state.trip.destination === "Buenos Aires, Argentina" ? "selected" : ""}>Buenos Aires, Argentina</option>
        </select>
      </div>
      <div class="field">
        <label for="plate">Patente del vehiculo</label>
        <input id="plate" value="${state.trip.plate}" data-bind="plate" />
      </div>
      <label class="field">
        <span>Acompanantes (mayores)</span>
        <div class="counter">
          <strong>${state.trip.companions}</strong>
          <span class="counter-controls">
            <button class="round" data-count="-1" aria-label="Restar acompanante">-</button>
            <button class="round" data-count="1" aria-label="Sumar acompanante">+</button>
          </span>
        </div>
      </label>
      <section class="minors-panel" aria-label="Viaje con menores">
        ${smallToggle("minors", "Menores de edad", state.trip.minors)}
      </section>
      ${declarationSummary(state)}
      <button class="btn" data-go="docs" style="margin-top:20px">Continuar</button>
    </section>
  `, state.screen);
}
