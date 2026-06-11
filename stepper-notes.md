# Documentación y Notas de Diseño: Componente Stepper

Este documento detalla el comportamiento del componente `stepper` dentro de la aplicación **La Zanja** y las observaciones sobre su impacto en la experiencia de usuario (UX).

---

## 1. Definición Técnica del Componente

El componente `stepper` está implementado como una función pura en [chrome.js](file:///c:/Users/GLADIS/Documents/LaGrieta/src/components/chrome.js).

### Firma de la Función
```javascript
export function stepper(items, active)
```

- **`items` (Array de strings):** Los nombres de los pasos visibles. Actualmente estandarizado en:
  `["Viaje", "Documentos", "Declaración SAG", "Seguimiento"]`
- **`active` (Integer, 1-indexed):** El paso actual en el que se encuentra el usuario.

### Renderizado HTML/CSS
- Genera un contenedor `.stepper` con columnas calculadas dinámicamente (`--steps: items.length`).
- Los pasos completados (`index + 1 < active`) se renderizan con la clase `.complete` (check verde).
- El paso activo (`index + 1 === active`) se renderiza con la clase `.active` (indicador azul).
- Los pasos futuros se renderizan por defecto (color gris).

---

## 2. Observación de UX: El Salto Visual del Stepper (Scroll Jumping)

### El Problema
Al navegar por las pantallas del asistente (wizard):
1. Si una pantalla es larga y el usuario hace **scroll hacia abajo**, el stepper (ubicado al principio de la página) se oculta fuera del área visible del viewport.
2. Al presionar "Continuar", la aplicación carga la siguiente pantalla y el navegador realiza un salto visual repentino hacia arriba para mostrar el inicio de la nueva pantalla (haciendo aparecer el stepper nuevamente).
3. Este comportamiento genera la sensación de que la cabecera e indicadores "saltan" o desaparecen y reaparecen bruscamente, interrumpiendo la fluidez de la transición.

### Caminos Alternativos de Solución

Para la versión final del componente, se proponen dos soluciones de diseño:

### Camino A: Cabecera Fija / Stepper Sticky (Desacoplado)
*   **Concepto:** Desacoplar el componente de la información de la página. El stepper (y posiblemente la barra superior) se mantendrá estático y visible en la parte superior de la pantalla, sin importar cuánto haga scroll el usuario en el contenido del formulario.
*   **Implementación:** Usar `position: sticky; top: var(--topbar-height);` en CSS, o estructurar la app de modo que el layout de la pantalla tenga un contenedor scrollable para el formulario (`.sheet` o `.content`) mientras que el stepper permanece fijo en el marco de la página (`appFrame`).

### Camino B: Diseño Sin Scroll (Mobile Viewport Lock)
*   **Concepto:** Rediseñar las pantallas para evitar deliberadamente el scroll. Cada paso del asistente se diseñará para caber exactamente dentro de la altura de un dispositivo móvil estándar (`430x920`), eliminando la necesidad de scroll vertical en el formulario.
*   **Implementación:** Optimizar los espaciados, usar layouts flexibles y recortar elementos visuales secundarios para asegurar que toda la interfaz quepa de forma compacta en una sola pantalla.

---

## 3. Próximos Pasos para el Stepper
1. Analizar cuál de los dos caminos (A o B) se alinea mejor con la estética general y la densidad de información.
2. Implementar la solución elegida en la tarea de **Versión Final del Stepper** para estabilizar su comportamiento visual durante el scroll.
