/**
 * FormSelect — select flotante MiCorreo (MIC-1061).
 * components/select.js
 *
 *   FormSelect.html({ id: 'rubro', label: 'Rubro', options: [{ value:'1', label:'DNI' }] })
 *   FormSelect.render('#mount', cfg)
 */
(function (global) {
  'use strict';

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
    if (!id) throw new Error('FormSelect: falta id');
    var name = cfg.name || id;
    var placeholder = cfg.placeholder != null ? cfg.placeholder : 'Seleccione';
    var opts = cfg.options || [];
    var out = '<div class="form-group form-floating">';
    out += '<select class="form-select' + (cfg.className ? ' ' + esc(cfg.className) : '') + '"' +
      ' id="' + esc(id) + '" name="' + esc(name) + '"' +
      attrs({
        tabindex: cfg.tabindex,
        required: !!cfg.required,
        disabled: !!cfg.disabled,
        'data-checkfield': cfg.checkField === false ? 'false' : (cfg.checkField !== false ? 'true' : null),
        onchange: cfg.onchange
      }) + '>';
    out += '<option value=""' + (!cfg.value ? ' selected' : '') + '>' + esc(placeholder) + '</option>';
    opts.forEach(function (o) {
      var val = typeof o === 'string' ? o : o.value;
      var text = typeof o === 'string' ? o : (o.label != null ? o.label : o.text);
      var desc = typeof o === 'object' && o.desc != null ? o.desc : text;
      var sel = String(cfg.value) === String(val) ? ' selected' : '';
      out += '<option value="' + esc(val) + '" data-desc="' + esc(desc) + '"' + sel + '>' + esc(text) + '</option>';
    });
    out += '</select>';
    out += '<label for="' + esc(id) + '" class="label-register">' + (cfg.label || '') + '</label>';
    if (cfg.hiddenId) {
      out += '<input type="hidden" id="' + esc(cfg.hiddenId) + '" name="' + esc(cfg.hiddenName || cfg.hiddenId) + '" value="' + esc(cfg.hiddenValue || '') + '">';
    }
    out += '</div>';
    return out;
  }

  function render(target, cfg) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) throw new Error('FormSelect.render: no se encontró el contenedor');
    el.innerHTML = html(cfg);
    return el;
  }

  global.FormSelect = { html: html, render: render };
})(window);
