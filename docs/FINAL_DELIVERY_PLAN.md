# Plan de entrega final - La Grieta / La Zanja

Fecha de actualizacion: 23 de junio de 2026.

## 1. Conclusion ejecutiva

El repositorio contiene hoy un prototipo estatico mobile-first centrado en la app del viajero. El flujo permite navegar por login, inicio, registro de viaje, documentos, declaracion SAG, seguimiento, historial y QR. Esa base sirve para la entrega, pero todavia no representa el sistema completo descrito en el informe de arquitectura.

Con el informe original y el alcance aclarado para la entrega, la definicion correcta del prototipo terminado es:

- app del viajero navegable, con validaciones simples y estados coherentes;
- centro de control para funcionarios de Aduana/PDI/SAG, aunque sea simulado;
- accesibilidad visible y defendible en la app de usuarios;
- datos locales compartidos entre viajero y funcionario, sin backend real;
- guion de demostracion que conecte casos de uso, modelo 4+1 y pantallas.

No es necesario implementar autenticacion real, Clave Unica, Sistema Maria/Malvina, base de datos, notificaciones reales ni validacion documental compleja. Esas piezas deben mostrarse como simuladas o fuera de alcance para no prometer una arquitectura que el prototipo no implementa.

## 2. Fuente de alcance

El informe de arquitectura indica que el sistema "La Zanja" debe cubrir trece casos de uso:

- CU01 autenticar usuario;
- CU02 registrar viaje;
- CU03 cargar documentos digitales;
- CU04 generar QR / ID de viaje;
- CU05 consultar estado del tramite;
- CU06 consultar datos por QR / ID;
- CU07 validar vehiculo, documentos y requisitos;
- CU08 integrar validacion Argentina;
- CU09 registrar evento y trazabilidad;
- CU10 atender alertas de seguridad;
- CU11 aprobar / rechazar cruce;
- CU12 generar reportes estadisticos;
- CU13 gestionar usuarios y roles.

Para el prototipo academico, estos casos se cubren con simulacion local:

| Caso | Cobertura requerida en prototipo |
| --- | --- |
| CU01 | Login demo con seleccion de rol: viajero o funcionario. |
| CU02-CU05 | Flujo viajero actual, corregido con validaciones, estado y accesibilidad. |
| CU06-CU07 | Centro de control: busqueda por QR/ID y ficha de revision. |
| CU08 | Estado simulado de "validacion Argentina" dentro de la ficha. |
| CU09 | Timeline/log visible de eventos locales. |
| CU10-CU11 | Alertas, aprobar y rechazar desde el panel funcionario. |
| CU12 | Vista simple de estadisticas operativas. |
| CU13 | Gestion minima de roles como vista o modulo simulado, no administracion real. |

## 3. Estado actual comprobado

### Ya existe

- Aplicacion estatica con Vite y rutas hash.
- Vistas del viajero: login, inicio, viaje, documentos, SAG, seguimiento, historial y QR.
- Estado local centralizado en `src/state/appState.js`.
- Componentes reutilizables basicos para chrome, formularios, documentos, SAG, timeline y QR.
- Build estatico preparado para Vercel.

### Falta para considerar el prototipo completo

1. Centro de control para funcionarios.
2. Login o entrada por rol para separar viajero y funcionario.
3. Flujo de aprobacion/rechazo desde funcionario, no desde el propio viajero.
4. Consulta por QR/ID y ficha de tramite filtrada por rol.
5. Alertas y trazabilidad visibles.
6. Reportes estadisticos simples.
7. Funciones de accesibilidad en la app del viajero.
8. Validaciones simples antes de avanzar.
9. Persistencia local para que el tramite no se pierda al recargar.
10. QR estandar o al menos payload documentado y verificable.
11. README y guion de presentacion alineados con lo que el prototipo realmente hace.

## 4. Alcance final recomendado

### Viajero

Debe poder:

- iniciar sesion demo como viajero;
- registrar fecha, destino, patente, acompanantes y menores;
- cargar o simular carga de documentos requeridos;
- completar declaracion SAG;
- enviar el tramite a revision;
- consultar estado;
- ver QR solo cuando el funcionario aprueba;
- activar funciones de accesibilidad.

### Funcionario de control

Debe poder:

- entrar al centro de control desde login demo;
- ver bandeja de tramites pendientes, aprobados, rechazados y con alerta;
- buscar por ID o QR;
- abrir ficha de tramite;
- revisar viajero, vehiculo, documentos, SAG y validacion Argentina simulada;
- registrar observacion;
- aprobar o rechazar cruce;
- ver timeline de eventos;
- consultar estadisticas simples del dia.

### Supervisor / Admin TI

Para no agrandar el alcance, se recomienda cubrirlos como funciones simples dentro del mismo centro de control:

- Supervisor: vista de alertas y reportes.
- Admin TI: bloque visual de roles/permisos demo.

No conviene crear un modulo completo de administracion de usuarios si la entrega es un prototipo navegable.

## 5. Plan de construccion por cortes

Cada corte debe terminar con `npm run build` exitoso y una prueba manual rapida del flujo tocado.

### Corte 1 - Normalizar alcance, nombre y estado base

Objetivo: dejar el prototipo preparado para dos roles sin romper el flujo actual.

Tareas:

- Decidir texto visible definitivo: usar "La Zanja" en interfaz y README, dejando "La Grieta" solo como nombre de carpeta/repositorio si hace falta.
- Cambiar datos demo obsoletos, especialmente fechas 2025.
- Agregar `role`, `caseId`, `status`, `events`, `alerts` y `officerNotes` al estado local.
- Crear estados simples: `draft`, `submitted`, `under_review`, `approved`, `rejected`, `needs_fix`.
- Guardar estado en `localStorage`.
- Agregar reinicio de demo.

Aceptacion:

- al recargar se conserva el tramite;
- el estado visible del viajero sale del estado real, no de textos fijos;
- existe una forma clara de volver a datos demo iniciales.

### Corte 2 - Login demo por rol y navegacion protegida

Objetivo: separar la experiencia del viajero y del funcionario.

Tareas:

- En login, permitir elegir "Viajero" o "Funcionario".
- Crear rutas `home` para viajero y `control` para funcionario.
- Bloquear acceso directo a rutas internas si no hay sesion demo.
- Agregar cierre de sesion.
- Soportar `hashchange`, atras/adelante del navegador y rutas desconocidas.

Aceptacion:

- entrar como viajero abre el panel de viajero;
- entrar como funcionario abre el centro de control;
- una ruta interna sin sesion vuelve a login;
- atras/adelante no deja la app en una pantalla incoherente.

### Corte 3 - Flujo viajero completo y creible

Objetivo: que el flujo usuario sea defendible sin funcionalidad compleja.

Tareas:

- Validar campos obligatorios: fecha, destino, patente y acompanantes.
- Bloquear avance si falta informacion minima.
- Convertir carga documental decorativa en simulacion consistente: seleccionar, completar, reemplazar o eliminar.
- Calcular documentos requeridos segun menores, vehiculo y SAG.
- Agregar confirmacion de veracidad en declaracion SAG.
- Cambiar "simular aprobacion" por "enviar a revision".
- Mostrar estado `submitted` o `under_review` luego del envio.

Aceptacion:

- no se puede enviar un tramite incompleto;
- el viajero no puede aprobarse a si mismo;
- QR queda bloqueado hasta aprobacion de funcionario.

### Corte 4 - Centro de control funcionario

Objetivo: construir la pieza faltante principal del prototipo.

Pantallas minimas:

- `controlDashboard`: resumen de tramites, alertas y metricas del dia.
- `controlQueue`: bandeja/lista filtrable por estado.
- `controlCase`: ficha de tramite.
- `controlReports`: reportes simples.

Contenido de ficha:

- ID de tramite y estado;
- datos del viajero;
- datos del vehiculo;
- documentos y estados;
- declaracion SAG;
- validacion Argentina simulada;
- alertas;
- timeline de eventos;
- caja de observacion;
- botones aprobar, rechazar y solicitar correccion.

Aceptacion:

- el funcionario puede encontrar el tramite creado por el viajero;
- aprobar activa el QR del viajero;
- rechazar muestra motivo y bloquea QR;
- solicitar correccion devuelve el tramite a un estado corregible;
- cada accion agrega un evento al timeline.

### Corte 5 - Accesibilidad de la app del viajero

Objetivo: cumplir lo prometido en el informe sobre WCAG 2.0 de forma visible.

Funciones de accesibilidad requeridas:

- Panel o boton de accesibilidad persistente.
- Modo alto contraste.
- Aumento/disminucion de tamano de texto.
- Opcion de reducir animaciones/transiciones.
- Foco visible en todos los controles.
- Navegacion completa por teclado.
- Labels reales en formularios.
- `aria-label` o texto accesible en botones solo-icono.
- Mensajes de error asociados al campo.
- Alternativas textuales para imagenes importantes.

Tareas:

- Crear `accessibilitySettings` en estado local.
- Aplicar clases globales al contenedor principal: contraste, texto grande, movimiento reducido.
- Revisar botones, inputs, links, canvas QR y tarjetas clickeables.
- Agregar region de estado con `aria-live` para cambios importantes.
- Corregir contraste donde no cumpla lectura clara.

Aceptacion:

- el flujo principal se completa usando teclado;
- el usuario puede activar alto contraste y texto grande;
- los errores se leen cerca del campo y no dependen solo del color;
- no hay controles importantes sin nombre accesible.

### Corte 6 - QR, comprobante y trazabilidad

Objetivo: cerrar la historia entre app y centro de control.

Tareas:

- Definir payload del QR, por ejemplo `LAZANJA|caseId|status|plate|date`.
- Generar QR escaneable con una libreria pequena o documentar el payload si se mantiene canvas propio.
- Mostrar el mismo `caseId` en viajero, funcionario, historial y comprobante.
- Reemplazar TXT por vista imprimible o descarga simple mas presentable.
- Registrar eventos: creado, documentos cargados, enviado, revisado, aprobado/rechazado.

Aceptacion:

- el QR solo aparece aprobado;
- los datos del QR coinciden con la ficha del funcionario;
- el timeline explica que paso sin depender de backend.

### Corte 7 - Reportes, roles y cierre de presentacion

Objetivo: cubrir los casos CU12 y CU13 sin construir administracion real.

Tareas:

- Crear reporte simple: total de tramites, aprobados, rechazados, pendientes y alertas.
- Agregar filtros visuales por estado o servicio: Aduana, SAG, PDI.
- Agregar bloque de roles/permisos demo: Viajero, Funcionario, Supervisor, Admin TI.
- Documentar que es simulacion local para el prototipo.
- Actualizar README con instalacion, flujo de demo, alcance y limitaciones.
- Preparar guion de demostracion de 3 a 5 minutos.

Aceptacion:

- se puede presentar el sistema usando el informe 4+1 como respaldo;
- cada caso de uso CU01-CU13 tiene una pantalla, accion o simulacion visible;
- README no promete backend, integraciones reales ni seguridad productiva.

### Corte 8 - Verificacion final

Objetivo: cerrar con evidencia.

Tareas:

- Ejecutar `npm run build`.
- Probar manualmente 390x844, 430x920 y escritorio 1280x720.
- Probar flujo viajero completo.
- Probar flujo funcionario completo.
- Probar teclado, foco, alto contraste y texto grande.
- Revisar consola sin errores.
- Si se despliega, probar URL publica y no solo localhost.

Aceptacion:

- build exitoso;
- URL o localhost navegable sin errores visibles;
- guion de demo se puede completar sin editar datos desde consola.

## 6. Prioridad de implementacion

### P0 - Necesario para entregar

- Corte 1: estado base y persistencia.
- Corte 2: roles y navegacion.
- Corte 3: flujo viajero corregido.
- Corte 4: centro de control funcionario.
- Corte 5: accesibilidad viajero.
- Build final.

### P1 - Muy conveniente

- Corte 6: QR/payload, comprobante y trazabilidad completa.
- Corte 7: reportes y roles demo.
- README y guion de presentacion.

### P2 - Solo si sobra tiempo

- Pruebas automatizadas.
- QR con libreria externa.
- PDF real.
- Mejoras visuales finas.
- Simulacion mas detallada de Clave Unica o Sistema Maria/Malvina.

## 7. Mapa informe -> prototipo

| Vista del informe | Evidencia esperada en prototipo |
| --- | --- |
| Escenarios | Login por rol, flujo viajero, centro funcionario, reportes. |
| Logica | Estado local con tramite, documentos, vehiculo, alertas, eventos y roles. |
| Procesos | Enviar a revision, validar, aprobar/rechazar, corregir, generar QR. |
| Desarrollo | Modulos `screens`, `components`, `state`, `qr`, `utils`; agregar `control`. |
| Fisica | README explica prototipo estatico en navegador y despliegue Vercel. |
| Usabilidad | Flujo guiado, estados claros, errores comprensibles. |
| Accesibilidad | Alto contraste, texto grande, teclado, foco, labels y ARIA basico. |

## 8. Proximo paso recomendado

Empezar por el Corte 1 y Corte 2 juntos, porque crean la base tecnica para todo lo demas: estado persistente, roles y rutas. Despues construir el Corte 4 antes de pulir detalles, ya que el centro de control es la brecha principal frente al informe original.
