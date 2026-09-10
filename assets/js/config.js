/* site/assets/js/config.js — script clássico, sem import/export.
   Este é o único lugar do site com dados de contato.
   Trocar o WhatsApp aqui atualiza todas as páginas. */
const CONTATO = {
  whatsapp: '5531973210226',        // TEMPORÁRIO — trocar quando houver definitivo
  email: '[[PREENCHER]]',
  instagram: 'flausinoprojetos',
  cidade: 'Vespasiano',
  estado: 'MG',
  atendimento: 'todo o Brasil',
  formspreeId: '[[PREENCHER]]',
  cnpj: '[[PREENCHER]]',
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONTATO };
}
