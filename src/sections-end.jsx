// Investimento, Agente IA, Footer — updated 2026-04-28
const { useState: useStateE, useMemo: useMemoE } = React;

function InvestimentoSection() {
  return (
    <Section id="investimento" className="bg-white border-y border-stone-200/70">
      <SectionHeader title="Investimento" subtitle="Previsibilidade no ticket. Garantia no resultado." />
      <Reveal>
        <div className="grid md:grid-cols-2 gap-4">
          <Card grad hover className="p-6 md:p-8">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">Investimento mensal</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl md:text-4xl font-semibold text-ink tabular-nums tracking-tight">R$ 20.000</span>
            </div>
            <div className="mt-1 text-sm text-muted">mensalidade fixa · frota completa</div>
            <div className="mt-5 pt-5 border-t border-stone-200/70 space-y-2 text-sm text-stone-700">
              <div className="flex items-center gap-2"><IconCheck size={14} strokeWidth={1.5} className="text-brand-600" />Usuários ilimitados</div>
              <div className="flex items-center gap-2"><IconCheck size={14} strokeWidth={1.5} className="text-brand-600" />Checklists, OS e Kanban inclusos</div>
              <div className="flex items-center gap-2"><IconCheck size={14} strokeWidth={1.5} className="text-brand-600" />Suporte dedicado e onboarding</div>
              <div className="flex items-center gap-2"><IconCheck size={14} strokeWidth={1.5} className="text-brand-600" />Integração ERP (Sankhya, Protheus, SAP)</div>
            </div>
          </Card>
          <Card className="p-6 md:p-8 flex flex-col text-left border-stone-900 relative overflow-hidden" style={{ backgroundColor: '#1c1917' }} hover>
            <div className="pointer-events-none absolute inset-0 dot-grid-dark" aria-hidden />
            <div className="relative">
              <div className="text-xs font-medium uppercase tracking-wider text-stone-400">Garantia de resultado · Ano 1</div>
              <p className="mt-3 text-base md:text-lg font-medium leading-snug tracking-tight text-white text-left">
                Se em 12 meses não atingirmos <span className="text-brand-500 font-semibold">15% de ganho em disponibilidade</span>, devolvemos a mensalidade dos últimos 3 meses.
              </p>
              <div className="mt-5 pt-5 border-t border-white/10 text-xs text-stone-400 leading-relaxed text-left tabular-nums">
                Termo formal assinado junto ao contrato. Meta mensurada trimestralmente contra a linha de base capturada na Blitz (disponibilidade média atual: 68%).
              </div>
            </div>
          </Card>
        </div>
        <div className="mt-6 text-xs text-subink max-w-3xl leading-relaxed">
          <div className="font-medium text-ink mb-1.5">Condições comerciais</div>
          <ul className="space-y-1 text-muted">
            <li>• Contrato de 12 meses, renovação automática (cancelamento com 30 dias de aviso).</li>
            <li>• Reajuste IPCA anual.</li>
            <li>• Implantação e treinamento inclusos no ticket (sem custo de setup).</li>
            <li>• Faturamento mensal, vencimento dia 10.</li>
            <li>• POV já executado não é cobrado.</li>
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}

// ── Dark card ──
function DC({ children, className = '' }) {
  return <div className={`bg-white/[0.05] border border-white/10 rounded-xl ${className}`}>{children}</div>;
}

// ── SVG bar chart: Composição por tipo ──
function ComposicaoChart() {
  const sem = [
    { pernoite: 620, almoco: 90, eventual: 50 },
    { pernoite: 580, almoco: 85, eventual: 40 },
  ];
  const labels = ['Sem agente', 'Com agente'];
  const max = 1000;
  const h = 200;
  const bw = 80;
  const gap = 60;
  const ox = 50;
  const ticks = [0, 250, 500, 750, 1000];

  return (
    <svg viewBox={`0 0 ${ox + labels.length * (bw + gap)} ${h + 50}`} className="w-full" style={{ maxHeight: 280 }}>
      {ticks.map((t) => {
        const y = h - (t / max) * h;
        return (
          <React.Fragment key={t}>
            <line x1={ox} x2={ox + labels.length * (bw + gap) - gap} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
            <text x={ox - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#78716c">{t}</text>
          </React.Fragment>
        );
      })}
      {sem.map((s, i) => {
        const x = ox + i * (bw + gap);
        const ph = (s.pernoite / max) * h;
        const ah = (s.almoco / max) * h;
        const eh = (s.eventual / max) * h;
        return (
          <React.Fragment key={i}>
            <rect x={x} y={h - ph} width={bw} height={ph} rx={2} fill="#78716c" />
            <rect x={x} y={h - ph - ah} width={bw} height={ah} rx={0} fill="#059669" />
            <rect x={x} y={h - ph - ah - eh} width={bw} height={eh} rx={2} fill="#d97706" />
            <text x={x + bw / 2} y={h + 16} textAnchor="middle" className="text-[10px]" fill="#a8a29e">{labels[i]}</text>
          </React.Fragment>
        );
      })}
    </svg>
  );
}

// ── SVG line chart: Evolução semanal ──
function EvolucaoChart() {
  const semAgente = [780, 1850, 1780, 1650];
  const comAgente = [650, 1500, 1380, 1200];
  const weeks = [
    { label: 'Sem 1', sub: '12/03-15/03' },
    { label: 'Sem 2', sub: '16/03-22/03' },
    { label: 'Sem 3', sub: '23/03-29/03' },
    { label: 'Sem 4', sub: '30/03-05/04' },
  ];
  const max = 1800;
  const w = 500;
  const h = 220;
  const ox = 50;
  const oy = 10;
  const pw = (w - ox - 20) / (weeks.length - 1);
  const ticks = [0, 450, 900, 1350, 1800];
  const pt = (arr, i) => `${ox + i * pw},${oy + h - (arr[i] / max) * h}`;
  const line = (arr) => arr.map((_, i) => pt(arr, i)).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h + 75}`} className="w-full" style={{ maxHeight: 340 }}>
      {ticks.map((t) => {
        const y = oy + h - (t / max) * h;
        return (
          <React.Fragment key={t}>
            <line x1={ox} x2={w - 20} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
            <text x={ox - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#78716c">{t}h</text>
          </React.Fragment>
        );
      })}
      <polyline points={line(semAgente)} fill="none" stroke="#78716c" strokeWidth="2" strokeDasharray="6,4" />
      <polyline points={line(comAgente)} fill="none" stroke="#10b981" strokeWidth="2.5" />
      {semAgente.map((v, i) => (
        <circle key={`s${i}`} cx={ox + i * pw} cy={oy + h - (v / max) * h} r="4" fill="#1c1917" stroke="#78716c" strokeWidth="1.5" />
      ))}
      {comAgente.map((v, i) => (
        <circle key={`c${i}`} cx={ox + i * pw} cy={oy + h - (v / max) * h} r="4" fill="#1c1917" stroke="#10b981" strokeWidth="2" />
      ))}
      {weeks.map((wk, i) => (
        <React.Fragment key={i}>
          <text x={ox + i * pw} y={h + oy + 18} textAnchor="middle" className="text-[11px]" fill="#d6d3d1" fontWeight="500">{wk.label}</text>
          <text x={ox + i * pw} y={h + oy + 32} textAnchor="middle" className="text-[9px]" fill="#78716c">{wk.sub}</text>
        </React.Fragment>
      ))}
      {/* Legend */}
      <circle cx={ox + 40} cy={h + oy + 50} r="3" fill="none" stroke="#78716c" strokeWidth="1.5" />
      <text x={ox + 48} y={h + oy + 54} className="text-[10px]" fill="#a8a29e">Sem agente</text>
      <circle cx={ox + 140} cy={h + oy + 50} r="3" fill="none" stroke="#10b981" strokeWidth="2" />
      <text x={ox + 148} y={h + oy + 54} className="text-[10px]" fill="#a8a29e">Com agente</text>
    </svg>
  );
}

// ── Tab: Visão Geral ──
function AgenteVisaoGeral() {
  const [taxaCapt, setTaxaCapt] = useStateE(20);
  const [horasDia, setHorasDia] = useStateE(12);
  const [freteMedio, setFreteMedio] = useStateE(5000);
  const [valorHE, setValorHE] = useStateE(80);

  const horasCapt = Math.round(535.8 * (taxaCapt / 100));
  const diasRecup = (horasCapt / horasDia).toFixed(1);
  const fretesRecup = parseFloat(diasRecup);
  const receitaFretes = Math.round(fretesRecup * freteMedio);
  const economiaHE = horasCapt * valorHE;
  const totalCapt = receitaFretes + economiaHE;

  return (
    <div>
      {/* 1. Resultado acumulado */}
      <DC className="p-8 md:p-10 text-center mb-8">
        <div className="text-[11px] font-medium uppercase tracking-wider text-stone-400 mb-3">Resultado acumulado do teste</div>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl md:text-6xl font-semibold text-brand-500 tabular-nums tracking-tight">535.8</span>
          <span className="text-xl md:text-2xl text-brand-500/70 font-medium">horas</span>
        </div>
        <p className="mt-2 text-sm text-stone-400">economizadas em <span className="font-semibold text-white">1.614</span> ocorrências monitoradas</p>
        <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-center gap-3 text-sm text-stone-400 flex-wrap">
          <span>Pernoite (<span className="text-white">365</span> oc.)</span>
          <span className="text-stone-600">+</span>
          <span>Parada Almoço (<span className="text-white">823</span> oc.)</span>
          <span className="text-stone-600">+</span>
          <span>Parada Eventual (<span className="text-white">426</span> oc.)</span>
          <span className="text-stone-600">=</span>
          <span className="font-semibold text-brand-500 underline">535.8h</span>
        </div>
      </DC>

      {/* 2. Composição + Evolução */}
      <div className="grid md:grid-cols-[1fr_1.8fr] gap-4 mb-8">
        <DC className="p-5 md:p-6">
          <div className="text-sm font-semibold text-white mb-0.5">Composição por tipo de parada</div>
          <div className="text-xs text-stone-500 mb-4">Média acumulada por ocorrência</div>
          <ComposicaoChart />
          <div className="flex items-center gap-4 mt-3 text-[10px] text-stone-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#78716c' }} />Pernoite</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#059669' }} />Almoço</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#d97706' }} />Eventual</span>
          </div>
        </DC>
        <DC className="p-5 md:p-6">
          <div className="text-sm font-semibold text-white mb-0.5">Evolução semanal — horas excedidas</div>
          <div className="text-xs text-stone-500 mb-2">Total acumulado (Pernoite + Almoço + Eventual)</div>
          <EvolucaoChart />
        </DC>
      </div>

      {/* 3. Cards de tipo de parada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
        {[
          { tipo: 'Pernoite', oc: 365, antes: '12.4h', depois: '11.3h', red: '1.1h',
            iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg> },
          { tipo: 'Parada Almoço', oc: 823, antes: '65.2 min', depois: '61.6 min', red: '3.6 min',
            iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg> },
          { tipo: 'Parada Eventual', oc: 426, antes: '39.3 min', depois: '25.1 min', red: '14.2 min',
            iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
        ].map((p, i) => (
          <DC key={i} className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center text-white">{p.iconSvg}</span>
              <div>
                <div className="text-sm font-semibold text-white">{p.tipo}</div>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-base text-stone-500 tabular-nums">{p.antes}</span>
              <span className="text-brand-500">↓</span>
              <span className="text-2xl font-semibold text-brand-500 tabular-nums">{p.depois}</span>
            </div>
            <div className="text-xs text-brand-500 font-medium mb-1">↓ {p.red} por ocorrência</div>
            <div className="text-xs text-stone-500">{p.oc} apontamentos no período</div>
          </DC>
        ))}
      </div>

      {/* 4. Detalhamento da economia mensal */}
      <div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">Detalhamento da Economia Mensal</h3>
            <p className="text-sm text-stone-400">Ajuste os parâmetros para separar custo direto vs impacto operacional</p>
          </div>
        </div>

        {/* Inputs */}
        <DC className="p-5 md:p-6 mb-4">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-400">Taxa capturável:</span>
              <input type="number" value={taxaCapt} onChange={(e) => setTaxaCapt(Number(e.target.value))}
                className="w-16 px-2 py-1.5 border border-white/10 rounded-lg text-sm text-brand-500 text-center font-semibold tabular-nums bg-white/5" />
              <span className="text-sm text-stone-500">%</span>
            </div>
            <span className="text-stone-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-400">Horas trab./dia:</span>
              <input type="number" value={horasDia} onChange={(e) => setHorasDia(Number(e.target.value))}
                className="w-16 px-2 py-1.5 border border-white/10 rounded-lg text-sm text-white text-center font-semibold tabular-nums bg-white/5" />
              <span className="text-sm text-stone-500">h</span>
            </div>
          </div>
          <div className="mt-3 text-center text-sm text-stone-400">
            ≈ <span className="font-semibold text-white">{horasCapt}h</span> capturáveis · ≈ <span className="font-semibold text-white">{diasRecup} dias</span> de operação
          </div>
        </DC>

        {/* Fretes + Economia HE */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <DC className="p-5 md:p-6">
            <div className="text-sm font-semibold text-white mb-4">Fretes recuperados</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                <span className="text-stone-400">Frete médio</span>
                <div className="flex items-center gap-1">
                  <input type="number" value={freteMedio} onChange={(e) => setFreteMedio(Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-white/10 rounded-lg text-sm text-white text-right font-medium tabular-nums bg-white/5" />
                  <span className="text-xs text-stone-500">R$</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                <span className="text-stone-400">Dias de operação recuperados</span>
                <span className="font-medium text-brand-500 tabular-nums">{diasRecup} dias</span>
              </div>
              <div className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                <span className="text-stone-400">Fretes potenciais</span>
                <span className="font-medium text-white tabular-nums">{fretesRecup.toFixed(1)} fretes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">Receita potencial</span>
                <span className="font-semibold text-brand-500 tabular-nums">R$ {receitaFretes.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </DC>
          <DC className="p-5 md:p-6">
            <div className="text-sm font-semibold text-white mb-4">Economia direta (hora extra)</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                <span className="text-stone-400">Valor hora extra</span>
                <div className="flex items-center gap-1">
                  <input type="number" value={valorHE} onChange={(e) => setValorHE(Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-white/10 rounded-lg text-sm text-white text-right font-medium tabular-nums bg-white/5" />
                  <span className="text-xs text-stone-500">R$</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                <span className="text-stone-400">Horas HE evitadas</span>
                <span className="font-medium text-white tabular-nums">{horasCapt}h</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">Economia HE</span>
                <span className="font-semibold text-brand-500 tabular-nums">R$ {economiaHE.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </DC>
        </div>

        {/* Composição + Total */}
        <div className="grid md:grid-cols-2 gap-4">
          <DC className="p-5 md:p-6">
            <div className="text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-3">Composição mensal</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Economia direta (hora extra)</span>
                <span className="font-medium text-white tabular-nums">R$ {economiaHE.toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Potencial de receita (fretes)</span>
                <span className="font-medium text-white tabular-nums">R$ {receitaFretes.toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </DC>
          <div className="rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center bg-brand-600">
            <div className="text-[11px] font-medium uppercase tracking-wider text-white/70 mb-2">Total estimado capturável · mês</div>
            <div className="text-3xl md:text-4xl font-semibold text-white tabular-nums tracking-tight">R$ {totalCapt.toLocaleString('pt-BR')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal de apontamentos ──
function FaixaModal({ open, onClose, macro, faixa, qtd }) {
  const [search, setSearch] = useStateE('');
  if (!open) return null;

  // Generate sample data
  const placas = ['RVE4C91','SYX2H48','TER5J22','RUZ2D22','PZL6B97','QOC6H56','TCK9E16','RVC7A43','RUX8J83','PZL6B97','HNP3I88','CLJ9554','EVO6A62','BXC4F77'];
  const rows = Array.from({ length: Math.min(qtd, 20) }, (_, i) => {
    const p = placas[i % placas.length];
    const day = 12 + (i % 19);
    const month = '03';
    const hStart = 8 + (i % 6);
    const mStart = 10 + (i * 7) % 50;
    const durMin = macro === 'Pernoite' ? 665 + (i % 20) : (macro === 'Parada Almoço' ? 62 + (i % 8) : 28 + (i % 10));
    const hEnd = hStart + Math.floor(durMin / 60);
    const mEnd = (mStart + durMin) % 60;
    const durLabel = durMin >= 60 ? `${Math.floor(durMin/60)}h ${durMin%60}min` : `${durMin}min`;
    const exc = macro === 'Pernoite' ? (durMin - 660) : (macro === 'Parada Almoço' ? (durMin - 60) : (durMin - 25));
    const excLabel = exc > 0 ? `+${exc >= 60 ? (exc/60).toFixed(1) + 'h' : exc + ' min'}` : '—';
    return { placa: p, inicio: `${day}/${month}/2026 ${String(hStart).padStart(2,'0')}:${String(mStart).padStart(2,'0')}`, termino: `${day}/${month}/2026 ${String(hEnd).padStart(2,'0')}:${String(mEnd).padStart(2,'0')}`, duracao: durLabel, excedido: excLabel, excVal: exc };
  });

  const filtered = search ? rows.filter(r => r.placa.toLowerCase().includes(search.toLowerCase())) : rows;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden" style={{ backgroundColor: '#1c1917' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">{macro} — {faixa}</h3>
            <p className="text-sm text-stone-500 mt-0.5">{qtd} apontamentos</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-stone-500 hover:text-white transition">
            <IconX size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-2 border border-white/10 rounded-lg px-3 py-2 bg-white/5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar placa..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-white bg-transparent outline-none placeholder:text-stone-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ scrollbarColor: '#44403c #1c1917', scrollbarWidth: 'thin' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="py-2.5 font-semibold text-stone-300">Placa <span className="text-stone-600">↕</span></th>
                <th className="py-2.5 font-semibold text-stone-300">Início <span className="text-stone-600">↕</span></th>
                <th className="py-2.5 font-semibold text-stone-300">Término <span className="text-stone-600">↕</span></th>
                <th className="py-2.5 font-semibold text-stone-300">Duração <span className="text-stone-600">↓</span></th>
                <th className="py-2.5 font-semibold text-stone-300 text-right">Excedido <span className="text-stone-600">↕</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-b border-white/5 last:border-b-0">
                  <td className="py-2.5 placa font-medium text-white">{r.placa}</td>
                  <td className="py-2.5 text-stone-500 tabular-nums">{r.inicio}</td>
                  <td className="py-2.5 text-stone-500 tabular-nums">{r.termino}</td>
                  <td className="py-2.5 text-stone-300 tabular-nums">{r.duracao}</td>
                  <td className="py-2.5 text-right font-medium tabular-nums" style={{ color: r.excVal > 0 ? '#ef4444' : '#78716c' }}>{r.excedido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Por Macro ──
function AgentePorMacro() {
  const [modal, setModal] = useStateE(null);

  const macros = [
    {
      tipo: 'Pernoite', oc: 365,
      antes: '12.4h', depois: '11.3h', red: '1.1h', variacao: '-8.5%',
      iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>,
      faixas: [
        { faixa: '0–6h', qtd: 5, pct: '1.4%' },
        { faixa: '6–9h', qtd: 0, pct: '0%' },
        { faixa: '9–11h', qtd: 39, pct: '10.7%' },
        { faixa: '11h–11h15', qtd: 198, pct: '54.2%', limite: true },
        { faixa: '11h15–12h', qtd: 70, pct: '19.2%' },
        { faixa: '12–14h', qtd: 41, pct: '11.2%' },
        { faixa: '> 14h', qtd: 12, pct: '3.3%' },
      ],
    },
    {
      tipo: 'Parada Almoço', oc: 823,
      antes: '65.2 min', depois: '61.6 min', red: '3.6 min', variacao: '-5.5%',
      iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>,
      faixas: [
        { faixa: '0–15 min', qtd: 4, pct: '0.5%' },
        { faixa: '15–30 min', qtd: 4, pct: '0.5%' },
        { faixa: '30–45 min', qtd: 3, pct: '0.4%' },
        { faixa: '45–65 min', qtd: 716, pct: '87%', limite: true },
        { faixa: '65–80 min', qtd: 79, pct: '9.6%' },
        { faixa: '80–100 min', qtd: 10, pct: '1.2%' },
        { faixa: '100–120 min', qtd: 3, pct: '0.4%' },
        { faixa: '> 120 min', qtd: 4, pct: '0.5%' },
      ],
    },
    {
      tipo: 'Parada Eventual', oc: 426,
      antes: '39.3 min', depois: '25.1 min', red: '14.2 min', variacao: '-36.1%',
      iconSvg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      faixas: [
        { faixa: '0–10 min', qtd: 68, pct: '16.0%' },
        { faixa: '10–20 min', qtd: 142, pct: '33.3%' },
        { faixa: '20–30 min', qtd: 118, pct: '27.7%', limite: true },
        { faixa: '30–45 min', qtd: 58, pct: '13.6%' },
        { faixa: '45–60 min', qtd: 26, pct: '6.1%' },
        { faixa: '> 60 min', qtd: 14, pct: '3.3%' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {macros.map((m, mi) => (
        <DC key={mi} className="p-5 md:p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 rounded-full bg-brand-600/20 flex items-center justify-center text-white">{m.iconSvg}</span>
            <div>
              <div className="text-base font-semibold text-white">{m.tipo}</div>
              <div className="text-xs text-stone-500">{m.oc} ocorrências no período</div>
            </div>
          </div>

          {/* 4 mini-cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <div className="text-[10px] font-medium text-stone-500 uppercase tracking-wider mb-2">Antes</div>
              <div className="text-xl font-semibold text-stone-500 line-through tabular-nums">{m.antes}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <div className="text-[10px] font-medium text-stone-500 uppercase tracking-wider mb-2">Depois</div>
              <div className="text-xl font-semibold text-brand-500 tabular-nums">{m.depois}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
              <div className="text-[10px] font-medium text-stone-500 uppercase tracking-wider mb-2">Redução</div>
              <div className="text-xl font-semibold text-brand-500 tabular-nums">↓ {m.red}</div>
            </div>
            <div className="bg-brand-600/15 border border-brand-500/25 rounded-xl p-4">
              <div className="text-[10px] font-medium text-brand-500 uppercase tracking-wider mb-2">Variação</div>
              <div className="text-xl font-semibold text-brand-500 tabular-nums">{m.variacao}</div>
            </div>
          </div>

          {/* Distribuição de Durações */}
          <div className="text-sm font-semibold text-white mb-3">Distribuição de Durações</div>
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_120px] bg-white/[0.03] text-[10px] font-medium uppercase tracking-wider text-stone-500 border-b border-white/10">
              <div className="px-4 py-2.5">Faixa</div>
              <div className="px-4 py-2.5 text-center">Qtd</div>
              <div className="px-4 py-2.5 text-right">% do Total</div>
            </div>
            {m.faixas.map((f, fi) => (
              <div key={fi}
                onClick={() => f.qtd > 0 && setModal({ macro: m.tipo, faixa: f.faixa, qtd: f.qtd })}
                className={`grid grid-cols-[1fr_100px_120px] border-b last:border-b-0 border-white/5 items-center transition ${f.qtd > 0 ? 'cursor-pointer hover:bg-white/[0.04]' : ''} ${f.limite ? 'bg-amber-500/10' : ''}`}>
                <div className={`px-4 py-3 text-sm text-stone-300 flex items-center gap-2 ${f.limite ? 'border-l-2 border-amber-500' : 'border-l-2 border-transparent'}`}>
                  {f.faixa}
                  {f.limite && <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/20 px-1.5 py-0.5 rounded">Limite</span>}
                </div>
                <div className="px-4 py-3 text-sm text-white text-center tabular-nums">{f.qtd}</div>
                <div className="px-4 py-3 text-sm text-stone-400 text-right tabular-nums">{f.pct}</div>
              </div>
            ))}
          </div>
        </DC>
      ))}

      {/* Modal */}
      <FaixaModal
        open={!!modal}
        onClose={() => setModal(null)}
        macro={modal?.macro || ''}
        faixa={modal?.faixa || ''}
        qtd={modal?.qtd || 0}
      />
    </div>
  );
}

// ── Modal de placa (dark) ──
function PlacaModal({ open, onClose, placa, tipo, apts }) {
  const [search, setSearch] = useStateE('');
  if (!open) return null;

  const tipoLabel = tipo === 'almoco' ? 'Parada Almoço' : tipo === 'eventual' ? 'Parada Eventual' : tipo === 'pernoite' ? 'Pernoite' : 'Viagens';
  const baseMin = tipo === 'almoco' ? 60 : tipo === 'eventual' ? 25 : tipo === 'pernoite' ? 660 : 480;
  const rows = Array.from({ length: Math.min(apts, 20) }, (_, i) => {
    const day = 12 + (i % 24);
    const dayStr = String(day).padStart(2, '0');
    const month = day > 31 ? '04' : '03';
    const actualDay = day > 31 ? String(day - 31).padStart(2, '0') : dayStr;
    const hS = 8 + (i * 3) % 7;
    const mS = 10 + (i * 13) % 50;
    const dur = baseMin + 15 - i;
    const hE = hS + Math.floor(dur / 60);
    const mE = (mS + dur) % 60;
    const durLabel = dur >= 60 ? `${Math.floor(dur / 60)}h ${dur % 60}min` : `${dur}min`;
    const exc = dur - baseMin;
    const excLabel = exc > 0 ? `+${exc >= 60 ? (exc / 60).toFixed(1) + 'h' : exc + ' min'}` : '—';
    return {
      placa,
      inicio: `${actualDay}/${month}/2026 ${String(hS).padStart(2, '0')}:${String(mS).padStart(2, '0')}`,
      termino: `${actualDay}/${month}/2026 ${String(hE % 24).padStart(2, '0')}:${String(mE).padStart(2, '0')}`,
      duracao: durLabel,
      excedido: excLabel,
      excVal: exc,
    };
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden" style={{ backgroundColor: '#1c1917' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">{placa} — {tipoLabel}</h3>
            <p className="text-sm text-stone-500 mt-0.5">{apts} apontamentos</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-stone-500 hover:text-white transition">
            <IconX size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-2 border border-white/10 rounded-lg px-3 py-2 bg-white/5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Buscar placa..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-white bg-transparent outline-none placeholder:text-stone-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ scrollbarColor: '#44403c #1c1917', scrollbarWidth: 'thin' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="py-2.5 font-semibold text-stone-300">Placa <span className="text-stone-600">↕</span></th>
                <th className="py-2.5 font-semibold text-stone-300">Início <span className="text-stone-600">↕</span></th>
                <th className="py-2.5 font-semibold text-stone-300">Término <span className="text-stone-600">↕</span></th>
                <th className="py-2.5 font-semibold text-stone-300">Duração <span className="text-stone-600">↓</span></th>
                <th className="py-2.5 font-semibold text-stone-300 text-right">Excedido <span className="text-stone-600">↕</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-white/5 last:border-b-0">
                  <td className="py-2.5 placa font-medium text-white">{r.placa}</td>
                  <td className="py-2.5 text-stone-500 tabular-nums">{r.inicio}</td>
                  <td className="py-2.5 text-stone-500 tabular-nums">{r.termino}</td>
                  <td className="py-2.5 text-stone-300 tabular-nums">{r.duracao}</td>
                  <td className="py-2.5 text-right font-medium tabular-nums" style={{ color: r.excVal > 0 ? '#ef4444' : '#78716c' }}>{r.excedido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Por Placa ──
function AgentePorPlaca() {
  const [subTab, setSubTab] = useStateE('almoco');
  const [modal, setModal] = useStateE(null);

  const subTabs = [
    { key: 'almoco', label: 'Almoço' },
    { key: 'eventual', label: 'Eventual' },
    { key: 'pernoite', label: 'Pernoite' },
    { key: 'viagens', label: 'Viagens' },
  ];

  const fmt = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const placaData = {
    almoco: [
      { placa: 'RVN3D10', apts: 22, total: 1359.9, media: 61.8, best: true },
      { placa: 'RVE4C97', apts: 23, total: 1346.8, media: 58.6 },
      { placa: 'TCC8C18', apts: 21, total: 1316.2, media: 62.7 },
      { placa: 'PZL6B97', apts: 21, total: 1300.4, media: 61.9 },
      { placa: 'TDA1F91', apts: 21, total: 1247.5, media: 59.4 },
      { placa: 'RMT9G70', apts: 21, total: 1240.1, media: 59.1 },
      { placa: 'RUX8J83', apts: 16, total: 1239.2, media: 77.5 },
      { placa: 'RVQ5H68', apts: 18, total: 1194.9, media: 66.4 },
      { placa: 'TEQ4C67', apts: 20, total: 1193.3, media: 59.7 },
      { placa: 'SYX2H48', apts: 19, total: 1188.4, media: 62.5 },
      { placa: 'TCK9E16', apts: 20, total: 1183.8, media: 59.2 },
      { placa: 'QOC6H56', apts: 19, total: 1181.5, media: 62.2 },
    ],
    eventual: [
      { placa: 'FOK6909', apts: 28, total: 840.2, media: 30.0, best: true },
      { placa: 'FBW0992', apts: 25, total: 725.0, media: 29.0 },
      { placa: 'CLJ9613', apts: 22, total: 616.0, media: 28.0 },
      { placa: 'TJE4H15', apts: 20, total: 540.0, media: 27.0 },
      { placa: 'CLJ9482', apts: 18, total: 468.0, media: 26.0 },
      { placa: 'RVN3D10', apts: 16, total: 400.0, media: 25.0 },
      { placa: 'PZL6B97', apts: 15, total: 360.0, media: 24.0 },
      { placa: 'TDA1F91', apts: 14, total: 322.0, media: 23.0 },
    ],
    pernoite: [
      { placa: 'GEK3632', apts: 24, total: 264.0, media: 11.0, best: true },
      { placa: 'CLJ9505', apts: 22, total: 248.6, media: 11.3 },
      { placa: 'CLJ9456', apts: 20, total: 230.0, media: 11.5 },
      { placa: 'CLJ9539', apts: 19, total: 224.2, media: 11.8 },
      { placa: 'DHL5B96', apts: 18, total: 219.6, media: 12.2 },
      { placa: 'RVE4C97', apts: 17, total: 212.5, media: 12.5 },
      { placa: 'TCC8C18', apts: 16, total: 204.8, media: 12.8 },
    ],
    viagens: [
      { placa: 'CLJ9531', apts: 56, total: 33600.0, media: 600.0, best: true },
      { placa: 'CLJ9635', apts: 48, total: 30720.0, media: 640.0 },
      { placa: 'FJX2F65', apts: 44, total: 29920.0, media: 680.0 },
      { placa: 'CLJ9F80', apts: 40, total: 28400.0, media: 710.0 },
      { placa: 'RVN3D10', apts: 38, total: 27360.0, media: 720.0 },
      { placa: 'SYX2H48', apts: 35, total: 25900.0, media: 740.0 },
    ],
  };

  const rows = placaData[subTab] || [];

  return (
    <div>
      {/* Sub-tabs pill */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar flex-nowrap">
        {subTabs.map((t) => (
          <button key={t.key} onClick={() => setSubTab(t.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${subTab === t.key ? 'bg-brand-600 text-white' : 'bg-transparent border border-white/15 text-stone-400 hover:text-white hover:border-white/30'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <DC className="overflow-hidden">
        <div className="overflow-x-auto">
        <div className="grid grid-cols-[50px_1fr_1fr_1fr_1fr_40px] bg-white/[0.03] text-[10px] font-medium uppercase tracking-wider text-stone-500 border-b border-white/10" style={{ minWidth: 550 }}>
          <div className="px-4 py-3">#</div>
          <div className="px-4 py-3">Placa</div>
          <div className="px-4 py-3 text-right">Apontamentos</div>
          <div className="px-4 py-3 text-right">Total (min)</div>
          <div className="px-4 py-3 text-right">Média (min)</div>
          <div className="px-4 py-3"></div>
        </div>
        {rows.map((r, i) => (
          <div key={i}
            onClick={() => setModal({ placa: r.placa, tipo: subTab, apts: r.apts })}
            className={`grid grid-cols-[50px_1fr_1fr_1fr_1fr_40px] border-b last:border-b-0 border-white/5 items-center cursor-pointer transition hover:bg-white/[0.04] ${r.best ? 'bg-brand-600/10' : ''}`} style={{ minWidth: 550 }}>
            <div className="px-4 py-3.5 text-sm text-stone-500 tabular-nums">{i + 1}</div>
            <div className="px-4 py-3.5 flex items-center gap-2">
              <span className="placa text-sm font-medium text-white">{r.placa}</span>
              {r.best && <span className="text-[9px] font-semibold uppercase tracking-wider text-white bg-brand-600 px-2 py-0.5 rounded">Melhor</span>}
            </div>
            <div className="px-4 py-3.5 text-sm text-stone-300 text-right tabular-nums">{r.apts}</div>
            <div className="px-4 py-3.5 text-sm text-stone-300 text-right tabular-nums">{fmt(r.total)}</div>
            <div className="px-4 py-3.5 text-sm text-white text-right tabular-nums font-medium">{fmt(r.media)}</div>
            <div className="px-4 py-3.5 text-stone-600">
              <IconChevRight size={14} strokeWidth={1.5} />
            </div>
          </div>
        ))}
        </div>
      </DC>

      {/* Modal */}
      <PlacaModal
        open={!!modal}
        onClose={() => setModal(null)}
        placa={modal?.placa || ''}
        tipo={modal?.tipo || ''}
        apts={modal?.apts || 0}
      />
    </div>
  );
}

// ── Agent team data for organogram (by pilar) ──
const AGENT_PILARES = [
  {
    key: 'D', label: 'Disponibilidade',
    borderColor: 'border-brand-500/25', bgColor: 'bg-brand-500/[0.06]', labelColor: 'text-brand-500',
    agents: [
      { id: 'marco', name: 'Marco', role: 'Monitor de Disponibilidade', avatar: 'assets/agentes/avatar-marco.png' },
    ],
  },
  {
    key: 'M', label: 'Manutenção',
    borderColor: 'border-blue-500/15', bgColor: 'bg-blue-500/[0.04]', labelColor: 'text-blue-300',
    agents: [
      { id: 'bia',   name: 'Bia',   role: 'Manut. Preventiva',  avatar: 'assets/agentes/avatar-bia.png' },
      { id: 'vitor', name: 'Vitor', role: 'Auditor de Manut.',   avatar: 'assets/agentes/avatar-vitor.png' },
      { id: 'leo',   name: 'Léo',   role: 'Corretiva Ext.',      avatar: 'assets/agentes/avatar-leo.png' },
      { id: 'fred',  name: 'Fred',  role: 'Conciliação de NF',   avatar: 'assets/agentes/avatar-fred.png' },
    ],
  },
  {
    key: 'A', label: 'Aquisição',
    borderColor: 'border-amber-500/15', bgColor: 'bg-amber-500/[0.04]', labelColor: 'text-amber-300',
    agents: [
      { id: 'nico', name: 'Nico', role: 'Gestor de Estoque',  avatar: 'assets/agentes/avatar-nico.png' },
      { id: 'zeca', name: 'Zeca', role: 'Compras e Neg.',      avatar: 'assets/agentes/avatar-zeca.png' },
      { id: 'bino', name: 'Bino', role: 'Aprov. de Orçam.',    avatar: 'assets/agentes/avatar-bino.png' },
    ],
  },
  {
    key: 'X', label: 'Cross D · M · A',
    borderColor: 'border-rose-500/20', bgColor: 'bg-rose-500/[0.04]', labelColor: 'text-rose-300',
    agents: [
      { id: 'clara', name: 'Clara', role: 'Conformidade de Processo', avatar: 'assets/agentes/avatar-clara.png' },
    ],
  },
];

// Active agent IDs (agents already in operation)
const ACTIVE_AGENTS = ['marco'];

function AgentCard({ a, isHighlighted, showcase }) {
  const isActive = ACTIVE_AGENTS.includes(a.id);

  if (showcase) {
    // In showcase mode: active agents full color, inactive ones dimmed + grayscale + dashed border
    return (
      <div className={`relative rounded-xl p-2.5 flex flex-col items-center text-center transition-all shrink-0 ${
        isActive
          ? 'bg-white/[0.08] border border-brand-500/30 shadow-[0_0_16px_rgba(16,185,129,0.12)]'
          : 'bg-white/[0.03] border border-dashed border-white/10'
      }`} style={{ width: 80 }}>
        <div className={`w-11 h-11 rounded-full overflow-hidden mb-1.5 ${isActive ? 'ring-2 ring-brand-500 ring-offset-1 ring-offset-[#1c1917]' : ''}`}>
          <img src={a.avatar} alt={a.name} className="w-full h-full object-cover" />
        </div>
        <div className="text-[11px] font-semibold leading-tight text-white">{a.name}</div>
        <div className="text-[8px] leading-tight mt-0.5 text-stone-300">{a.role}</div>
        {isActive && (
          <div className="mt-1.5 text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-brand-500/20 text-white flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-brand-400" />Em operação
          </div>
        )}
        {!isActive && (
          <div className="mt-1.5 text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/5 text-stone-300 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full border border-stone-400" />Em construção
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative rounded-xl p-2.5 flex flex-col items-center text-center transition-all shrink-0 ${
      isHighlighted
        ? 'bg-white/[0.08] border border-brand-500/40 shadow-[0_0_24px_rgba(16,185,129,0.18)]'
        : 'bg-white/[0.03] border border-white/5 opacity-40'
    }`} style={{ width: 80 }}>
      <div className={`relative w-11 h-11 rounded-full overflow-hidden mb-1.5 ${isHighlighted ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-[#1c1917]' : ''}`}>
        <img src={a.avatar} alt={a.name} className="w-full h-full object-cover" />
      </div>
      <div className={`text-[11px] font-semibold leading-tight ${isHighlighted ? 'text-white' : 'text-stone-500'}`}>{a.name}</div>
      <div className={`text-[8px] leading-tight mt-0.5 ${isHighlighted ? 'text-stone-400' : 'text-stone-600'}`}>{a.role}</div>
      {isHighlighted && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
          <IconCheck size={10} strokeWidth={2.5} className="text-white" />
        </div>
      )}
    </div>
  );
}

function AgentTeamOrganogram({ highlightId, showcase }) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-[420px]">
      {AGENT_PILARES.map((pilar) => {
        const activeCount = showcase ? pilar.agents.filter(a => ACTIVE_AGENTS.includes(a.id)).length : 0;
        const totalCount = pilar.agents.length;
        return (
          <div key={pilar.key}
            className={`rounded-xl border ${pilar.borderColor} ${pilar.bgColor} p-3`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`text-[10px] font-bold uppercase tracking-[0.15em] ${pilar.labelColor}`}>
                {pilar.key} · {pilar.label}
              </div>
              {showcase && (
                <span className={`text-[8px] font-medium tabular-nums ${activeCount > 0 ? 'text-brand-500' : 'text-stone-500'}`}>
                  {activeCount}/{totalCount} {totalCount === 1 ? 'ativo' : 'ativos'}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {pilar.agents.map((a) => (
                <AgentCard key={a.id} a={a} isHighlighted={a.id === highlightId} showcase={showcase} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Reusable Agent Cover (two-column layout) ──
function AgenteCover({ eyebrow, title, titleAccent, subtitle, description, highlights, ctaLabel, onClickCta, secondaryCtaLabel, secondaryCtaHref, period, highlightAgent, onBack, backLabel, showcase, soloAgent }) {
  return (
    <div className="py-10 md:py-16">
      {onBack && (
        <Reveal>
          <button onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-white transition mb-8">
            <IconChevLeft size={14} strokeWidth={1.5} />
            {backLabel || 'Voltar'}
          </button>
        </Reveal>
      )}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[60vh]">
      {/* Left column — text content */}
      <div className="flex flex-col">
        <Reveal>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500 mb-5">{eyebrow}</div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-white mb-4">
            {title} <span className="text-brand-500">{titleAccent}</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-base md:text-lg text-stone-300 leading-relaxed mb-6">{subtitle}</p>
        </Reveal>
        <Reveal delay={180}>
          <p className="text-sm text-stone-400 leading-relaxed mb-8">{description}</p>
        </Reveal>
        <Reveal delay={240}>
          <div className="space-y-3 mb-10">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-brand-600/20 flex items-center justify-center text-brand-500 shrink-0 mt-0.5">{h.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-white">{h.label}</div>
                  <div className="text-xs text-stone-400 leading-relaxed">{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={300}>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={onClickCta}
              className="inline-flex items-center gap-2.5 bg-brand-600 hover:bg-brand-700 text-white text-base font-semibold px-8 py-4 rounded-xl transition shadow-lg shadow-brand-600/25">
              {ctaLabel}
              <IconArrowRight size={18} strokeWidth={2} />
            </button>
            {secondaryCtaLabel && secondaryCtaHref && (
              <a href={secondaryCtaHref} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-white text-base font-medium px-8 py-4 rounded-xl transition hover:bg-white/5">
                {secondaryCtaLabel}
                <IconExternal size={16} strokeWidth={1.5} />
              </a>
            )}
          </div>
        </Reveal>
        {period && (
          <Reveal delay={360}>
            <p className="mt-4 text-xs text-stone-600">{period}</p>
          </Reveal>
        )}
      </div>

      {/* Right column */}
      <Reveal delay={200}>
        <div className="flex items-center justify-center">
          {soloAgent ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-brand-500 ring-offset-4 ring-offset-[#1c1917] shadow-[0_0_40px_rgba(16,185,129,0.2)] mb-5">
                <img src={soloAgent.avatar} alt={soloAgent.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-white mb-1">{soloAgent.name}</div>
              <div className="text-sm text-stone-400">{soloAgent.role}</div>
              <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-brand-500/25 border border-brand-500/40 text-white">
                Pilar D · Disponibilidade
              </div>
            </div>
          ) : (
            <AgentTeamOrganogram highlightId={highlightAgent} showcase={showcase} />
          )}
        </div>
      </Reveal>
    </div>
    </div>
  );
}

// ── Main Agent Section ──
function AgenteCTA() {
  const [view, setView] = useStateE('team'); // 'team' | 'cover' | 'results'
  const [tab, setTab] = useStateE('visao');
  const tabs = [
    { key: 'visao', label: 'Visão Geral' },
    { key: 'macro', label: 'Por Macro' },
    { key: 'placa', label: 'Por Placa' },
  ];

  const scrollToTop = () => {
    const el = document.getElementById('agente');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goTo = (v) => { setView(v); scrollToTop(); };

  return (
    <section id="agente" className="scroll-mt-20 px-5 md:px-8 py-12 md:py-16" style={{ backgroundColor: '#1c1917' }}>
      <div className="max-w-6xl mx-auto">

        {/* Nível 1 — Capa institucional do Time Rabbot */}
        {view === 'team' && (
          <AgenteCover
            eyebrow="Time Rabbot · Em construção"
            title="Estamos construindo o time que vai"
            titleAccent="rodar sua operação inteira."
            subtitle="9 agentes de IA, 3 pilares, 1 operação coordenada. O primeiro agente já está em campo. Os próximos vêm aí."
            description="O Time Rabbot é a nossa visão para gestão de frota: 9 agentes especialistas organizados em 3 pilares — Disponibilidade, Manutenção e Aquisição — mais 1 agente cross de conformidade. Quando completo, vai cobrir as 6 jornadas da frota 24/7, equivalendo a 9 FTEs por uma fração do custo. Estamos construindo esse time agente por agente, em parceria com nossos clientes. Hoje, o Agente de Disponibilidade já está em operação na Rodojacto, entregando resultado real."
            highlights={[
              { label: '1 já em campo', desc: 'Agente de Disponibilidade, em operação na Rodojacto', icon: <IconCheck size={18} strokeWidth={1.5} /> },
              { label: '8 em construção', desc: 'Manutenção, Aquisição e Cross no roadmap ativo', icon: <IconWrench size={18} strokeWidth={1.5} /> },
              { label: 'Construído com clientes', desc: 'Cada agente nasce de uma operação real', icon: <IconUsers size={18} strokeWidth={1.5} /> },
            ]}
            ctaLabel="Conhecer o agente que já está em operação"
            onClickCta={() => goTo('cover')}
            showcase
          />
        )}

        {/* Nível 2 — Capa do Agente de Disponibilidade */}
        {view === 'cover' && (
          <AgenteCover
            eyebrow="Agente 1 · Disponibilidade"
            title="Agente de"
            titleAccent="Disponibilidade"
            subtitle="Monitora as macros da frota em tempo real e aciona motorista, gestores e torre de controle no WhatsApp quando algum processo atrasa."
            description="Cada minuto que um veículo fica parado além do esperado é receita perdida. O Agente de Disponibilidade acompanha as macros de todos os caminhões 24/7 e, no momento em que um processo passa do tempo previsto, aciona automaticamente os envolvidos: motorista no WhatsApp, gestores e torre de controle — antes que o atraso vire prejuízo."
            highlights={[
              { label: 'Lê as macros em tempo real', desc: 'Acompanha cada caminhão da frota 24/7', icon: <IconChart size={18} strokeWidth={1.5} /> },
              { label: 'Detecta atrasos nos processos', desc: 'Identifica quando algo passa do tempo previsto', icon: <IconAlert size={18} strokeWidth={1.5} /> },
              { label: 'Aciona quem precisa agir', desc: 'Motorista no WhatsApp, gestores e torre de controle', icon: <IconMessage size={18} strokeWidth={1.5} /> },
            ]}
            ctaLabel="Ver resultados"
            onClickCta={() => goTo('results')}
            secondaryCtaLabel="Ver agente"
            secondaryCtaHref="https://rabbot-agent-rodojacto.lovable.app/"
            period="Período do teste: 12/03/2026 a 05/04/2026 · Rodojacto"
            onBack={() => goTo('team')}
            backLabel="Voltar para Time Rabbot"
            soloAgent={{ name: 'Marco', role: 'Monitor de Disponibilidade', avatar: 'assets/agentes/avatar-marco.png' }}
          />
        )}

        {/* Nível 3 — Resultados */}
        {view === 'results' && (
          <div>
            <div className="mb-8">
              <button onClick={() => goTo('cover')}
                className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-white transition mb-6">
                <IconChevLeft size={14} strokeWidth={1.5} />
                Sobre o agente
              </button>
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-[1.15] text-white">
                    Agente de <span className="text-brand-500">Disponibilidade</span>
                  </h2>
                  <p className="mt-2 text-sm text-stone-400">12/03/2026 a 05/04/2026 · Rodojacto</p>
                </div>
                <a href="https://rabbot-agent-rodojacto.lovable.app/" target="_blank" rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
                  Abrir Agente
                  <IconArrowRight size={14} strokeWidth={1.5} />
                </a>
              </div>
            </div>

            <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-5 py-2.5 text-sm font-medium transition border-b-2 -mb-px whitespace-nowrap ${tab === t.key ? 'border-brand-500 text-white' : 'border-transparent text-stone-500 hover:text-stone-300'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'visao' && <AgenteVisaoGeral />}
            {tab === 'macro' && <AgentePorMacro />}
            {tab === 'placa' && <AgentePorPlaca />}
          </div>
        )}

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-5 md:px-8 py-8 text-white" style={{ backgroundColor: '#1c1917' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="text-white"><Logo /></span>
        <div className="text-xs text-stone-500 tabular-nums">Emitido em 24/04/2026 · Responsável: {CLIENT.responsavel}</div>
      </div>
    </footer>
  );
}

Object.assign(window, { InvestimentoSection, AgenteCTA, Footer });
