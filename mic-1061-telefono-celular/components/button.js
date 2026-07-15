/**
 * FormButton — botones MiCorreo (MIC-1061).
 * components/button.js + button.css
 *
 * Variantes actuales: primary (listo), secondary / tertiary (clases ya en estilos.css).
 * Próximo: disabled afinado + tamaños desde HTML de referencia.
 *
 *   FormButton.html({ id: 'btn-next-step', label: 'Siguiente', variant: 'primary' })
 *   FormButton.render('#mount', cfg)
 *   FormButton.setLoading('#btn-next-step', true)
 *   FormButton.setDisabled('#btn-next-step', true)
 */
(function (global) {
  'use strict';

  var VARIANT_CLASS = {
    primary: 'btn-correo-primary',
    secondary: 'btn-correo-secondary',
    tertiary: 'btn-correo-tertiary'
  };

  var SIZE_CLASS = {
    sm: 'mic-btn--sm',
    md: 'mic-btn--md',
    lg: 'mic-btn--lg'
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function resolveEl(ref) {
    if (!ref) return null;
    if (typeof ref !== 'string') return ref;
    return document.querySelector(ref) || document.getElementById(ref.replace(/^#/, ''));
  }

  function html(cfg) {
    cfg = cfg || {};
    var variant = cfg.variant || 'primary';
    var size = cfg.size || 'md';
    var variantCls = VARIANT_CLASS[variant] || VARIANT_CLASS.primary;
    var sizeCls = SIZE_CLASS[size] || SIZE_CLASS.md;
    var extra = cfg.className ? ' ' + cfg.className : '';
    var idAttr = cfg.id ? ' id="' + esc(cfg.id) + '"' : '';
    var type = cfg.type || 'button';
    var label = cfg.label != null ? cfg.label : 'Continuar';
    var spinner = cfg.spinner !== false;
    var disabled = !!cfg.disabled;
    var loading = !!cfg.loading;

    var classes = ['btn', 'mic-btn', variantCls, sizeCls];
    if (extra) classes.push(extra.trim());

    var out = '<button' + idAttr +
      ' type="' + esc(type) + '"' +
      ' class="' + esc(classes.join(' ')) + '"' +
      (cfg.tabindex != null ? ' tabindex="' + esc(cfg.tabindex) + '"' : '') +
      (disabled || loading ? ' disabled' : '') +
      (cfg.ariaLabel ? ' aria-label="' + esc(cfg.ariaLabel) + '"' : '') +
      (cfg.onclick ? ' onclick="' + esc(cfg.onclick) + '"' : '') +
      '>';
    out += esc(label);
    if (spinner) {
      out += ' <span class="loading-spinner spinner-border spinner-border-sm" role="status" aria-hidden="true"' +
        (loading ? '' : ' hidden') + '></span>';
    }
    out += '</button>';
    return out;
  }

  function render(target, cfg) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) throw new Error('FormButton.render: no se encontró el contenedor');
    el.innerHTML = html(cfg);
    return el.querySelector('button') || el;
  }

  function setLoading(ref, on) {
    var btn = resolveEl(ref);
    if (!btn) return;
    var spinner = btn.querySelector('.loading-spinner');
    if (on) {
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      if (spinner) spinner.removeAttribute('hidden');
    } else {
      btn.removeAttribute('aria-busy');
      if (spinner) spinner.setAttribute('hidden', 'hidden');
      if (!btn.hasAttribute('data-mic-disabled')) btn.disabled = false;
    }
  }

  function setDisabled(ref, on) {
    var btn = resolveEl(ref);
    if (!btn) return;
    if (on) {
      btn.disabled = true;
      btn.setAttribute('data-mic-disabled', 'true');
    } else {
      btn.removeAttribute('data-mic-disabled');
      if (btn.getAttribute('aria-busy') !== 'true') btn.disabled = false;
    }
  }

  global.FormButton = {
    html: html,
    render: render,
    setLoading: setLoading,
    setDisabled: setDisabled,
    variants: Object.keys(VARIANT_CLASS),
    sizes: Object.keys(SIZE_CLASS)
  };
})(window);
