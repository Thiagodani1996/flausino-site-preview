/* site/assets/js/simulador.js — estimativa de receita de hospedagem.
   NÃO é promessa de retorno. A UI precisa exibir o aviso. */

function numero(valor) {
  const n = Number(valor);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function simularRetorno(entrada) {
  const e = entrada || {};
  const diaria = numero(e.diaria);
  const investimento = numero(e.investimento);
  const bruto = Number(e.ocupacao);
  const ocupacao = Number.isFinite(bruto) ? Math.min(100, Math.max(0, bruto)) : 0;

  const noitesAno = Math.round(365 * (ocupacao / 100));
  // A multiplicação estoura para Infinity mesmo com entradas finitas (uma
  // diária absurda digitada no campo). Revalidamos a SAÍDA, não só a entrada:
  // é ela que vai para a tela como valor em reais na página do investidor.
  const receitaAnual = numero(diaria * noitesAno);
  const receitaMensal = numero(receitaAnual / 12);
  const paybackAnos = investimento > 0 && receitaAnual > 0
    ? (numero(investimento / receitaAnual) || null)
    : null;

  return { noitesAno, receitaAnual, receitaMensal, paybackAnos };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { simularRetorno };
}
