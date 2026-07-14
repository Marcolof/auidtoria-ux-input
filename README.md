# UX TEST

Sitio estático (multi-página) que agrupa distintas **tareas de UX / auditorías** de SIE — Correo Argentino. Cada tarea es una sección independiente, con su propio HTML y sus propios estilos, para no compartir todo el código en un único archivo.

- **Deploy:** Vercel → https://vercel.com/marcos-projects-c934fa75/auidtoria-ux-input (auto-deploy en cada push a `main`)
- **Repo:** https://github.com/Marcolof/auidtoria-ux-input
- **Stack:** HTML + CSS + JS vanilla, sin build. Fuente **Gilroy**.

## Estructura

```
/index.html                       Home "UX TEST" (buscador + listado de tareas)
/screen.html                      Pantalla genérica vacía (placeholder de sub-secciones)
/assets/app.css                   Estilos COMPARTIDOS del shell (home/landings/screen) + @font-face
/Font/                            Tipografía Gilroy (.ttf usados; .otf ignorados en .gitignore)
/auditoria-ux-inputs/             Sección: Auditoría UX de inputs de domicilio
    index.html                    Landing (lista de pantallas de la sección)
    documento.html                Documento de auditoría (propuestas + análisis)
    README.md                     Documentación de la sección
/mic-1061-telefono-celular/       Sección: MIC-1061 validaciones de teléfono celular
    index.html                    Landing (lista de sub-pantallas)
    README.md                     Documentación de la sección
```

## Convención de estilos

- **Compartido** (`/assets/app.css`): reset, `@font-face` Gilroy, tokens `--ux-*` y el shell (Home, landings, cards, back). Todo namespaceado bajo `.ux-*` y `body.ux-shell`.
- **Propio de cada sección**: cada sección trae su `<style>` (o CSS propio). Ej.: `auditoria-ux-inputs/documento.html` mantiene todo su CSS inline; no se filtra a las demás páginas.

## Navegación

`Home → Landing de sección → Pantalla`. Cada pantalla/landing tiene un **back** que vuelve un nivel hacia atrás.

## Cómo agregar una sección nueva

1. Crear carpeta `/<slug-seccion>/` con un `index.html` (landing) que enlace `../assets/app.css` y use `body.ux-shell`.
2. Agregar la card correspondiente en `/index.html` (con `data-name` para el buscador).
3. Crear `/<slug-seccion>/README.md` con la documentación de la sección.

## Correr local

Es estático: abrir `index.html` en el navegador, o servir la carpeta (`npx serve .`).
