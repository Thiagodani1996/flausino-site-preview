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
    botao.addEventListener('click', function () {
      var aberto = menu.dataset.aberto === 'true';
      menu.dataset.aberto = String(!aberto);
      botao.setAttribute('aria-expanded', String(!aberto));
    });
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

  function controleVideoHero() {
    // WCAG 2.2.2 (Pausar, Parar, Ocultar): conteúdo que se move sozinho por
    // mais de 5s precisa de um jeito de pausar. A versão antiga cumpria isso
    // apagando o autoplay inteiro para quem pede prefers-reduced-motion — só
    // que a preferência pede para tirar MOVIMENTO exagerado (parallax,
    // zoom, translação), não para nunca mostrar o vídeo. O resultado era o
    // único elemento em movimento do site sumindo por completo para quem
    // mais depende de um mecanismo de controle. Agora o autoplay vale para
    // todo mundo e o controle é um botão de verdade: visível, com texto que
    // muda ("Pausar vídeo" / "Reproduzir vídeo") e aria-pressed refletindo
    // se o vídeo está tocando.
    var video = document.querySelector('[data-video-hero]');
    var botao = document.querySelector('[data-video-controle]');
    if (!video || !botao) return;
    var rotulo = botao.querySelector('[data-video-rotulo]');

    function atualizarRotulo() {
      var tocando = !video.paused && !video.ended;
      botao.setAttribute('aria-pressed', String(tocando));
      if (rotulo) rotulo.textContent = tocando ? 'Pausar vídeo' : 'Reproduzir vídeo';
    }

    botao.addEventListener('click', function () {
      if (video.paused) {
        // play() devolve uma Promise; se o navegador recusar (raro com
        // muted, mas existe), engolimos o erro — o botão continua
        // operável e o rótulo reflete o estado real via os eventos abaixo.
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });
    // Cobre também mudanças de estado fora do clique (autoplay bloqueado,
    // vídeo pausado pelo próprio navegador ao trocar de aba em alguns casos).
    video.addEventListener('play', atualizarRotulo);
    video.addEventListener('pause', atualizarRotulo);
    atualizarRotulo();
  }

  // A animação de montagem (peças do chalé voando até o lugar) é o melhor
  // gancho de storytelling do vídeo — mas só na primeira vez. Com o
  // atributo loop nativo, os 4,38s inteiros repetem sem parar e a
  // montagem, que devia impressionar, vira bordão a cada ciclo. Quadro a
  // quadro (ver relatório em /tmp/relatorio-hero-movimento.md): a
  // estrutura é só um esqueleto de madeira até ~1,58s, quando um flash
  // branco corta para o chalé pronto (com paredes, luz acesa, banheira);
  // esse próprio flash ainda está clareando a tela até a imagem estabilizar
  // por volta de 1,96s — o primeiro instante em que nada mais muda além do
  // movimento lento da câmera. Esse é o ponto de reinício: a primeira volta
  // mostra a montagem inteira (0 ao fim), as seguintes pulam direto para o
  // chalé já pronto.
  var tempoChalePronto = 1.96;

  function loopVideoHero() {
    var video = document.querySelector('[data-video-hero]');
    if (!video) return;
    video.addEventListener('ended', function () {
      video.currentTime = tempoChalePronto;
      // play() devolve uma Promise; se o navegador recusar retomar por
      // algum motivo, o vídeo só fica parado no último quadro — não quebra
      // nada, só deixa de reiniciar.
      video.play().catch(function () {});
    });
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
      controleVideoHero();
      loopVideoHero();
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
