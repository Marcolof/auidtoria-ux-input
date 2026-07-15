/**
 * FormPassword — input contraseña + toggle ojo Lucide (MIC-1061).
 * components/password.js + form-fields.css (estilos del addon)
 *
 *   FormPassword.html({ id: 'password_register', label: 'Contraseña' })
 *   FormPassword.toggle('password_register', btnEl)
 */
(function (global) {
  'use strict';

  var EYE = '<svg class="icon-eye" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>';
  var EYE_OFF = '<svg class="icon-eye-off d-none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-4.884"/><path d="m2 2 20 20"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function attrs(map) {
    var out = '';
    Object.keys(map).forEach(function (k) {
      var v = map[k];
      if (v === false || v == null || v === '') return;
      if (v === true) { out += ' ' + k; return; }
      out += ' ' + k + '="' + esc(v) + '"';
    });
    return out;
  }

  function html(cfg) {
    cfg = cfg || {};
    var id = cfg.id;
    if (!id) throw new Error('FormPassword: falta id');
    var name = cfg.name || id;
    var btnId = cfg.buttonId || (id + '_button');
    return (
      '<div class="form-group form-floating input-group">' +
        '<input style="z-index:1" id="' + esc(id) + '" type="password" class="form-control border-end-0 password-field' +
          (cfg.className ? ' ' + esc(cfg.className) : '') + '"' +
          attrs({
            name: name,
            value: cfg.value || '',
            maxlength: cfg.maxLength || 20,
            required: cfg.required !== false,
            disabled: !!cfg.disabled,
            tabindex: cfg.tabindex,
            placeholder: cfg.placeholder || cfg.label || '',
            'data-checkfield': cfg.checkField === false ? 'false' : 'true'
          }) +
        '>' +
        '<label for="' + esc(id) + '" class="label-register">' + (cfg.label || 'Contraseña') + '</label>' +
        '<button class="btn btn-outline-secondary btn-addon-password border-start-0" type="button" id="' + esc(btnId) + '"' +
          ' style="border-top-right-radius:var(--bs-border-radius);border-bottom-right-radius:var(--bs-border-radius)"' +
          ' onclick="FormPassword.toggle(\'' + esc(id) + '\', this)" aria-label="Mostrar u ocultar contraseña"' +
          (cfg.disabled ? ' disabled' : '') + '>' +
          EYE + EYE_OFF +
        '</button>' +
      '</div>'
    );
  }

  function toggle(id, btn) {
    var input = document.getElementById(id);
    if (!input) return;
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    if (!btn) return;
    var eye = btn.querySelector('.icon-eye');
    var eyeOff = btn.querySelector('.icon-eye-off');
    if (eye) eye.classList.toggle('d-none', show);
    if (eyeOff) eyeOff.classList.toggle('d-none', !show);
  }

  function render(target, cfg) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) throw new Error('FormPassword.render: no se encontró el contenedor');
    el.innerHTML = html(cfg);
    return el;
  }

  global.FormPassword = { html: html, render: render, toggle: toggle };
})(window);
