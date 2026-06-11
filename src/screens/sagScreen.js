import { appFrame, stepper, topbar } from "../components/chrome.js";
import { productCard, selectedSagItems } from "../components/sag.js";

export function sagScreen(state) {
  const selected = selectedSagItems(state);
  return appFrame(`
    <div class="header-group">
      ${topbar("Declaracion SAG", { backTo: "docs" })}
      ${stepper(["Viaje", "Documentos", "Declaración SAG", "Seguimiento"], 3)}
    </div>
    <section class="sheet sag-sheet">
      <h2 class="sag-title">Declara productos de origen animal o vegetal</h2>
      <p class="sag-subtitle">Indica si llevas contigo alguno de estos productos. Esta declaración es obligatoria antes de ingresar al país.</p>
      
      <div class="product-grid">
        ${Object.entries(state.sagProducts).map(([label, value]) => productCard(label, value)).join("")}
      </div>
      
      <div class="info-box blue-box">
        <div class="info-box-icon blue-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
        </div>
        <div class="info-box-content">
          <h3 class="info-box-title">Tu declaración</h3>
          <p class="info-box-text">Has declarado los siguientes productos:</p>
          <ul class="decl-list">
            ${selected.length ? selected.map(item => `
              <li class="decl-item">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#28aa6e"/>
                  <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${item}</span>
              </li>
            `).join("") : `<li class="decl-item"><span style="color:#64748b;font-weight:400;font-style:italic">Ningún producto declarado.</span></li>`}
          </ul>
        </div>
        <div class="info-box-badge">${selected.length}</div>
      </div>
      
      <div class="info-box orange-box">
        <div class="info-box-icon orange-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="info-box-content">
          <p class="info-box-text" style="color: #7c2d12; font-weight: 750;">
            Omitir productos puede tener consecuencias legales.
          </p>
          <p class="info-box-text" style="color: #7c2d12; font-size: 11.5px; margin-top: 2px;">
            La no declaración puede derivar en multas, decomiso de productos o prohibición de ingreso al país.
          </p>
        </div>
      </div>
      
      <a class="info-box blue-box query-box" href="#">
        <div class="info-box-icon blue-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="info-box-content">
          <h3 class="info-box-title">¿Tienes dudas sobre qué declarar?</h3>
          <p class="info-box-text" style="font-size: 11.5px;">Consulta la lista completa de productos permitidos, restringidos o prohibidos.</p>
          <span class="query-link-text">
            Ver requisitos SAG 
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </div>
      </a>
      
      <div class="button-row">
        <button class="btn secondary" data-go="docs">Volver</button>
        <button class="btn" data-go="detail">Guardar y continuar</button>
      </div>
    </section>
  `, state.screen);
}
