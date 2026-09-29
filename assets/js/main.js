/* site/assets/js/main.js — comportamento compartilhado por todas as páginas */
(function () {
  'use strict';

  // Todo link/botão com data-whatsapp recebe a URL montada a partir de CONTATO.
  // Nenhuma página monta URL de WhatsApp à mão.
  function ligarWhatsApp() {
    document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
      var contexto = {};
      if (el.dataset.modelo) contexto.modelo = el.dataset.modelo;
      if (el.dataset.origem) contexto.origem = el.dataset.origem;
      try {
        el.setAttribute('href', montarLinkWhatsApp(CONTATO.whatsapp, contexto));
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      } catch (erro) {
        // Um CTA morto (href="#") é pior que um CTA que leva a outro caminho:
        // o visitante clica e nada acontece. Cai no formulário de orçamento.
        console.error('WhatsApp não configurado:', erro.message);
        el.setAttribute('href', el.dataset.fallback || 'orcamento.html');
      }
    });
  }

  function preencherContato() {
    document.querySelectorAll('[data-contato]').forEach(function (el) {
      var valor = CONTATO[el.dataset.contato];
      if (!valor || String(valor).indexOf('[[') === 0) {
        // Sem valor real ainda: um link vazio sem texto continuaria focável e
        // sem nome acessível (falha de leitor de tela). Esconde até ser preenchido.
        el.hidden = true;
        return;
      }
      if (el.dataset.contato === 'email') {
        el.setAttribute('href', 'mailto:' + valor);
      } else if (el.dataset.contato === 'instagram') {
        el.setAttribute('href', 'https://instagram.com/' + valor);
      }
      if (el.dataset.escrever === 'true') el.textContent = valor;
    });
  }

  function cabecalhoCompacto() {
    var cabecalho = document.querySelector('.cabecalho');
    if (!cabecalho) return;
    // Na home o cabeçalho fica transparente sobre a foto do hero e vira
    // sólido (branco) quando a foto sai de baixo dele ou o menu abre.
    var sobreFoto = cabecalho.classList.contains('cabecalho--sobre-foto');
    var hero = document.querySelector('.hero');
    var menu = document.querySelector('.menu-movel');
    var aoRolar = function () {
      cabecalho.classList.toggle('cabecalho--compacto', window.scrollY > 80);
      if (sobreFoto) {
        var passouDoHero = !hero || hero.getBoundingClientRect().bottom <= cabecalho.offsetHeight;
        var menuAberto = menu && menu.dataset.aberto === 'true';
        cabecalho.classList.toggle('cabecalho--solido', passouDoHero || menuAberto);
      }
    };
    document.addEventListener('menu:alternado', aoRolar);
    window.addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();
  }

  function menuMovel() {
    var botao = document.querySelector('.menu-botao');
    var menu = document.querySelector('.menu-movel');
    if (!botao || !menu) return;
    botao.addEventListener('click', function () {
      var aberto = menu.dataset.aberto === 'true';
      menu.dataset.aberto = String(!aberto);
      botao.setAttribute('aria-expanded', String(!aberto));
      document.dispatchEvent(new CustomEvent('menu:alternado'));
    });
  }

  // "Reduzir movimento" no sistema desliga os efeitos — a não ser na
  // pré-visualização (?movimento no endereço, ver o script no <head>).
  var movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !document.documentElement.classList.contains('movimento-forcado');
  var telaPequena = window.matchMedia('(max-width: 767px)').matches;

  // Enquanto o documento está oculto (aba em segundo plano, prerender), o
  // navegador suspende callbacks de IntersectionObserver — observar agora
  // não adianta nada. Esta flag garante um único listener de
  // visibilitychange pendente por vez, mesmo que revelarAoRolar() seja
  // chamada de novo nesse meio-tempo (ex.: um catalogo:renderizado
  // disparado enquanto a aba ainda está oculta).
  var aguardandoVisibilidade = false;

  function revelarAoRolar() {
    var alvos = document.querySelectorAll('[data-revelar]');
    // Sem IntersectionObserver não há como escalonar a entrada ao rolar —
    // revela tudo de uma vez para não deixar conteúdo invisível. Motion
    // reduzido NÃO cai neste atalho: prefers-reduced-motion pede para tirar
    // o movimento (o translateY, o parallax), não o reveal inteiro — o fade
    // de opacidade continua rolando normalmente, só sem o deslocamento;
    // quem decide isso é o CSS (ver animacoes.css), não este bypass.
    if (!('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.dataset.visivel = 'true'; });
      return;
    }
    // Documento oculto: um IntersectionObserver criado agora nunca dispara
    // (o navegador pausa esse trabalho em segundo plano), então os alvos
    // ficariam presos em opacity:0 para sempre. Em vez de observar, espera
    // a aba voltar a ficar visível e tenta de novo — o requery de
    // [data-revelar] nesse momento já pega qualquer elemento novo que tenha
    // chegado nesse meio-tempo (ex.: catálogo renderizado em segundo plano).
    if (document.hidden) {
      if (!aguardandoVisibilidade) {
        aguardandoVisibilidade = true;
        var aoFicarVisivel = function () {
          if (document.hidden) return;
          document.removeEventListener('visibilitychange', aoFicarVisivel);
          aguardandoVisibilidade = false;
          revelarAoRolar();
        };
        document.addEventListener('visibilitychange', aoFicarVisivel);
      }
      return;
    }
    // escalona irmãos dentro do mesmo pai
    var contagem = new Map();
    alvos.forEach(function (el) {
      var pai = el.parentElement;
      var indice = contagem.get(pai) || 0;
      if (indice > 0 && indice <= 4) el.dataset.atraso = String(indice);
      contagem.set(pai, indice + 1);
    });

    var observer = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.dataset.visivel = 'true';
        observer.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

    alvos.forEach(function (el) { observer.observe(el); });
  }

  // Slideshow de fotos do hero (substituiu o vídeo mirante-deck.mp4/.webm —
  // o dono achou a qualidade do vídeo ruim e preferiu fotos, ver
  // tools/otimizar-midia.mjs). WCAG 2.2.2 (Pausar, Parar, Ocultar):
  // conteúdo que troca sozinho por mais de 5s precisa de um jeito de
  // pausar — por isso o botão que já existia para o vídeo (mesmo visual,
  // mesmo comportamento de aria-pressed) foi reaproveitado aqui em vez de
  // criado do zero. prefers-reduced-motion NÃO desliga o troca-automático:
  // a preferência pede para tirar movimento (translação, parallax, zoom), e
  // opacidade não é movimento — o crossfade continua rolando para todo
  // mundo (ver o override em animacoes.css), o botão é que cumpre a
  // exigência de controle da WCAG.
  function slideshowHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero__slide'));
    if (slides.length < 2) return;
    // O crossfade roda para todo mundo, inclusive sob prefers-reduced-motion:
    // a preferência pede para tirar MOVIMENTO — translação, parallax, zoom —
    // e opacidade não é movimento. É o mesmo critério já aplicado ao
    // [data-revelar]. As fotos são decorativas (aria-hidden) e nenhuma
    // informação depende delas, então não há conteúdo que alguém precise
    // parar para conseguir ler.
    var INTERVALO_MS = 6000;
    var indiceAtivo = Math.max(0, slides.findIndex(function (s) {
      return s.classList.contains('hero__slide--ativo');
    }));
    var temporizador = null;

    var saindo = null;

    function avancar() {
      // O slide que sai continua a aproximação lenta até sumir (ver
      // hero__slide--saindo em paginas.css); sem isso ele voltaria ao
      // tamanho original no meio do crossfade.
      if (saindo) saindo.classList.remove('hero__slide--saindo');
      saindo = slides[indiceAtivo];
      saindo.classList.add('hero__slide--saindo');
      saindo.classList.remove('hero__slide--ativo');
      indiceAtivo = (indiceAtivo + 1) % slides.length;
      slides[indiceAtivo].classList.add('hero__slide--ativo');
    }

    function iniciar() {
      if (temporizador) return;
      temporizador = window.setInterval(avancar, INTERVALO_MS);
    }

    iniciar();
  }

  // Adia uma configuração até a aba estar visível: navegador suspende o
  // IntersectionObserver em aba oculta, e um elemento escondido esperando um
  // observador que nunca dispara fica escondido para sempre.
  function quandoVisivel(fn) {
    if (!document.hidden) { fn(); return; }
    var aoVer = function () {
      if (document.hidden) return;
      document.removeEventListener('visibilitychange', aoVer);
      fn();
    };
    document.addEventListener('visibilitychange', aoVer);
  }

  // Rolagem com inércia (Lenis). Só no computador — no celular o Lenis mantém
  // a rolagem nativa do dedo, que já tem inércia própria.
  function rolagemSuave() {
    if (movimentoReduzido || typeof window.Lenis !== 'function') return;
    new window.Lenis({ lerp: 0.09, smoothWheel: true, autoRaf: true, anchors: false });
  }

  // Fotos das seções entram com uma cortina subindo e um zoom se acomodando.
  // O atributo data-foto (que esconde a foto) só é posto quando já dá para
  // observar — sem JavaScript, sem IntersectionObserver ou com movimento
  // reduzido, a foto simplesmente está lá.
  function revelarFotos() {
    if (movimentoReduzido || !('IntersectionObserver' in window)) return;
    var fotos = document.querySelectorAll('.duas-colunas picture, .galeria__principal picture');
    if (!fotos.length) return;
    quandoVisivel(function () {
      // Observa o PAI da foto, não a foto: a foto começa recortada 100% pela
      // cortina, e o navegador trata um elemento totalmente recortado como
      // fora da tela — o observador nunca dispararia e a foto ficaria
      // escondida para sempre.
      var porPai = new Map();
      fotos.forEach(function (f) {
        var pai = f.parentElement;
        if (!porPai.has(pai)) porPai.set(pai, []);
        porPai.get(pai).push(f);
      });
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          (porPai.get(e.target) || []).forEach(function (f) { f.dataset.fotoVisivel = 'true'; });
          obs.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
      porPai.forEach(function (lista, pai) {
        lista.forEach(function (f) { f.dataset.foto = ''; });
        obs.observe(pai);
      });
    });
  }

  // A foto inteira (moldura e imagem juntas) sobe um pouco mais devagar que o
  // texto ao lado enquanto a página rola. Mover a imagem DENTRO da moldura
  // exigia deixá-la ampliada para sobrar folga, e isso cortava ~20% de cada
  // foto; movendo a moldura, a foto continua inteira. A galeria do topo das
  // páginas de modelo fica de fora: ela encosta no título e nas miniaturas.
  function parallax() {
    if (movimentoReduzido || telaPequena) return;
    var alvos = Array.prototype.slice.call(document.querySelectorAll('.duas-colunas picture'));
    if (!alvos.length) return;
    var pendente = false;
    function aplicar() {
      var meio = window.innerHeight / 2;
      alvos.forEach(function (moldura) {
        // Mede a posição sem o deslocamento atual, para o cálculo não
        // realimentar o próprio resultado.
        var atual = parseFloat((moldura.style.translate || '0 0').split(' ')[1]) || 0;
        var caixa = moldura.getBoundingClientRect();
        var topo = caixa.top - atual;
        if (topo + caixa.height < -200 || topo > window.innerHeight + 200) return;
        var distancia = (topo + caixa.height / 2 - meio) / (window.innerHeight + caixa.height);
        var limite = 40;
        var desloca = Math.max(-limite, Math.min(limite, distancia * -2 * limite));
        moldura.style.translate = '0 ' + desloca.toFixed(1) + 'px';
      });
      pendente = false;
    }
    window.addEventListener('scroll', function () {
      if (pendente) return;
      pendente = true;
      window.requestAnimationFrame(aplicar);
    }, { passive: true });
    aplicar();
  }

  // Botões "puxam" levemente para o cursor. Delegação no documento para valer
  // também nos botões que o catálogo cria depois de filtrar.
  function botoesMagneticos() {
    if (movimentoReduzido || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var atual = null;
    function soltar() { if (atual) { atual.style.translate = ''; atual = null; } }
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var pill = e.target.closest ? e.target.closest('.pill') : null;
      if (atual && atual !== pill) soltar();
      if (!pill) return;
      atual = pill;
      var r = pill.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      pill.style.translate = (dx * 0.22).toFixed(1) + 'px ' + (dy * 0.35).toFixed(1) + 'px';
    }, { passive: true });
    document.addEventListener('pointerout', function (e) { if (!e.relatedTarget) soltar(); });
  }

  // Números contam do zero até o valor quando aparecem. O texto final é
  // remontado idêntico ao original — o preço nunca fica errado.
  function contadores() {
    if (movimentoReduzido || !('IntersectionObserver' in window)) return;
    var alvos = Array.prototype.slice.call(document.querySelectorAll('[data-contar]'));
    if (!alvos.length || typeof lerNumeroBR !== 'function') return;
    var DURACAO = 1600;
    function saida(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    function contar(el) {
      var original = el.textContent;
      var n = lerNumeroBR(original);
      if (!n) return;
      el.style.minWidth = el.getBoundingClientRect().width + 'px';
      var inicio = null;
      function passo(agora) {
        if (inicio === null) inicio = agora;
        var t = Math.min(1, (agora - inicio) / DURACAO);
        el.textContent = n.prefixo + escreverNumeroBR(n.valor * saida(t), n.casas) + n.sufixo;
        if (t < 1) window.requestAnimationFrame(passo);
        else el.textContent = original;
      }
      window.requestAnimationFrame(passo);
      // rede de segurança: aconteça o que acontecer, termina no valor certo
      window.setTimeout(function () { el.textContent = original; }, DURACAO + 400);
    }
    quandoVisivel(function () {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          obs.unobserve(e.target);
          contar(e.target);
        });
      }, { threshold: 0.9 });
      alvos.forEach(function (el) { obs.observe(el); });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    try {
      revelarAoRolar();
      ligarWhatsApp();
      preencherContato();
      cabecalhoCompacto();
      menuMovel();
      slideshowHero();
      document.addEventListener('catalogo:renderizado', ligarWhatsApp);
      rolagemSuave();
      revelarFotos();
      parallax();
      botoesMagneticos();
      contadores();
      document.addEventListener('catalogo:renderizado', revelarAoRolar);
    } catch (erro) {
      // Um erro em qualquer função acima não pode deixar seções invisíveis:
      // revela tudo à força antes de propagar o problema para o console.
      console.error('Erro ao iniciar a página:', erro);
      document.querySelectorAll('[data-revelar]').forEach(function (el) {
        el.dataset.visivel = 'true';
      });
      document.querySelectorAll('[data-foto]').forEach(function (el) {
        el.dataset.fotoVisivel = 'true';
      });
    }
  });
})();
