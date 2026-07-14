# MIC-1061 — Validaciones de los campos de teléfono celular

Sección en desarrollo. Requerimiento de validación de los campos de **teléfono celular** (SIE — Correo Argentino).

## Pantallas / sub-tareas

| Card | Estado | Pantalla |
|---|---|---|
| MIC-003 - Registro 1.1 | En construcción | `../screen.html#MIC-003-Registro 1.1` |
| MIC - 009 - Direcciones 1.4 | En construcción | `../screen.html#...` |
| MIC - 005 - Nuevo envío 1.2 | En construcción | `../screen.html#...` |
| FFM010 - Turnos 1.1 | En construcción | `../screen.html#...` |

> Por ahora cada sub-card lleva a una **pantalla vacía** (`/screen.html`) con el título de la sección. A medida que se desarrolle cada una, se reemplaza por su propia carpeta/HTML.

## Documentación / enlaces (completar)

- Jira: _(pendiente — links de tareas MIC-003 / MIC-009 / MIC-005 / FFM010)_
- Reglas de validación de celular: _(pendiente)_
- Estados: _pendiente / en construcción_

## Cómo desarrollar una sub-pantalla

1. Crear carpeta `/mic-1061-telefono-celular/<slug>/` con su `index.html` (enlazar `../../assets/app.css`, `body.ux-shell`).
2. Reemplazar el enlace de la card en `index.html` para que apunte a esa carpeta en vez de a `screen.html`.
