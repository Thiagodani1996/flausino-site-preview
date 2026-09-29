/* site/assets/js/contato.js — lógica pura de contato */

function montarMensagemWhatsApp(contexto) {
  const ctx = contexto || {};
  const abertura = 'Olá! Vim pelo site da Flausino Projetos.';
  if (ctx.modelo) {
    return `${abertura} Tenho interesse no modelo ${ctx.modelo} e gostaria de ` +
           'conversar sobre valores e personalização.';
  }
  if (ctx.origem === 'investidores') {
    return `${abertura} Quero conversar sobre chalés para hospedagem e ` +
           'geração de renda.';
  }
  return `${abertura} Gostaria de solicitar um orçamento.`;
}

function montarLinkWhatsApp(numero, contexto) {
  const digitos = String(numero || '').replace(/\D/g, '');
  // wa.me só resolve em formato internacional completo: código do país + DDD +
  // número. No Brasil isso dá 12 ou 13 dígitos (55 + DDD + 8 ou 9). A faixa
  // 12–15 cobre o Brasil e o resto do mundo, e recusa o erro mais provável de
  // quem trocar esse valor à mão: colar o número local sem o 55, que geraria um
  // link quebrado silenciosamente em todos os botões do site.
  if (digitos.length < 12 || digitos.length > 15) {
    throw new Error(
      'CONTATO.whatsapp precisa estar no formato internacional, com código do ' +
      'país: 55 + DDD + número (ex.: 5531973210226). O valor atual tem ' +
      digitos.length + ' dígito(s).');
  }
  const texto = encodeURIComponent(montarMensagemWhatsApp(contexto));
  return `https://wa.me/${digitos}?text=${texto}`;
}

function validarFormulario(dados) {
  const d = dados || {};
  const erros = {};
  if (!String(d.nome || '').trim()) erros.nome = 'Informe seu nome.';
  if (String(d.whatsapp || '').replace(/\D/g, '').length < 10) {
    erros.whatsapp = 'Informe um WhatsApp com DDD.';
  }
  if (!String(d.cidade || '').trim()) erros.cidade = 'Informe sua cidade.';
  if (String(d.website || '').trim()) erros.website = 'Envio bloqueado.'; // honeypot
  return { valido: Object.keys(erros).length === 0, erros };
}

function formatarReal(valor) {
  const inteiro = Math.round(Number(valor) || 0);
  return 'R$ ' + inteiro.toLocaleString('pt-BR');
}

// Escapa para contexto de ATRIBUTO, não só de texto. O truque do
// textContent/innerHTML não escapa aspas, e várias páginas montam marcação por
// concatenação com valores dentro de href/src/alt/data-*. Como projetos.js é
// editado à mão pelo dono, um "&", "<" ou aspa num nome quebraria a marcação —
// por isso mora em contato.js, carregado em toda página, em vez de preso a um
// único script. "&" precisa ser o primeiro replace: se viesse depois dos
// outros, o "&amp;" que eles próprios produzem seria escapado de novo,
// virando "&amp;amp;".
function escapar(texto) {
  return String(texto == null ? '' : texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Medidas vêm de projetos.js como número JavaScript, que usa ponto decimal.
// Em português a vírgula é que separa decimal: 14.4 precisa sair "14,4".
// Inteiros saem sem vírgula nenhuma — 65 continua "65", não "65,0".
function formatarNumero(valor) {
  var n = Number(valor);
  if (!Number.isFinite(n)) return '';
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    montarMensagemWhatsApp, montarLinkWhatsApp, validarFormulario, formatarReal,
    escapar, formatarNumero,
  };
}
