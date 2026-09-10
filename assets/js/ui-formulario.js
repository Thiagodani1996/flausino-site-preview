/* site/assets/js/ui-formulario.js */
(function () {
  'use strict';

  function limparErros(form) {
    form.querySelectorAll('[data-erro]').forEach(function (el) { el.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(function (el) {
      el.removeAttribute('aria-invalid');
    });
  }

  function mostrarErros(form, erros) {
    Object.keys(erros).forEach(function (campo) {
      var alvo = form.querySelector('[data-erro="' + campo + '"]');
      if (alvo) alvo.textContent = erros[campo];
      var entrada = form.elements[campo];
      if (entrada && entrada.setAttribute) entrada.setAttribute('aria-invalid', 'true');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('[data-orcamento]');
    if (!form) return;
    var estado = document.querySelector('[data-estado-envio]');

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      limparErros(form);

      var dados = {};
      new FormData(form).forEach(function (valor, chave) { dados[chave] = valor; });

      var checagem = validarFormulario(dados);
      if (!checagem.valido) {
        mostrarErros(form, checagem.erros);
        estado.textContent = 'Confira os campos destacados.';
        return;
      }

      if (!CONTATO.formspreeId || CONTATO.formspreeId.indexOf('[[') === 0) {
        estado.textContent = 'O formulário ainda não está conectado. ' +
          'Use o botão de WhatsApp acima — respondemos por lá.';
        return;
      }

      estado.textContent = 'Enviando...';
      fetch('https://formspree.io/f/' + CONTATO.formspreeId, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      }).then(function (resposta) {
        if (!resposta.ok) throw new Error('falha no envio');
        form.reset();
        estado.textContent = 'Recebemos seu pedido. Entramos em contato em breve.';
      }).catch(function () {
        estado.textContent = 'Não conseguimos enviar agora. ' +
          'Fale com a gente pelo WhatsApp que resolvemos na hora.';
      });
    });
  });
})();
