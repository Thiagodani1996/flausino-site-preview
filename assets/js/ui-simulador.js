/* site/assets/js/ui-simulador.js */
(function () {
  'use strict';

  function texto(seletor, valor) {
    var el = document.querySelector(seletor);
    if (el) el.textContent = valor;
  }

  function calcular(form) {
    var r = simularRetorno({
      diaria: form.elements.diaria.value,
      ocupacao: form.elements.ocupacao.value,
      investimento: form.elements.investimento.value,
    });
    texto('[data-saida="noites"]', r.noitesAno + (r.noitesAno === 1 ? ' noite' : ' noites'));
    texto('[data-saida="mensal"]', formatarReal(r.receitaMensal));
    texto('[data-saida="anual"]', formatarReal(r.receitaAnual));
    texto('[data-saida="payback"]', r.paybackAnos === null
      ? '—'
      : r.paybackAnos.toFixed(1).replace('.', ',') + ' anos');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('[data-simulador]');
    if (!form) return;

    var espelho = function () {
      texto('[data-espelho="ocupacao"]', form.elements.ocupacao.value + '%');
      calcular(form);
    };
    form.addEventListener('input', espelho);
    form.addEventListener('submit', function (e) { e.preventDefault(); espelho(); });
    espelho();
  });
})();
