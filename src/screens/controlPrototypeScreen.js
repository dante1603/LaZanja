import { appFrame, frameOptions, topbar } from "../components/chrome.js";

function serviceStatus(name, isOnline = true) {
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1.5px solid rgba(167, 184, 212, 0.2); font-size: 13px;">
      <span style="font-weight: 750; color: var(--ink);">${name}</span>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span class="pulse-dot green" style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: var(--teal-500); box-shadow: 0 0 0 2px var(--teal-100);"></span>
        <span class="muted" style="font-size: 11.5px; font-weight: 800;">${isOnline ? "Conectado" : "Offline"}</span>
      </div>
    </div>
  `;
}

function roleCard(title, description, isActive, switchRole = null) {
  return `
    <div class="role-switcher-card ${isActive ? "active" : ""}" style="border: 1px solid ${isActive ? "var(--blue-500)" : "var(--line)"}; background: ${isActive ? "var(--blue-50)" : "#ffffff"}; padding: 14px; border-radius: 12px; display: grid; gap: 8px; transition: all 0.2s;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong style="font-size: 14px; color: ${isActive ? "var(--blue-900)" : "var(--ink)"}; font-weight: 800;">${title}</strong>
        ${isActive ? `<span class="badge success" style="font-size: 10px; padding: 2px 6px;">Activo</span>` : ""}
      </div>
      <p class="muted" style="margin: 0; font-size: 12px; line-height: 1.45; color: ${isActive ? "var(--blue-700)" : "var(--muted)"};">${description}</p>
      ${!isActive && switchRole ? `
        <button class="btn secondary compact" data-action="change-role-switch" data-role="${switchRole}" style="margin: 6px 0 0 0; font-size: 11.5px; padding: 6px 12px; width: fit-content; border-color: var(--line);">
          Cambiar a este rol
        </button>
      ` : ""}
    </div>
  `;
}

export function controlPrototypeScreen(state) {
  return appFrame(`
    ${topbar("Panel del Prototipo", { backTo: "control", role: state.role })}
    <section class="content stack control-space">
      
      <article class="card summary-card">
        <h2 style="margin:0 0 4px; font-size: 15px; font-weight: 800; color: var(--ink);">Entorno del Prototipo</h2>
        <p class="muted" style="margin: 0; font-size: 12.5px; line-height: 1.4;">Este panel permite configurar e interactuar con los componentes simulados del Paso Los Libertadores.</p>
      </article>

      <article class="card soft" style="display: grid; gap: 10px; padding: 16px;">
        <strong style="font-size: 14px; font-weight: 800; color: var(--ink);">Servicios Simulados (API)</strong>
        <div style="border: 1px solid var(--line); border-radius: 10px; overflow: hidden; background: #ffffff;">
          ${serviceStatus("Servicio Nacional de Aduanas", true)}
          ${serviceStatus("SAG (Agrícola y Ganadero)", true)}
          ${serviceStatus("PDI (Policía de Investigaciones)", true)}
          ${serviceStatus("Gendarmería Nacional Argentina", true)}
        </div>
        <p class="muted" style="font-size: 11.5px; margin: 4px 0 0; line-height: 1.4;">Las integraciones se ejecutan de forma local en tiempo real para validar y autorizar los cruces.</p>
      </article>

      <article class="card soft" style="display: grid; gap: 12px;">
        <strong style="font-size: 14px; font-weight: 800; color: var(--ink);">Roles y Vistas Disponibles</strong>
        <div style="display: grid; gap: 10px;">
          ${roleCard(
            "Viajero (Usuario Final)", 
            "Crea y consulta trámites, sube documentos (Padrón, Seguro), declara SAG y genera el código QR para el cruce.",
            state.role !== "officer",
            "traveler"
          )}
          ${roleCard(
            "Funcionario (Control de Frontera)", 
            "Visualiza trámites pendientes, administra la bandeja de control prioritario y decide sobre el cruce (Aprobación/Rechazo/Corrección).",
            state.role === "officer",
            "officer"
          )}
          ${roleCard(
            "Supervisor (Jefatura)", 
            "Vigila métricas consolidadas del turno, controla alertas y realiza exportaciones de reportes de fiscalización.",
            false,
            null
          )}
        </div>
      </article>

      <article class="card soft" style="display: grid; gap: 10px; border-color: rgba(220, 38, 38, 0.15); background: rgba(254, 242, 242, 0.3);">
        <strong style="font-size: 13.5px; font-weight: 800; color: #b91c1c;">Mantenimiento y Muestreo</strong>
        <p class="muted" style="font-size: 12px; margin: 0; line-height: 1.45;">Restablece todo el almacenamiento local al estado predeterminado de demostración para volver a realizar el flujo de prueba.</p>
        <button class="btn danger" data-reset-demo="true" style="margin: 6px 0 0 0; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
          <span>Reiniciar base de datos demo</span>
        </button>
      </article>

    </section>
  `, state.screen, frameOptions(state, false));
}
