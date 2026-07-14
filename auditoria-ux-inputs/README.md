# Auditoría UX — Inputs de domicilio

Sección de auditoría UX sobre la captura de **domicilio** en el registro/confirmación de datos (SIE — Correo Argentino / Mis Comunicaciones Digitales).

## Pantallas

| Archivo | Descripción |
|---|---|
| `index.html` | Landing de la sección (lista de pantallas). |
| `documento.html` | Documento navegable: 5 propuestas de captura de domicilio con validación interactiva + análisis comparativo y recomendación. |

## Alcance

Campos evaluados: **Calle · Altura · Piso · Departamento** (más Provincia/Localidad/CP en el alta completo). No se agregan campos fuera del requerimiento (torre, lote, manzana).

Cada propuesta tiene dos pestañas:
- **Confirmación de datos**: flujo nuevo enfocado solo en domicilio (Mis Comunicaciones Digitales).
- **Creación de cuenta**: alta de usuario completo (paso 2 de 2).

## Hallazgo principal

El riesgo no es el layout full-width, sino el *supporting text* de "Piso" que permite valores como **"1B"** (mezcla piso + departamento). Propuestas 2 y 3 lo resuelven con un **selector de Piso de lista cerrada** (PB y 1 a 20).

## Recomendación

- **UX fuerte:** Propuesta 2 (Calle+Altura agrupados, switch, Piso/Departamento separados).
- **Compromiso:** Propuesta 3 (full-width con Piso como selector de lista cerrada).

## Documentación / enlaces (completar)

- Jira: _(pendiente)_
- Reglas de validación: ver §5 del documento.
- Estado: _en revisión_
