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
    video: 'assets/video/mirante-deck',
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
  {
    slug: 'bosque',
    nome: 'Bosque',
    tipologia: 'Compacto',
    status: 'em-desenvolvimento',
    chamada: 'Compacto e acessível. O primeiro chalé para quem está começando.',
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROJETOS };
}
