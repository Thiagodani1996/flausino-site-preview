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

      // Selects vão para a mensagem com o texto que a pessoa viu na tela.
      function texto(nome) {
        var campo = form.elements[nome];
        if (campo && campo.tagName === 'SELECT') return campo.options[campo.selectedIndex].text;
        return campo ? campo.value : '';
      }
      var link = montarLinkWhatsApp(CONTATO.whatsapp, {
        texto: montarMensagemOrcamento({
          nome: texto('nome'), cidade: texto('cidade'), terreno: texto('terreno'),
          modelo: texto('modelo'), prazo: texto('prazo'), mensagem: texto('mensagem'),
        }),
      });
      estado.textContent = 'Abrindo o WhatsApp com a sua mensagem pronta...';
      // Nova aba no computador; se o navegador bloquear, abre na mesma aba.
      var janela = window.open(link, '_blank', 'noopener');
      if (!janela) window.location.href = link;
    });
  });
})();
