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
    var aoRolar = function () {
      cabecalho.classList.toggle('cabecalho--compacto', window.scrollY > 80);
    };
    window.addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();
  }

  function menuMovel() {
    var botao = document.querySelector('.menu-botao');
    var menu = document.querySelector('.menu-movel');
    if (!botao || !menu) return;
  }

  var movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    var emReproducao = true;
    var telaEstreita = window.matchMedia('(max-width: 600px)');

    function avancar() {
      slides[indiceAtivo].classList.remove('hero__slide--ativo');
      indiceAtivo = (indiceAtivo + 1) % slides.length;
      slides[indiceAtivo].classList.add('hero__slide--ativo');
    }

    function iniciar() {
      if (temporizador) return;
      temporizador = window.setInterval(avancar, INTERVALO_MS);
    }

    function parar() {
      if (!temporizador) return;
      window.clearInterval(temporizador);
      temporizador = null;
    }

    iniciar();
  }

  function parallax() {
    if (movimentoReduzido || telaPequena) return;
    var alvos = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!alvos.length) return;
    var pendente = false;
    function aplicar() {
      alvos.forEach(function (el) {
        var caixa = el.getBoundingClientRect();
        var centro = caixa.top + caixa.height / 2 - window.innerHeight / 2;
        el.style.transform = 'translate3d(0,' + (centro * -0.045).toFixed(2) + 'px,0)';
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

  document.addEventListener('DOMContentLoaded', function () {
    try {
      revelarAoRolar();
      ligarWhatsApp();
      preencherContato();
      cabecalhoCompacto();
      menuMovel();
      slideshowHero();
      document.addEventListener('catalogo:renderizado', ligarWhatsApp);
      parallax();
      document.addEventListener('catalogo:renderizado', revelarAoRolar);
    } catch (erro) {
      // Um erro em qualquer função acima não pode deixar seções invisíveis:
      // revela tudo à força antes de propagar o problema para o console.
      console.error('Erro ao iniciar a página:', erro);
      document.querySelectorAll('[data-revelar]').forEach(function (el) {
        el.dataset.visivel = 'true';
      });
    }
  });
})();
