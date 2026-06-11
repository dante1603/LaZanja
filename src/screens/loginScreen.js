import { statusbar } from "../components/chrome.js";

export function loginScreen(state) {
  const isExpanded = state && state.showLoginFields;
  return `<section class="device">
    <div class="screen dark">
      ${statusbar(true)}
      <section class="brand">
        <div class="brand-logo">
          <svg class="brand-logo-svg" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 42 L48 10 L68 28 L92 12 L110 42" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <!-- Left peak snow cap -->
            <path d="M38 18.5 L48 10 L54 15.5 L49 19.5 L45 16.5 L41 21 Z" fill="white" />
            <!-- Right peak snow cap -->
            <path d="M84 18.5 L92 12 L98 19 L94 21 L91 18 L88 22 Z" fill="white" />
          </svg>
        </div>
        <h1>La Zanja</h1>
        <p class="brand-subtitle">Sistema de Gestión<br/>Aduanera Digital</p>
        <div class="flag-divider">
          <span class="flag-blue"></span>
          <span class="flag-red"></span>
        </div>
        <p class="small cruce-text">Cruce digital Paso Los Libertadores</p>
      </section>
      <section class="login-panel ${isExpanded ? 'expanded' : ''}">
        <div class="panel-badge">
          <svg class="badge-icon" viewBox="0 0 64 64" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Ground line -->
            <line x1="8" y1="52" x2="56" y2="52" />
            <!-- Customs building / checkpoint booth -->
            <rect x="14" y="32" width="20" height="20" rx="2" />
            <!-- Window -->
            <rect x="19" y="37" width="10" height="6" rx="1" />
            <!-- Checkpoint roof (overhang) -->
            <path d="M10 32 L38 32 M12 32 L24 22 L36 32" />
            <!-- Flag pole and flag -->
            <line x1="48" y1="16" x2="48" y2="52" />
            <path d="M48 18 C52 18 50 24 56 24 L56 30 C50 30 52 24 48 24 Z" fill="rgba(255, 255, 255, 0.25)" />
            <!-- Barrier gate arm (raised) -->
            <path d="M34 44 L44 26" />
            <!-- Small light or detail on gate -->
            <circle cx="34" cy="44" r="2" fill="white" />
          </svg>
        </div>
        <h2>Prepara tu cruce antes<br/>de llegar a frontera</h2>
        <div class="inputs-container ${isExpanded ? 'expanded' : 'collapsed'}">
          <div class="inputs-container-inner">
            <div class="field">
              <label for="login-id">RUT o correo</label>
              <input id="login-id" value="viajero@lazanja.cl" autocomplete="username" />
            </div>
            <div class="field">
              <label for="login-password">Contraseña</label>
              <input id="login-password" value="password" type="password" autocomplete="current-password" />
            </div>
          </div>
        </div>
        <button class="btn btn-login" data-action="login-click">Iniciar sesión</button>
        <button class="btn btn-claveunica" data-go="home" aria-label="Entrar con ClaveÚnica">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 645.06 147.79">
            <path d="M572.62,85.49h-.4c-1.5,0-2.9.9-3.5,2.2h0s-.1.2-.2.5v-.1.1-.1c-.4.7-.9,1.6-1.2,2h0c-3,4.2-7.8,7-13.2,7-8.7,0-16.2-7.6-16.2-16.4,0-9.3,7.4-16.5,16.2-16.5,5.6,0,10.7,2.9,13.7,7.6.3.4.4.7.5.8-.1-.1-.1-.2-.1-.4.5,1.6,2,2.7,3.8,2.7h.2c2.2,0,4-1.8,4-4v-.1c0-.9-.3-1.8-.9-2.5-4.1-6.7-11.7-11.4-21-11.4-14.3,0-24.5,10.9-24.5,23.7s9.7,23.6,24.5,23.6c10.2,0,18.1-5.1,21.9-12.7h0c.3-.6.5-1.2.5-1.9v-.4c-.2-1.9-1.9-3.7-4.1-3.7Z" style="fill:#557ebf;"/>
            <path d="M634.82,80.89v-.3c0-12.6-10.1-23.4-24.2-23.4s-24.2,10.8-24.2,23.4,9.6,23.3,24.2,23.3c6.6,0,12.4-2.2,16.5-5.8v2.5h0c.1,2.1,1.7,3.8,3.8,3.8s3.8-1.7,3.8-3.8h0v-19.7h.1ZM610.72,96.69c-8.5,0-16-7.5-16-16.1,0-9.2,7.3-16.2,16-16.2s16,6.9,16,16.2c-.1,8.6-7.4,16.1-16,16.1Z" style="fill:#557ebf;"/>
            <path d="M518.12,60.99c0-2.1-1.7-3.8-3.8-3.8s-3.8,1.7-3.8,3.8v39.8h0c.1,2.1,1.7,3.8,3.8,3.8s3.8-1.7,3.8-3.8h0v-39.8h0Z" style="fill:#557ebf;"/>
            <path d="M497.82,78.49h0v-.8h0c-.4-11.2-9-20.5-22-20.5s-21.6,9.2-22,20.5h0v23.1c0,2.1,1.7,3.8,3.8,3.8s3.8-1.7,3.8-3.8v-22.3c0-7.8,6.7-14.7,14.5-14.7s14.5,6.9,14.5,14.7v22.3c0,2.1,1.7,3.8,3.8,3.8s3.8-1.7,3.8-3.8v-21.5l-.2-.8h0Z" style="fill:#557ebf;"/>
            <path d="M276.32,80.99c0-12.8-10.2-23.7-24.5-23.7s-24.5,10.9-24.5,23.7,9.7,23.6,24.5,23.6c6.7,0,12.5-2.2,16.7-5.9v2.5h0c.1,2.1,1.8,3.8,3.9,3.8s3.8-1.7,3.9-3.8h0v-20.2ZM251.82,97.29c-8.7,0-16.2-7.6-16.2-16.4,0-9.3,7.4-16.5,16.2-16.5s16.2,7,16.2,16.5c0,8.7-7.4,16.4-16.2,16.4Z" style="fill:#305baa;"/>
            <path d="M217.72,97.79h-2.3c-2.5,0-5-1.7-5-6.8v-46.3h0c-.1-2-1.8-3.7-3.9-3.7s-3.8,1.6-3.9,3.7h0v46.8c0,9.4,4.8,13.6,12,13.6h3.2c2,0,3.6-1.6,3.6-3.6-.1-2.1-1.7-3.7-3.7-3.7Z" style="fill:#305baa;"/>
            <path d="M327.62,57.29c-1.8-.9-4.1-.1-5,1.7l-16.9,34.3-17-34.3c-.9-1.8-3.1-2.6-5-1.7-1.8.9-2.6,3.1-1.7,5l20.4,41.1c.6,1.3,1.9,2.1,3.3,2.1h0c1.4,0,2.7-.8,3.3-2.1l20.2-41.1c1-1.9.2-4.1-1.6-5Z" style="fill:#305baa;"/>
            <path d="M360.82,56.89c-14.1,0-24.7,10.2-24.7,23.9s10.7,23.9,26.2,23.9c6.8,0,12.8-1.9,17.5-5.5.5-.4,1.7-1.5,1.7-2.8,0-2.2-2.2-4.3-4.3-4.3-1.2,0-1.7.2-2.4.7-3.5,2.4-7.3,4.7-12.2,4.7-8.1,0-15-4.1-16.7-11.3l-.6-2.4h34.5c3,0,5-1.9,5-4.7-.1-8.8-6.5-22.2-24-22.2ZM345.22,76.29c1.5-7.6,7.8-12.2,15.2-12.2s14.1,4.7,15.2,12.2h-30.4Z" style="fill:#305baa;"/>
            <path d="M417.12,43.49c-1.3,0-2.6-.7-3.3-2-.9-1.8-.2-4.1,1.6-5l21.7-11.3c1.8-.9,4.1-.2,5,1.6s.2,4.1-1.6,5l-21.7,11.3c-.5.3-1.1.4-1.7.4Z" style="fill:#557ebf;"/>
            <path d="M51.72,79.79c1.5,1.7,4,1.9,5.7.4s1.9-4,.4-5.7-4-1.9-5.7-.4c-1.7,1.3-1.9,4-.4,5.7Z" style="fill:#305baa;"/>
            <path d="M71.72,33.49c-1.9-.8-4,.2-4.8,2-.8,1.9.2,4,2,4.8,14.4,5.8,23.9,19.7,23.9,35.3,0,21-17.1,38.1-38.1,38.1s-38.1-17.1-38.1-38.1c0-15.4,9.1-29,23.2-35,1.9-.8,2.7-2.9,2-4.8-.8-1.9-2.9-2.7-4.8-2-16.9,7.1-27.7,23.5-27.7,41.8,0,25,20.4,45.4,45.4,45.4s45.4-20.4,45.4-45.4c0-18.6-11.2-35.2-28.4-42.1Z" style="fill:#305baa;"/>
            <path d="M31.52,76.99c0,12.9,10.4,23.3,23.3,23.3s23.3-10.4,23.3-23.3c0-11.6-8.6-21.4-19.9-23v-28.8h9.8c2,0,3.7-1.6,3.7-3.7s-1.6-3.7-3.7-3.7h-13.6c-2,0-3.7,1.6-3.7,3.7v32.6c-10.9,2-19.2,11.5-19.2,22.9ZM70.72,76.99c0,8.7-7.1,15.9-15.9,15.9s-15.9-7.1-15.9-15.9,7.1-15.9,15.9-15.9,15.9,7.2,15.9,15.9Z" style="fill:#305baa;"/>
            <path d="M160.32,106.69c-18.3,0-33.2-14.9-33.2-33.2s14.9-33.2,33.2-33.2c11.6,0,22.6,6.2,28.5,16.3,1,1.8.5,4-1.3,5.1-1.8,1-4,.5-5.1-1.3-4.6-7.7-13.2-12.7-22.2-12.7-14.3,0-25.8,11.5-25.8,25.8s11.5,25.8,25.8,25.8c10,0,19.2-5.8,23.4-15,.9-1.9,3.1-2.7,4.9-1.8,1.9.9,2.7,3.1,1.8,4.9-5.3,11.7-17.1,19.3-30,19.3Z" style="fill:#305baa;"/>
            <path d="M440.22,44.19c-2,0-3.7,1.7-3.7,3.7v34.5c0,9.2-7.5,16.9-16.9,16.9s-16.9-7.5-16.9-16.9v-34.5c0-2-1.7-3.7-3.7-3.7s-3.7,1.7-3.7,3.7v34.5c0,13.4,10.9,24.4,24.3,24.4s24.3-10.8,24.3-24.3v-34.6c0-2-1.6-3.7-3.7-3.7Z" style="fill:#557ebf;"/>
          </svg>
        </button>
        <div class="security-badge">
          <svg class="security-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 11l2 2 4-4" />
          </svg>
          <span>Tus datos están protegidos de acuerdo a la Ley N° 19.628</span>
        </div>
      </section>
    </div>
  </section>`;
}
