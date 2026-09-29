/* site/assets/js/ui-catalogo.js — renderização do catálogo */
(function () {
  'use strict';

  // escapar() é compartilhada por todo o site e vem de contato.js, carregado
  // antes deste arquivo em toda página que usa o catálogo — ver comentário
  // lá para o porquê de escapar para contexto de atributo.

  // Nem todo modelo tem área interna ou área de deck ainda (ex.: Bosque, cuja
  // área o dono não informou — ver projetos.js e COMO-EDITAR.md). Uma spec
  // sem valor não pode virar "undefined m²" nem um "—" no card: o jeito são
  // de lidar com um dado que não existe é não desenhar aquela spec, em vez
  // de fingir que existe. Quartos e banheiros sempre existem (todo modelo
  // 'disponivel' os tem), por isso ficam fora deste filtro.
  function specsDisponivel(p) {
    var specs = [];
    if (p.areaInterna !== undefined && p.areaInterna !== null) {
      specs.push('<span>' + escapar(formatarNumero(p.areaInterna)) + ' m²</span>');
    }
    specs.push('<span>' + escapar(p.quartos) + (p.quartos > 1 ? ' quartos' : ' quarto') + '</span>');
    specs.push('<span>' + escapar(p.banheiros) + (p.banheiros > 1 ? ' banheiros' : ' banheiro') + '</span>');
    if (p.areaDeck !== undefined && p.areaDeck !== null) {
      specs.push('<span>Deck ' + escapar(formatarNumero(p.areaDeck)) + ' m²</span>');
    }
    return specs.join('');
  }

  // Mesmo raciocínio das specs acima: um modelo publicado antes de o dono
  // fechar o preço (ex.: Horizonte) não pode virar "A partir de R$ NaN".
  function precoDoCard(p) {
    if (p.precoBase === undefined || p.precoBase === null) return 'Investimento sob consulta';
    return 'A partir de ' + escapar(formatarReal(p.precoBase));
  }

  function cardDisponivel(p) {
    return '' +
      '<a class="card" data-revelar href="' + escapar(p.pagina) + '">' +
        '<span class="card__figura">' +
          '<picture>' +
            '<source srcset="' + escapar(p.capa) + '.webp" type="image/webp">' +
            '<img src="' + escapar(p.capa) + '.jpg" alt="' + escapar(p.nome) +
              ' — chalé ' + escapar(p.tipologia) + ' da Flausino Projetos" loading="lazy">' +
          '</picture>' +
        '</span>' +
        '<span class="card__nome">' + escapar(p.nome) + '</span>' +
        '<span class="card__specs">' + specsDisponivel(p) + '</span>' +
        '<span class="card__preco">' + precoDoCard(p) + '</span>' +
      '</a>';
  }

  function cardAberto(p) {
    return '' +
      '<div class="card card--aberto" data-revelar>' +
        '<span class="card__figura">' +
          '<img src="assets/img/marca/monograma.png" alt="" width="96" height="96">' +
        '</span>' +
        '<span class="card__etiqueta">Em desenvolvimento</span>' +
        '<span class="card__nome">' + escapar(p.nome) + '</span>' +
        '<span class="card__specs"><span>' + escapar(p.chamada) + '</span></span>' +
        '<a class="pill" data-whatsapp data-modelo="' + escapar(p.nome) + '" href="#">' +
          'Quero saber deste modelo</a>' +
      '</div>';
  }

  function vazio() {
    return '' +
      '<div class="catalogo__vazio">' +
        '<p class="corpo">Nenhum modelo pronto atende a essa combinação — mas ' +
          'projetamos sob medida para o seu terreno.</p>' +
        '<a class="pill" data-whatsapp data-origem="geral" href="#">Falar sobre um projeto sob medida</a>' +
      '</div>';
  }

  function renderizarCatalogo(container, projetos) {
    if (!projetos.length) { container.innerHTML = vazio(); return; }
    container.innerHTML = ordenarProjetos(projetos).map(function (p) {
      return p.status === 'em-desenvolvimento' ? cardAberto(p) : cardDisponivel(p);
    }).join('');
  }

  function lerFiltros(form) {
    return {
      porte: form.elements.porte.value,
      quartos: form.elements.quartos.value,
      investimento: form.elements.investimento.value,
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.querySelector('[data-catalogo]');
    var form = document.querySelector('[data-filtros]');
    var contador = document.querySelector('[data-contador]');
    if (!container || !form) return;

    function atualizar() {
      // Se projetos.js falhar ao carregar (ex.: erro de sintaxe numa edição
      // manual), PROJETOS nunca chega a existir como variável — referenciá-la
      // direto lançaria ReferenceError e derrubaria o catálogo inteiro antes
      // de chegar ao estado vazio. Uma lista vazia aqui cai no card "nenhum
      // modelo" já existente, em vez de deixar a seção em branco.
      var projetos = typeof PROJETOS !== 'undefined' ? PROJETOS : [];
      var filtros = lerFiltros(form);
      var visiveis = filtrarProjetos(projetos, filtros);
      renderizarCatalogo(container, visiveis);
      if (contador) {
        var prontos = visiveis.filter(function (p) { return p.status === 'disponivel'; }).length;
        contador.textContent = prontos === 1 ? '1 modelo' : prontos + ' modelos';
      }
      // os cards são recriados, então religamos os CTAs de WhatsApp
      document.dispatchEvent(new CustomEvent('catalogo:renderizado'));
    }

    form.addEventListener('change', atualizar);
    form.addEventListener('reset', function () { setTimeout(atualizar, 0); });
    atualizar();
  });
})();
