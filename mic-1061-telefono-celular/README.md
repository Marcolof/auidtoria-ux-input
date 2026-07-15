# MIC-1061 — Validaciones de los campos de teléfono celular

Sección de MiCorreo (Correo Argentino). Estandarización del comportamiento de los campos **Código de área** y **Celular** en todas las pantallas donde se carga o edita un teléfono.

- **Tarea Jira:** https://correoarg.atlassian.net/browse/MIC-1061
- **Documentación funcional:** `MIC-1061_documentacion_validaciones_telefono.docx` (en esta carpeta; queda solo en local)

## Pantallas / sub-tareas

| Card | Estado | Pantalla |
|---|---|---|
| MIC-003 - Registro 1.1 | En desarrollo (validación celular) | `mic-003-registro/` |
| MIC - 009 - Direcciones 1.4 | En construcción | `../screen.html#...` |
| MIC - 005 - Nuevo envío 1.2 | En construcción | `../screen.html#...` |
| FFM010 - Turnos 1.1 | En construcción | `../screen.html#...` |

## Reglas de validación (confirmadas)

Los dos campos (**Código de área** + **Celular**) deben conformar un número de **exactamente 10 dígitos**.

### Código de área
- Solo caracteres numéricos.
- Entre **2 y 4 dígitos**.
- El primer dígito **no puede ser 0** (el 0 se permite desde la 2ª posición).

### Celular
- Solo caracteres numéricos.
- **Mínimo 6 dígitos**.
- Máximo **dinámico** = `10 − (dígitos del código de área)` → área 2 → cel 8; 3 → 7; 4 → 6.
- La secuencia **"15" se permite** en cualquier posición (no debe bloquearse).

### Longitud conjunta
- `código de área + celular = 10` dígitos exactos.

## Momento de validación

- **No** se muestran mensajes de error en tiempo real. Solo al ejecutar la acción del flujo (**Siguiente / Guardar / Confirmar / Continuar / Finalizar**).
- Las restricciones de ingreso (solo números, maxlength) sí aplican durante la escritura.

## Jerarquía de validación (2 niveles)

1. **Individual:** se valida cada campo por separado. Si alguno falla, se muestran únicamente sus mensajes individuales (todavía no el de longitud total).
2. **Conjunta:** solo cuando ambos cumplen individualmente, se verifica que la suma sea exactamente 10. Si no lo es, se muestra el mensaje conjunto.

## Mensajes de error

| Condición | Mensaje |
|---|---|
| Código de área inválido | El código de área debe tener entre 2 y 4 dígitos y no comenzar con 0. |
| Celular inválido | El número de celular debe tener entre 6 y 8 dígitos. |
| Ambos válidos individualmente, total ≠ 10 | El código de área y el número de celular deben sumar exactamente 10 dígitos. |

Presentación: banner rojo con uno o varios mensajes (cada uno en su línea) + los campos afectados marcados en rojo. Para el error de longitud total se marcan **ambos** campos.

## Labels

- En prototipo: **Cód. Área (sin 0 inicial)** · **Celular (sin prefijo 15)**.

## Matriz de casos (extracto del doc)

| Área | Celular | Resultado esperado |
|---|---|---|
| 1 | 1 | Dos errores individuales |
| 0351 | 123456 | Error de área (0 inicial) |
| 351 | 12345 | Error individual de celular |
| 351 | 123456 | Error conjunto (suman 9) |
| 11 | 12345678 | Válido |
| 351 | 1234567 | Válido |
| 2302 | 151234 | Válido (secuencia 15 permitida) |
| 3510 | 123456 | Válido |

## Pendientes de confirmación funcional

- Qué sucede si se cambia el código de área luego de cargar un celular de 8 dígitos.
- No recortar/borrar caracteres silenciosamente (recomendación UX).
- Máximo del celular con área vacía o incompleta (criterio preventivo: 8).
- Microcopy final (labels y los tres mensajes) a validar con el cliente.

## Kit de componentes MIC-1061

```
mic-1061-telefono-celular/
  components/
    select.js         FormSelect
    password.js       FormPassword (+ ojito)
    button.js         FormButton (primary listo; secondary/tertiary cableados)
    button.css        tamaños sm/md/lg (md = producción; sm/lg por afinar)
    form-fields.js    orquestador (text, phone, select, password, button)
    form-fields.css   errores + addon password
  assets/             vendor MiCorreo (estilos-inputs, bootstrap…)
  mic-003-registro/   consume ../components/
```

### APIs sueltas

```js
FormSelect.render('#mount', { id: 'rubro', label: 'Rubro', options: [...] });
FormPassword.render('#mount', { id: 'pass', label: 'Contraseña' });
FormButton.render('#mount', { id: 'btn-ok', label: 'Siguiente', variant: 'primary', size: 'md' });
FormButton.setDisabled('#btn-ok', true);
FormButton.setLoading('#btn-ok', true);
```

Variantes de botón: `primary` | `secondary` | `tertiary` (colores en `assets/estilos.css`).  
Tamaños: `sm` | `md` | `lg` — `md` es el actual; `sm`/`lg` y disabled fino se calibran con el próximo HTML de referencia.

### Orquestador

```html
<link rel="stylesheet" href="../assets/estilos-inputs.css"/>
<link rel="stylesheet" href="../components/form-fields.css"/>
<link rel="stylesheet" href="../components/button.css"/>
<script src="../components/select.js"></script>
<script src="../components/password.js"></script>
<script src="../components/button.js"></script>
<script src="../components/form-fields.js"></script>
<script>
  FormFields.render('#campos', [
    { type: 'phone' },
    { type: 'select', id: 'doc_type', label: 'Tipo', options: [{ value: '1', label: 'DNI' }] },
    { type: 'password', id: 'pass', label: 'Contraseña' }
  ]);
  FormButton.render('#acciones', { id: 'btn-guardar', label: 'Guardar', variant: 'primary' });
  FormFields.bindPhone({ trigger: '#btn-guardar', banner: '#errores' });
</script>
```

## Estado de implementación

- **mic-003-registro**: paso 1 vía `FormFields` + `FormButton` primario + validación celular al **"Siguiente"**.

## Cómo desarrollar una sub-pantalla

1. Crear carpeta `/mic-1061-telefono-celular/<slug>/` con su `index.html`.
2. Enlazar `../assets/...`, `../assets/estilos-inputs.css` y los `../components/*` que uses.
3. Montar con `FormSelect` / `FormPassword` / `FormButton` / `FormFields` + `bindPhone` si hay teléfono.
4. Actualizar la card en el `index.html` de la sección.
