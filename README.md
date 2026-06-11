# La Grieta - prototipo app viajero

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
npm run dev
```

Luego abrir:

```text
http://localhost:4173
```

La app no incluye panel de funcionarios ni funciones internas. Todo el estado es local y simulado para testear el flujo de usuario.

## Probar build de Vercel

```powershell
npm run build
```

El build copia la app estatica a `dist/`, que es la carpeta que Vercel publica.

## Subir a Vercel desde GitHub

Este repositorio esta preparado como sitio estatico. No requiere base de datos, variables de entorno ni backend.

1. Subir el repositorio a GitHub.
2. En Vercel, elegir `Add New...` -> `Project`.
3. Importar el repositorio desde GitHub.
4. Dejar la configuracion asi:
   - Framework Preset: `Other`.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
   - Install Command: vacio o `npm install`.
5. Deploy.

La URL generada por Vercel se puede compartir directamente con el profesor. Como la navegacion usa hash routes (`#home`, `#qr`, etc.), no hace falta configurar rutas dinamicas ni funciones serverless.

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
