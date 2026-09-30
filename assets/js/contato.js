/* site/assets/js/contato.js — lógica pura de contato */

function montarMensagemWhatsApp(contexto) {
  const ctx = contexto || {};
  // Texto já montado (ex.: o formulário de orçamento) vai do jeito que veio.
  if (ctx.texto) return ctx.texto;
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

// O formulário de orçamento não tem servidor: ele monta a mensagem e abre o
// WhatsApp. Por isso não pede o número de quem escreve — a conversa já chega
// com ele — e não precisa de armadilha contra robô (robô não manda WhatsApp).
function validarFormulario(dados) {
  const d = dados || {};
  const erros = {};
  if (!String(d.nome || '').trim()) erros.nome = 'Informe seu nome.';
  if (!String(d.cidade || '').trim()) erros.cidade = 'Informe sua cidade.';
  if (!String(d.modelo || '').trim()) erros.modelo = 'Escolha um modelo (ou "Ainda não sei").';
  return { valido: Object.keys(erros).length === 0, erros };
}

// Mensagem do orçamento, um campo por linha, para chegar organizada no
// WhatsApp. Recebe os textos como a pessoa viu (ex.: "Sim, já tenho"), não
// os códigos das opções. A mensagem livre só entra se tiver algo escrito.
function montarMensagemOrcamento(campos) {
  const c = campos || {};
  const linhas = [
    'Olá! Vim pelo site da Flausino Projetos e gostaria de um orçamento.',
    '',
    `Nome: ${String(c.nome || '').trim()}`,
    `Cidade: ${String(c.cidade || '').trim()}`,
    `Terreno: ${String(c.terreno || '').trim()}`,
    `Modelo de interesse: ${String(c.modelo || '').trim()}`,
    `Prazo: ${String(c.prazo || '').trim()}`,
  ];
  const mensagem = String(c.mensagem || '').trim();
  if (mensagem) linhas.push(`Mensagem: ${mensagem}`);
  return linhas.join('\n');
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

// Lê um número escrito em português dentro de um texto de página: "R$ 140.000",
// "47,5 m²", "7,10 m", "30". Devolve o que vem antes, o valor, quantas casas
// decimais ele tem e o que vem depois — o contador anima só o valor e remonta
// o texto idêntico ao original no final. Textos com dois números ("2,00 × 2,00
// m") ou sem número nenhum (um marcador [[...]] ainda não preenchido) devolvem
// null, e o contador simplesmente deixa o texto como está.
function lerNumeroBR(texto) {
  var t = String(texto == null ? '' : texto);
  if ((t.match(/\d+(?:[.,]\d+)*/g) || []).length !== 1) return null;
  var m = t.match(/^(\D*?)(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?(\D*)$/);
  if (!m) return null;
  var casas = m[3] ? m[3].length : 0;
  var valor = Number(m[2].replace(/\./g, '') + (m[3] ? '.' + m[3] : ''));
  if (!Number.isFinite(valor)) return null;
  return { prefixo: m[1], valor: valor, casas: casas, sufixo: m[4] };
}

function escreverNumeroBR(valor, casas) {
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: casas, maximumFractionDigits: casas,
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    montarMensagemWhatsApp, montarLinkWhatsApp, montarMensagemOrcamento, validarFormulario, formatarReal,
    escapar, formatarNumero, lerNumeroBR, escreverNumeroBR,
  };
}
