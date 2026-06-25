import { state } from "../state/appState.js";

export function statusbar(dark = false) {
  return ``;
}

export function topbar(title, options = {}) {
  const { back = true, menu = false } = options;
  
  const isTraveler = state.role !== "officer";
  
  const rightSide = isTraveler ? `
    <div style="display: flex; gap: 8px; align-items: center;">
      <button class="accessibility-trigger-btn" data-action="toggle-accessibility-panel" aria-label="Ajustes de accesibilidad">
        Aa
      </button>
      <button class="logout-trigger-btn" data-logout-trigger="true" aria-label="Cerrar sesión">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </div>
  ` : `<span style="width:36px"></span>`;

  if (!back && menu) {
    return `
      <header class="topbar home-topbar">
        <div class="topbar-row">
          <h1 class="topbar-title">${title}</h1>
          ${rightSide}
        </div>
      </header>`;
  }

  return `
    <header class="topbar">
      <div class="topbar-row">
        ${back ? `
          <button class="icon-btn" data-go="${options.backTo || "home"}" aria-label="Volver">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>` : `<span></span>`}
        <h1>${title}</h1>
        ${rightSide}
      </div>
    </header>`;
}

export function stepper(items, active) {
  const stepDetails = [
    { title: "Datos del viaje", desc: "Información básica del cruce" },
    { title: "Documentos", desc: "Archivos requeridos" },
    { title: "Seguimiento", desc: "Estado y QR" }
  ];

  const compactHtml = `
    <div class="stepper-compact">
      <div class="stepper-compact-left">
        <span>${items[active - 1]}</span>
      </div>
      <div class="stepper-compact-center">
        <div class="stepper-dots" style="--active-step: ${active}; --total-steps: ${items.length}">
          <div class="stepper-progress-track"></div>
          <div class="stepper-progress-fill"></div>
          ${items.map((_, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === active;
            const isComplete = stepNum < active;
            return `<span class="stepper-dot ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}" style="left: ${(index / (items.length - 1)) * 100}%"></span>`;
          }).join("")}
        </div>
      </div>
      <button class="stepper-compact-right" data-action="toggle-stepper" aria-expanded="false" aria-label="Ver vista general de pasos">
        <span>Ver vista general</span>
        <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  `;

  const verticalStepsHtml = items.map((label, index) => {
    const stepNum = index + 1;
    const isActive = stepNum === active;
    const isComplete = stepNum < active;
    const detail = stepDetails[index] || { title: label, desc: "" };
    const circleContent = isComplete ? "\u2713" : stepNum;

    return `
      <div class="vertical-step ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}">
        <div class="vertical-step-left">
          <div class="vertical-step-circle">${circleContent}</div>
          ${index < items.length - 1 ? '<div class="vertical-step-line"></div>' : ""}
        </div>
        <div class="vertical-step-content">
          <div class="vertical-step-text">
            <span class="vertical-step-title">${detail.title}</span>
            <span class="vertical-step-desc">${detail.desc}</span>
          </div>
          ${isActive ? '<span class="actual-badge">Actual</span>' : ""}
        </div>
      </div>
    `;
  }).join("");

  const overviewHtml = `
    <div class="stepper-overview">
      <div class="stepper-overview-card">
        <div class="vertical-steps">
          ${verticalStepsHtml}
        </div>
      </div>
    </div>
  `;

  return `
    <div class="stepper-container">
      ${compactHtml}
      ${overviewHtml}
    </div>
  `;
}

export function bottomNav(currentScreen) {
  const items = [
    ["home", "Inicio"],
    ["trip", "Nuevo trámite"],
    ["history", "Mis trámites"],
    ["qr", "Mi QR"],
  ];
  
  const navIcons = {
    home: (active) => active 
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    trip: (active) => active
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm3-4H7v-2h8v2zm0-4H7V7h8v2z"/></svg>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="9" y1="12" x2="15" y2="12"></line><line x1="9" y1="16" x2="15" y2="16"></line><line x1="9" y1="8" x2="15" y2="8"></line></svg>`,
    history: (active) => active
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 2C6.98 2 2.5 6.48 2.5 12s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13h-2v6l5.2 3.1.8-1.3-4-2.4V7z"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    qr: (active) => active
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3h8v8H3V3zm2 2v4h4V5H5zm2 2h2v2H7V7zm6-4h8v8h-8V3zm2 2v4h4V5h-4zm2 2h2v2h-2V7zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm2 2h2v2H7v-2zm6-4h3v3h-3v-3zm5 5h3v3h-3v-3zm-5 2h3v1h-3v-1zm5-5h3v3h-3v-3zm-2 2h2v3h-2v-3z"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="3" height="3" rx="0.5"></rect><rect x="18" y="18" width="3" height="3" rx="0.5"></rect><rect x="14" y="18" width="3" height="3" rx="0.5"></rect><rect x="18" y="14" width="3" height="3" rx="0.5"></rect></svg>`,
  };

  return `<nav class="bottom-nav" aria-label="Navegacion principal">
    ${items.map(([screen, label]) => {
      let active = currentScreen === screen;
      if (screen === "trip" && (currentScreen === "trip" || currentScreen === "docs")) {
        active = true;
      }
      if (screen === "history" && (currentScreen === "history" || currentScreen === "detail")) {
        active = true;
      }
      return `
        <button class="nav-btn ${active ? "active" : ""}" data-go="${screen}">
          <span class="nav-icon">${navIcons[screen](active)}</span>
          <span>${label}</span>
        </button>
      `;
    }).join("")}
  </nav>`;
}

export function appFrame(inner, currentScreen, nav = true) {
  const isHome = currentScreen === "home";
  const accessibility = state.accessibility || {};
  const accessibilityClasses = [
    accessibility.highContrast ? "access-high-contrast" : "",
    accessibility.largeText ? "access-large-text" : "",
    accessibility.reducedMotion ? "access-reduced-motion" : "",
    accessibility.focusVisible ? "access-focus-visible" : "",
    accessibility.largeTargets ? "access-large-targets" : "",
    accessibility.confirmActions ? "access-confirm-actions" : "",
  ].filter(Boolean).join(" ");

  return `
    <section class="device">
      <div class="screen ${isHome ? "gradient-bg" : ""} ${accessibilityClasses}">
        ${statusbar(false)}
        ${inner}
        ${nav ? bottomNav(currentScreen) : ""}
        ${state.showAccessibilityPanel ? renderAccessibilityPanel() : ""}
        ${renderLogoutConfirmModal()}
      </div>
    </section>`;
}

function renderLogoutConfirmModal() {
  const isActive = state.showLogoutConfirmModal ? "active" : "";
  return `
    <div id="logout-modal-overlay" class="bottom-sheet-overlay ${isActive}">
      <div class="bottom-sheet" style="border-radius: 24px 24px 18px 18px; padding-bottom: 8px;">
        <div class="bottom-sheet-header">
          <h3 class="bottom-sheet-title">Cerrar sesión</h3>
          <button class="bottom-sheet-close" data-logout-cancel="true" aria-label="Cerrar modal">&times;</button>
        </div>
        <div class="bottom-sheet-content" style="padding: 24px 20px 16px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <div style="background: #fee2e2; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #dc2626;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <div>
            <h4 style="margin: 0 0 6px; font-size: 16px; font-weight: 800; color: var(--ink);">¿Estás seguro de que deseas salir?</h4>
            <p style="margin: 0; font-size: 13.5px; color: var(--muted); line-height: 1.45;">Tu borrador y documentos guardados se mantendrán para tu próximo ingreso.</p>
          </div>
        </div>
        <div class="bottom-sheet-footer" style="padding: 12px 20px 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button class="btn secondary" data-logout-cancel="true" style="margin: 0;">Cancelar</button>
          <button class="btn" data-logout-confirm="true" style="margin: 0; background: #dc2626 !important; border-color: #dc2626 !important;">Cerrar sesión</button>
        </div>
      </div>
    </div>
  `;
}

function renderAccessibilityPanel() {
  const accessibility = state.accessibility || {};
  
  return `
    <aside class="accessibility-panel" role="dialog" aria-modal="true" aria-labelledby="accessibility-title">
      <div class="accessibility-panel-card">
        <div class="accessibility-header-row">
          <div class="accessibility-header-text">
            <h2 id="accessibility-title">Accesibilidad</h2>
            <p>Ajusta la visualización y navegación de la app.</p>
          </div>
          <button class="icon-btn accessibility-close" data-action="toggle-accessibility-panel" aria-label="Cerrar accesibilidad">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="accessibility-options-container">
          <div class="accessibility-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>Visual</span>
          </div>
          ${accessibilityToggle("highContrast", "Alto contraste", "Mejora la distinción de colores y bordes.", accessibility.highContrast)}
          ${accessibilityToggle("largeText", "Texto más grande", "Aumenta el tamaño del texto para mejorar la lectura.", accessibility.largeText)}
          ${accessibilityToggle("largeTargets", "Botones más grandes", "Facilita el toque en botones y controles.", accessibility.largeTargets)}

          <div class="accessibility-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <path d="M7 8h10M7 12h10M7 16h10"></path>
            </svg>
            <span>Movimiento</span>
          </div>
          ${accessibilityToggle("reducedMotion", "Reducir animaciones", "Disminuye el movimiento en transiciones y efectos visuales.", accessibility.reducedMotion)}

          <div class="accessibility-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 11V6a1 1 0 0 1 2 0v5m0-5a1 1 0 0 1 2 0v5m0-5a1 1 0 0 1 2 0v5m-8-2v6a5 5 0 0 0 10 0v-4"></path>
            </svg>
            <span>Navegación</span>
          </div>
          ${accessibilityToggle("focusVisible", "Resaltar foco visible", "Muestra claramente el elemento seleccionado al navegar.", accessibility.focusVisible)}
          ${accessibilityToggle("confirmActions", "Confirmar acciones importantes", "Pide confirmación antes de realizar acciones críticas.", accessibility.confirmActions)}
        </div>

        <div class="accessibility-footer-buttons">
          <button class="btn secondary" data-action="reset-accessibility">Restablecer</button>
          <button class="btn" data-action="apply-accessibility">Aplicar cambios</button>
        </div>

        <div class="accessibility-standards-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 11 11 13 15 9"></polyline>
          </svg>
          <span>Basado en criterios de accesibilidad WCAG 2.2</span>
        </div>
      </div>
    </aside>
  `;
}

function accessibilityToggle(key, label, description, enabled) {
  const icons = {
    highContrast: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    largeText: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>`,
    largeTargets: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect></svg>`,
    reducedMotion: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M7 8h10M7 12h10M7 16h10"/></svg>`,
    focusVisible: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/></svg>`,
    confirmActions: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
  };

  return `
    <button class="accessibility-toggle ${enabled ? "active" : ""}" data-action="toggle-accessibility-setting" data-setting="${key}" aria-pressed="${enabled ? "true" : "false"}">
      <div class="accessibility-toggle-left">
        <div class="accessibility-toggle-icon-bg">
          ${icons[key] || ""}
        </div>
        <div class="accessibility-toggle-text">
          <strong>${label}</strong>
          <small>${description}</small>
        </div>
      </div>
      <span class="toggle-switch" aria-hidden="true"></span>
    </button>
  `;
}
