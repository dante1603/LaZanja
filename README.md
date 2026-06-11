# La Zanja - prototipo app viajero

Prototipo funcional mobile-first para probar en navegador el flujo del viajero:

1. Inicio de sesión.
2. Panel del viajero.
3. Registro de viaje.
4. Subida de documentos.
5. Declaración SAG.
6. Seguimiento del trámite.
7. QR de cruce.

## Ejecutar en localhost

```powershell
node server.js
```

Luego abrir:

```text
http://localhost:4173
```

La app no incluye panel de funcionarios ni funciones internas. Todo el estado es local y simulado para testear el flujo de usuario.

## Estructura del prototipo

El codigo de la app esta separado por responsabilidad:

- `app.js`: punto de entrada minimo.
- `src/router.js`: renderizado de ventanas y eventos `data-*`.
- `src/state/appState.js`: estado local simulado.
- `src/screens/`: ventanas principales del flujo mobile.
- `src/components/`: piezas reutilizables de interfaz.
- `src/qr/drawQr.js`: dibujo del comprobante QR.
- `src/utils/`: helpers compartidos.

Para agregar una nueva ventana, crear un archivo en `src/screens/`, registrarlo en `src/router.js` y navegar con `data-go="nombre"`.
