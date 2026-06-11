export function statusbar(dark = false) {
  return ``;
}

export function topbar(title, options = {}) {
  const { back = true, menu = false, bell = false } = options;
  
  if (!back && menu && bell) {
    return `
      <header class="topbar home-topbar">
        <div class="topbar-row">
          <h1 class="topbar-title">${title}</h1>
          <button class="icon-btn bell" data-go="detail" aria-label="Notificaciones">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
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
        ${bell ? `
          <button class="icon-btn bell" data-go="detail" aria-label="Notificaciones">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>` : `<span style="width:36px"></span>`}
      </div>
    </header>`;
}

export function stepper(items, active) {
  const stepDetails = [
    { title: "Datos del viaje", desc: "Información básica del cruce" },
    { title: "Documentos", desc: "Archivos requeridos" },
    { title: "Declaración SAG", desc: "Control fitosanitario" },
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
    ["detail", "Trámite"],
    ["history", "Trámites"],
    ["qr", "Mi QR"],
  ];
  
  const navIcons = {
    home: (active) => active 
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    detail: (active) => active
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
      const active = currentScreen === screen;
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
  return `
    <section class="device">
      <div class="screen ${isHome ? "gradient-bg" : ""}">
        ${statusbar(false)}
        ${inner}
        ${nav ? bottomNav(currentScreen) : ""}
      </div>
    </section>`;
}

