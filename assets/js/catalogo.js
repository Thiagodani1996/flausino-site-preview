/* site/assets/js/catalogo.js — lógica pura do catálogo */

function derivarPorte(areaInterna) {
  const a = Number(areaInterna);
  if (a <= 50) return 'compacto';
  if (a <= 90) return 'medio';
  return 'amplo';
}

function derivarFaixaInvestimento(precoBase) {
  if (precoBase === null || precoBase === undefined) return null;
  const p = Number(precoBase);
  if (p <= 150000) return 'ate-150';
  if (p <= 300000) return '150-300';
  return 'acima-300';
}

function derivarFaixaQuartos(quartos) {
  return Number(quartos) >= 3 ? '3-mais' : String(Number(quartos));
}

function temFiltroAtivo(filtros) {
  const f = filtros || {};
  return Boolean(f.porte || f.quartos || f.investimento);
}

function filtrarProjetos(projetos, filtros) {
  const f = filtros || {};
  const ativo = temFiltroAtivo(f);
  return (projetos || []).filter((p) => {
    if (p.status === 'em-desenvolvimento') return !ativo;
    // Um modelo sem areaInterna (ex.: Bosque, cuja área ainda não foi
    // informada pelo dono) não tem como ser classificado em nenhum porte.
    // Sem filtro de porte ativo ele aparece normalmente — só é excluído
    // quando o visitante filtra por porte, porque nenhuma faixa serve.
    if (f.porte) {
      if (p.areaInterna === undefined || p.areaInterna === null) return false;
      if (derivarPorte(p.areaInterna) !== f.porte) return false;
    }
    if (f.quartos && derivarFaixaQuartos(p.quartos) !== f.quartos) return false;
    if (f.investimento && derivarFaixaInvestimento(p.precoBase) !== f.investimento) return false;
    return true;
  });
}

function ordenarProjetos(projetos) {
  return (projetos || []).slice().sort((a, b) => {
    const aberto = (p) => (p.status === 'em-desenvolvimento' ? 1 : 0);
    if (aberto(a) !== aberto(b)) return aberto(a) - aberto(b);
    return (a.areaInterna || 0) - (b.areaInterna || 0);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    derivarPorte, derivarFaixaInvestimento, derivarFaixaQuartos,
    temFiltroAtivo, filtrarProjetos, ordenarProjetos,
  };
}
