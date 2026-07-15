/**
 * FormFields — orquestador de campos MiCorreo para MIC-1061.
 * Ubicación: mic-1061-telefono-celular/components/
 *
 * Dependencias (cargar antes):
 *   select.js → FormSelect
 *   password.js → FormPassword
 *   button.js → FormButton (si usás type:'button')
 *
 * Uso típico:
 *   FormFields.render('#mount', [
 *     { row: [
 *       { type: 'text', col: 'md-6', id: 'name', label: 'Nombre', maxLength: 30 },
 *       { type: 'select', col: 'md-6', id: 'rubro', label: 'Rubro', options: [...] },
 *     ]},
 *     { type: 'phone' },
 *     { type: 'password', col: 'md-6', id: 'password_register', label: 'Contraseña' },
 *   ]);
 *   FormFields.bindPhone({ trigger: '#btn-next-step', banner: '#errores' });
 */
(function (global) {
  'use strict';

  var PHONE_MSG = {
    area: 'El código de área debe tener entre 2 y 4 dígitos y no comenzar con 0.',
    cel: 'El número de celular debe tener entre 6 y 8 dígitos.',
    joint: 'El código de área y el número de celular deben sumar exactamente 10 dígitos.'
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function colClass(col) {
    if (!col) return 'col mb-2';
    if (String(col).indexOf('col') === 0) return col + (/\bmb-/.test(col) ? '' : ' mb-2');
    return 'col-' + col + ' mb-2';
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

  function wrapCol(col, inner) {
    return '<div class="' + colClass(col) + '">' + inner + '</div>';
  }

  function textField(cfg) {
    var id = cfg.id;
    var name = cfg.name || id;
    var label = cfg.label || '';
    var placeholder = cfg.placeholder != null ? cfg.placeholder : label.replace(/<[^>]+>/g, '');
    var labelStyle = cfg.labelStyle ? ' style="' + esc(cfg.labelStyle) + '"' : '';
    var extraClass = cfg.className ? ' ' + cfg.className : '';
    return (
      '<div class="form-group form-floating">' +
        '<input id="' + esc(id) + '" type="' + esc(cfg.inputType || 'text') + '" class="form-control' + esc(extraClass) + '"' +
          attrs({
            name: name,
            value: cfg.value || '',
            maxlength: cfg.maxLength,
            minlength: cfg.minLength,
            required: !!cfg.required,
            tabindex: cfg.tabindex,
            placeholder: placeholder,
            pattern: cfg.pattern,
            'inputmode': cfg.inputMode,
            'data-validation': cfg.validation,
            'data-checkfield': cfg.checkField === false ? 'false' : (cfg.checkField ? 'true' : null)
          }) +
        '>' +
        '<label for="' + esc(id) + '" class="label-register"' + labelStyle + '>' + label + '</label>' +
      '</div>'
    );
  }

  function selectField(cfg) {
    if (!global.FormSelect) throw new Error('FormFields: falta components/select.js');
    return global.FormSelect.html(cfg);
  }

  function passwordField(cfg) {
    if (!global.FormPassword) throw new Error('FormFields: falta components/password.js');
    return global.FormPassword.html(cfg);
  }

  function phoneFields(cfg) {
    cfg = cfg || {};
    var areaId = cfg.areaId || 'codigo_area_celular';
    var celId = cfg.celId || 'celular';
    // 50% / 50%: el label "Cód. Área (sin 0 inicial)" no entra bien en col-4
    var areaCol = cfg.areaCol || '6';
    var celCol = cfg.celCol || '6';
    var area = textField({
      id: areaId,
      name: cfg.areaName || areaId,
      label: cfg.areaLabel || 'Cód. Área (sin 0 inicial)',
      placeholder: cfg.areaPlaceholder || 'Cód. Área',
      maxLength: 4,
      minLength: 2,
      required: true,
      tabindex: cfg.areaTabindex,
      pattern: '[1-9][0-9]{1,3}',
      inputMode: 'numeric',
      validation: 'onlyNumbers',
      checkField: true
    });
    var cel = textField({
      id: celId,
      name: cfg.celName || celId,
      label: cfg.celLabel || 'Celular (sin prefijo 15)',
      placeholder: cfg.celPlaceholder || 'Celular',
      maxLength: 8,
      minLength: 6,
      required: true,
      tabindex: cfg.celTabindex,
      pattern: '[0-9]{6,8}',
      inputMode: 'numeric',
      validation: 'onlyNumbers',
      checkField: true
    });
    return wrapCol(areaCol, area) + wrapCol(celCol, cel);
  }

  function fieldHtml(cfg) {
    if (!cfg || !cfg.type) return '';
    switch (cfg.type) {
      case 'text':
      case 'email':
        return textField(Object.assign({}, cfg, {
          inputType: cfg.type === 'email' ? 'email' : (cfg.inputType || 'text')
        }));
      case 'select':
        return selectField(cfg);
      case 'password':
        return passwordField(cfg);
      case 'phone':
        return phoneFields(cfg);
      case 'button':
        if (!global.FormButton) throw new Error('FormFields: falta components/button.js');
        return global.FormButton.html(cfg);
      case 'html':
        return cfg.html || '';
      default:
        return '';
    }
  }

  function itemHtml(item) {
    if (!item) return '';
    if (item.row) {
      var inner = item.row.map(function (cell) {
        if (cell.type === 'phone') return phoneFields(cell);
        return wrapCol(cell.col, fieldHtml(cell));
      }).join('');
      return '<div class="row' + (item.className ? ' ' + esc(item.className) : '') + '">' + inner + '</div>';
    }
    if (item.type === 'phone') {
      return '<div class="row' + (item.className ? ' ' + esc(item.className) : '') + '">' + phoneFields(item) + '</div>';
    }
    if (item.type === 'html') return item.html || '';
    if (item.type === 'button') {
      return '<div class="row' + (item.className ? ' ' + esc(item.className) : '') + '"><div class="' +
        colClass(item.col || '') + ' d-flex justify-content-center"><div class="form-group">' +
        fieldHtml(item) + '</div></div></div>';
    }
    return '<div class="row"><div class="' + colClass(item.col) + '">' + fieldHtml(item) + '</div></div>';
  }

  function render(target, schema) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) throw new Error('FormFields.render: no se encontró el contenedor');
    var list = Array.isArray(schema) ? schema : [schema];
    el.innerHTML = list.map(itemHtml).join('');
    return el;
  }

  function togglePassword(id, btn) {
    if (global.FormPassword) return global.FormPassword.toggle(id, btn);
  }

  function onlyDigits(s) {
    return (s || '').replace(/\D/g, '');
  }

  function wrapGroup(el) {
    return el.closest('.form-group') || el.parentNode;
  }

  function bindPhone(opts) {
    opts = opts || {};
    var areaEl = document.getElementById(opts.areaId || 'codigo_area_celular');
    var celEl = document.getElementById(opts.celId || 'celular');
    var banner = typeof opts.banner === 'string'
      ? document.querySelector(opts.banner)
      : (opts.banner || null);
    var bannerP = banner ? banner.querySelector('p') : null;
    var trigger = typeof opts.trigger === 'string'
      ? document.querySelector(opts.trigger)
      : (opts.trigger || null);

    if (!areaEl || !celEl) {
      return { validate: function () { return true; }, clearErrors: function () {}, destroy: function () {} };
    }

    function celMax() {
      var a = onlyDigits(areaEl.value).length;
      return (a >= 2 && a <= 4) ? (10 - a) : 8;
    }

    function setInvalid(el, on) {
      wrapGroup(el).classList.toggle('field-invalid', !!on);
    }

    function clearErrors() {
      setInvalid(areaEl, false);
      setInvalid(celEl, false);
      if (banner) banner.classList.add('d-none');
      if (bannerP) bannerP.textContent = '';
    }

    function showErrors(list) {
      if (bannerP) bannerP.textContent = list.join('\n');
      if (banner) banner.classList.remove('d-none');
    }

    function onAreaInput() {
      var v = onlyDigits(areaEl.value).slice(0, 4);
      if (areaEl.value !== v) areaEl.value = v;
      celEl.setAttribute('maxlength', String(celMax()));
    }

    function onCelInput() {
      var v = onlyDigits(celEl.value).slice(0, celMax());
      if (celEl.value !== v) celEl.value = v;
    }

    areaEl.setAttribute('maxlength', '4');
    areaEl.setAttribute('inputmode', 'numeric');
    celEl.setAttribute('inputmode', 'numeric');
    celEl.setAttribute('maxlength', String(celMax()));
    areaEl.addEventListener('input', onAreaInput);
    celEl.addEventListener('input', onCelInput);

    function validate() {
      var area = onlyDigits(areaEl.value);
      var cel = onlyDigits(celEl.value);
      var areaOk = /^[1-9][0-9]{1,3}$/.test(area);
      var celOk = /^[0-9]{6,8}$/.test(cel);
      setInvalid(areaEl, false);
      setInvalid(celEl, false);
      var errors = [];
      if (!areaOk) { setInvalid(areaEl, true); errors.push(PHONE_MSG.area); }
      if (!celOk) { setInvalid(celEl, true); errors.push(PHONE_MSG.cel); }
      if (errors.length) { showErrors(errors); return false; }
      if (area.length + cel.length !== 10) {
        setInvalid(areaEl, true);
        setInvalid(celEl, true);
        showErrors([PHONE_MSG.joint]);
        return false;
      }
      clearErrors();
      return true;
    }

    function onTrigger(e) {
      var ok = validate();
      if (!ok && opts.preventDefault !== false && e) {
        e.preventDefault();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      }
      if (ok && typeof opts.onValid === 'function') opts.onValid();
      if (!ok && typeof opts.onInvalid === 'function') opts.onInvalid();
    }

    if (trigger) trigger.addEventListener('click', onTrigger, true);
    clearErrors();

    return {
      validate: validate,
      clearErrors: clearErrors,
      destroy: function () {
        areaEl.removeEventListener('input', onAreaInput);
        celEl.removeEventListener('input', onCelInput);
        if (trigger) trigger.removeEventListener('click', onTrigger, true);
      }
    };
  }

  global.FormFields = {
    render: render,
    html: fieldHtml,
    phoneHtml: phoneFields,
    togglePassword: togglePassword,
    bindPhone: bindPhone,
    messages: { phone: PHONE_MSG }
  };
})(window);
