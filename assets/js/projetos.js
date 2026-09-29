/* site/assets/js/projetos.js — CONTEÚDO DO CATÁLOGO.
   Este é o arquivo que você edita para adicionar modelos.
   Veja COMO-EDITAR.md na raiz do projeto. */
const PROJETOS = [
  {
    slug: 'mirante',
    nome: 'Mirante',
    tipologia: 'A-frame',
    status: 'disponivel',
    chamada: 'A-frame para casal, com a vista emoldurada pela fachada envidraçada.',
    resumo: 'Dois pavimentos em 65 m², deck frontal com hidromassagem e ' +
            'quarto superior sob a fachada triangular de vidro.',
    areaInterna: 65,
    areaTerreo: 47.5,
    areaSuperior: 17.5,
    areaDeck: 14.4,
    quartos: 1,
    banheiros: 1,
    larguraTotal: 7.10,
    dimensoes: '6,00 × 7,00 m',
    destaques: ['Deck frontal de 14,4 m²', 'Hidromassagem 2,00 × 2,00 m', 'Pé-direito duplo'],
    ambientes: [
      { nome: 'Estar e jantar', texto: 'Ambiente integrado no térreo, aberto para o deck por portas de vidro.' },
      { nome: 'Cozinha', texto: 'Bancada em L com ilha, integrada ao estar.' },
      { nome: 'Banheiro', texto: 'Completo, no térreo, com 1,86 × 2,36 m.' },
      { nome: 'Quarto do casal', texto: '17,5 m² úteis no pavimento superior, sob a fachada triangular envidraçada, com rouparia e bancada.' },
      { nome: 'Deck com hidro', texto: '14,4 m² de deck frontal em madeira com hidromassagem de 2,00 × 2,00 m incorporada.' },
    ],
    inclusos: ['[[PREENCHER]]'],
    personalizacao: 'O projeto é adaptado ao seu terreno e ao seu gosto — ' +
      'acabamentos, revestimentos, marcenaria e disposição dos ambientes ' +
      'são definidos junto com você antes do início da obra.',
    precoBase: 140000,
    capa: 'assets/img/mirante/exterior-entardecer',
    planta: 'assets/img/mirante/planta',
    galeria: [
      { arquivo: 'assets/img/mirante/exterior-entardecer', alt: 'Chalé A-frame Mirante ao entardecer, com deck de madeira, hidromassagem e vista para as montanhas' },
      { arquivo: 'assets/img/mirante/exterior-dia', alt: 'Fachada lateral do chalé Mirante durante o dia, mostrando a cobertura metálica grafite e o volume lateral em madeira' },
      { arquivo: 'assets/img/mirante/estar-cozinha', alt: 'Interior integrado do Mirante com sala de estar, cozinha ao fundo e escada reta lateral' },
      { arquivo: 'assets/img/mirante/jantar-vista', alt: 'Mesa de jantar do Mirante junto às portas de vidro, com o pôr do sol sobre as montanhas ao fundo' },
      { arquivo: 'assets/img/mirante/quarto-loft', alt: 'Quarto do casal no pavimento superior do Mirante, com paredes inclinadas em madeira aparente' },
      { arquivo: 'assets/img/mirante/quarto-vista', alt: 'Quarto superior do Mirante emoldurando o pôr do sol pela fachada triangular envidraçada' },
      { arquivo: 'assets/img/mirante/banheiro', alt: 'Banheiro completo do Mirante com box de vidro, bancada suspensa e janela para a mata' },
    ],
    pagina: 'modelos/mirante.html',
  },

  /* ---- Slots em desenvolvimento ------------------------------------------
     Quando um destes ficar pronto: mude o status para 'disponivel' e
     preencha os campos numéricos, como no Mirante acima.               */
  {
    slug: 'cume',
    nome: 'Cume',
    tipologia: 'A-frame',
    status: 'em-desenvolvimento',
    chamada: 'Para família. Mais quartos, mesma linguagem arquitetônica.',
  },
  {
    slug: 'vale',
    nome: 'Vale',
    tipologia: 'Modular',
    status: 'em-desenvolvimento',
    chamada: 'Para pousada e hospedagem. Pensado para múltiplas unidades no mesmo terreno.',
  },

  /* ---- Bosque -------------------------------------------------------------
     Modelo compacto de entrada. O dono ainda NÃO informou área interna, área
     de deck, dimensões nem largura total — por isso esses campos (presentes
     no Mirante acima) ficam de fora aqui, em vez de zero ou inventados.
     areaInterna ausente também significa que este modelo não aparece quando
     o visitante filtra por porte (ver derivarPorte/filtrarProjetos em
     catalogo.js) — não há como classificar um porte sem a área. Também não
     há campo `planta`: o dono ainda não entregou planta baixa deste modelo,
     então a seção "Planta baixa" da página fica oculta (ver bosque.html e
     o bloco data-bloco-planta em _TEMPLATE.html).                        */
  {
    slug: 'bosque',
    nome: 'Bosque',
    tipologia: 'Compacto',
    status: 'disponivel',
    chamada: 'Compacto e acessível. O primeiro chalé para quem está começando.',
    resumo: 'Ambiente único e integrado — cama, cozinha e mesa de jantar — mais ' +
            'banheiro completo e deck com banheira independente em frente à ' +
            'fachada envidraçada.',
    quartos: 1,
    banheiros: 1,
    destaques: ['Deck com banheira independente', 'Fachada envidraçada emoldurando a vista', 'Ambiente único integrado, sem escada'],
    ambientes: [
      { nome: 'Estar, cozinha e quarto', texto: 'Ambiente único e integrado: cama, cozinha compacta e mesa de jantar no mesmo espaço.' },
      { nome: 'Banheiro', texto: 'Completo, com chuveiro, bancada e janela.' },
      { nome: 'Deck com banheira', texto: 'Deck externo com banheira independente, de frente para a vista, em frente à fachada envidraçada.' },
    ],
    personalizacao: 'O projeto é adaptado ao seu terreno e ao seu gosto — ' +
      'acabamentos, revestimentos, marcenaria e disposição dos ambientes ' +
      'são definidos junto com você antes do início da obra.',
    precoBase: 50000,
    capa: 'assets/img/bosque/exterior-entardecer',
    galeria: [
      { arquivo: 'assets/img/bosque/exterior-entardecer', alt: 'Chalé compacto Bosque ao entardecer, fachada frontal com deck de madeira e banheira independente' },
      { arquivo: 'assets/img/bosque/exterior-lateral', alt: 'Vista lateral do chalé Bosque ao entardecer, com a cobertura em A e o vale ao fundo' },
      { arquivo: 'assets/img/bosque/interior-estar', alt: 'Interior integrado do Bosque com cama, cozinha compacta e mesa de jantar no mesmo ambiente' },
      { arquivo: 'assets/img/bosque/interior-vista', alt: 'Fachada envidraçada do Bosque emoldurando o pôr do sol, vista de dentro do quarto' },
      { arquivo: 'assets/img/bosque/banheiro', alt: 'Banheiro do Bosque com box de chuveiro, bancada e janela' },
    ],
    pagina: 'modelos/bosque.html',
  },

  /* ---- Horizonte ----------------------------------------------------------
     Números tirados da planta entregue pelo dono ("Cabana Horizonte"):
     corpo fechado 7,20 × 5,40 m = 38,88 m², deck 7,20 × 2,80 m = 20,16 m².
     SEM precoBase: o dono ainda não fechou o valor. Sem o campo, o card do
     catálogo e a página mostram "Investimento sob consulta", e o modelo não
     entra em nenhuma faixa quando o visitante filtra por investimento.
     Quando o valor existir, é só acrescentar  precoBase: 000000,  aqui e
     trocar o bloco "Investimento" de modelos/horizonte.html (ver
     COMO-EDITAR.md, seção 3).                                            */
  {
    slug: 'horizonte',
    nome: 'Horizonte',
    tipologia: 'Cabana',
    status: 'disponivel',
    chamada: 'Térrea, para casal, com o deck inteiro voltado para a vista.',
    resumo: 'Cabana térrea de 38,88 m² com sala e cozinha integradas, ' +
            'quarto de casal e banheiro, aberta por portas de correr para um ' +
            'deck de 20,16 m² com hidromassagem.',
    areaInterna: 38.88,
    areaDeck: 20.16,
    quartos: 1,
    banheiros: 1,
    dimensoes: '7,20 × 5,40 m',
    destaques: ['Deck de 20,16 m² com hidromassagem', 'Sala e quarto abertos para o deck', 'Térrea, sem escadas'],
    ambientes: [
      { nome: 'Sala e cozinha', texto: '19,38 m² integrados, com cozinha linear de 3,50 m e porta de correr de 2,60 m para o deck.' },
      { nome: 'Quarto do casal', texto: '9,15 m² com cama queen, armário e porta de correr de 2,00 m para o deck.' },
      { nome: 'Banheiro', texto: '5,46 m², com box de 1,00 × 1,00 m e janela.' },
      { nome: 'Deck com hidro', texto: '20,16 m² de deck em madeira com hidromassagem de casal (2,00 × 1,60 m) e guarda-corpo de vidro.' },
    ],
    personalizacao: 'O projeto é adaptado ao seu terreno e ao seu gosto — ' +
      'acabamentos, revestimentos, marcenaria e disposição dos ambientes ' +
      'são definidos junto com você antes do início da obra.',
    capa: 'assets/img/horizonte/fachada',
    planta: 'assets/img/horizonte/planta',
    galeria: [
      { arquivo: 'assets/img/horizonte/fachada', alt: 'Cabana Horizonte ao entardecer, com deck suspenso, hidromassagem e guarda-corpo de vidro de frente para as montanhas' },
      { arquivo: 'assets/img/horizonte/fundos', alt: 'Fundos da cabana Horizonte, com revestimento em madeira, janelas em faixa e cobertura de uma água' },
      { arquivo: 'assets/img/horizonte/deck-hidromassagem', alt: 'Deck do Horizonte com hidromassagem de casal e duas poltronas diante do vale ao pôr do sol' },
      { arquivo: 'assets/img/horizonte/sala-cozinha', alt: 'Sala e cozinha integradas do Horizonte vistas do deck, com sofá, mesa redonda e janela sobre a pia' },
      { arquivo: 'assets/img/horizonte/quarto', alt: 'Quarto do casal do Horizonte com cama queen, paredes em madeira e janela para as montanhas' },
      { arquivo: 'assets/img/horizonte/banheiro', alt: 'Banheiro do Horizonte com bancada em madeira, espelho redondo e box de vidro' },
    ],
    pagina: 'modelos/horizonte.html',
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROJETOS };
}
