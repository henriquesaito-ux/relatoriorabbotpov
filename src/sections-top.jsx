// Nav, Hero, Blitz, Diagnóstico, Curva de Maturidade
const { useState: useStateT, useEffect: useEffectT, useRef: useRefT, useMemo: useMemoT } = React;

const NAV_ITEMS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'diagnostico', label: 'Diagnóstico' },
  { id: 'blitz', label: 'Blitz' },
  { id: 'checklists', label: 'Checklists' },
  { id: 'antes-depois', label: 'Antes × Depois' },
  { id: 'agente', label: 'Agente IA' },
];

function Nav() {
  const [progress, setProgress] = useStateT(0);
  const [scrolled, setScrolled] = useStateT(false);
  const [dark, setDark] = useStateT(false);
  const [mobileOpen, setMobileOpen] = useStateT(false);
  const navRef = useRefT(null);

  useEffectT(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
      setScrolled(h.scrollTop > 8);

      // Detect if nav overlaps a dark section
      const nav = navRef.current;
      if (nav) {
        const navRect = nav.getBoundingClientRect();
        const navMid = navRect.top + navRect.height / 2;
        const darkEl = document.getElementById('agente');
        if (darkEl) {
          const r = darkEl.getBoundingClientRect();
          setDark(navMid >= r.top && navMid <= r.bottom);
        } else {
          setDark(false);
        }
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bgClass = dark
    ? (scrolled ? 'bg-[#1c1917]/90 border-b border-white/10' : 'bg-[#1c1917]/70')
    : (scrolled ? 'bg-white/85 border-b border-stone-200/70' : 'bg-white/60');
  const textClass = dark ? 'text-stone-300' : 'text-subink';
  const textHover = dark ? 'hover:text-white hover:bg-white/10' : 'hover:text-ink hover:bg-stone-100';
  const logoClass = dark ? 'text-white' : '';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[60] bg-transparent">
        <div className="h-full bg-brand-600 transition-[width]" style={{ width: `${progress}%` }} />
      </div>
      <nav ref={navRef} className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${bgClass}`}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
          <a href="#top" className={`shrink-0 ${logoClass}`}><Logo /></a>
          <div className="hidden lg:flex items-center gap-0.5 text-[13px]">
            {NAV_ITEMS.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={`px-2.5 py-1.5 rounded-md transition ${textClass} ${textHover}`}>{n.label}</a>
            ))}
          </div>
          <button className={`lg:hidden p-2 -mr-2 ${dark ? 'text-white' : 'text-ink'}`} onClick={() => setMobileOpen(v => !v)} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
        {mobileOpen && (
          <div className={`lg:hidden border-t ${dark ? 'border-white/10 bg-[#1c1917]' : 'border-stone-200/70 bg-white'}`}>
            <div className="px-5 py-2 flex flex-col">
              {NAV_ITEMS.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setMobileOpen(false)} className={`px-2 py-2.5 text-sm border-b last:border-b-0 ${dark ? 'text-stone-300 hover:text-white border-white/5' : 'text-subink hover:text-ink border-stone-100'}`}>{n.label}</a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

function Lightbox({ open, onClose, src, caption }) {
  useEffectT(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', onKey); }
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-stone-900/90 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <button className="absolute top-6 right-6 text-white/70 hover:text-white p-2" onClick={onClose} aria-label="Fechar"><IconX size={20} strokeWidth={1.5} /></button>
      <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="rounded-lg relative overflow-hidden bg-stone-900" style={{ aspectRatio: '4/3' }}>
          <img src={src} alt={caption} className="absolute inset-0 w-full h-full object-contain" />
        </div>
        <p className="text-white/70 text-sm mt-4 text-center">{caption}</p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative px-5 md:px-8 pt-10 md:pt-14 pb-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] dot-grid-hero" aria-hidden />
      <div className="relative max-w-6xl mx-auto">
        <Reveal>
          <div className="text-xs font-medium uppercase tracking-wider text-muted mb-3">Relatório operacional</div>
          <div className="flex items-start justify-between gap-6">
            <h1 className="text-3xl md:text-4xl leading-[1.1] tracking-tight font-semibold text-ink">
              Sua operação sob uma nova perspectiva
            </h1>
            <img src="assets/rodojacto-logo.png" alt="Rodojacto" className="h-8 md:h-10 w-auto shrink-0 mt-1" />
          </div>
          <p className="mt-3 text-sm text-subink tabular-nums">
            {CLIENT.periodStart} a {CLIENT.periodEnd} · {CLIENT.city}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function BlitzSection() {
  const [lb, setLb] = useStateT(null);
  const photos = [
    { src: 'assets/blitz-03.jpeg', cap: 'Pátio Oriente — tour inicial' },
    { src: 'assets/blitz-02.jpeg', cap: 'Filial Rodojacto' },
    { src: 'assets/blitz-01.jpeg', cap: 'Equipe Rodojacto + Rabbot' },
    { src: 'assets/blitz-04.png', cap: 'Equipe Rabbot no pátio' },
  ];
  const cards = [
    { label: 'Data', value: CLIENT.blitzDate, icon: <IconCalendar size={14} strokeWidth={1.5} /> },
    { label: 'Cliente', value: CLIENT.name, icon: <IconMapPin size={14} strokeWidth={1.5} /> },
    { label: 'Responsável Rabbot', value: CLIENT.responsavel, icon: <IconUser size={14} strokeWidth={1.5} /> },
    { label: 'Participantes', value: `${CLIENT.participantes}`, icon: <IconUsers size={14} strokeWidth={1.5} /> },
  ];
  return (
    <Section id="blitz">
      <SectionHeader
        title={<span className="flex items-center gap-2 flex-wrap">Blitz concluída <Pill tone="brand" icon={<IconCheck size={12} strokeWidth={1.5} />}>Concluída</Pill></span>}
        subtitle="Um dia completo dentro da operação da Rodojacto para mapear processos, dores e definir os KPIs do POV."
      />
      <Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {cards.map((c, i) => (
            <div key={i} className="card-grad border border-stone-200/70 rounded-xl p-4 card-hover">
              <div className="flex items-center gap-1.5 text-muted text-xs font-medium uppercase tracking-wider">
                {c.icon}{c.label}
              </div>
              <div className="mt-2 text-base font-semibold text-ink tracking-tight">{c.value}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <button key={i} onClick={() => setLb(p)}
                    className="group relative rounded-lg overflow-hidden border border-stone-200/70 hover:border-stone-400 transition"
                    style={{ aspectRatio: '4/3' }}
                    title={p.cap}>
              <img src={p.src} alt={p.cap} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1.5">
          {photos.map((p, i) => (
            <div key={i} className="text-[10px] text-muted text-center truncate">{p.cap}</div>
          ))}
        </div>
      </Reveal>

      <Lightbox open={!!lb} onClose={() => setLb(null)} src={lb?.src} caption={lb?.cap} />

      <Reveal delay={120}>
        <Card grad className="mt-6 p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm font-semibold text-ink tracking-tight">Timeline do dia</div>
            <div className="text-xs font-mono text-muted tabular-nums">14/04/2026</div>
          </div>
          <div className="relative">
            <div className="absolute top-[3px] left-1 right-1 h-px bg-stone-200" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 relative">
              {TIMELINE.map((t, i) => (
                <div key={i} className="relative">
                  <div className="w-2 h-2 rounded-full bg-white border border-brand-600 relative z-10" />
                  <div className="mt-3">
                    <div className="text-xs font-mono text-stone-500 tabular-nums">{t.time}</div>
                    <div className="text-sm font-medium text-ink mt-0.5 tracking-tight">{t.label}</div>
                    <div className="text-xs text-subink mt-1 leading-relaxed">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-6">
          <div className="text-sm font-semibold text-ink mb-4">Equipe presente</div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {TEAM.map((p, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <Avatar name={p.name} size={40} />
                <div className="text-xs font-medium text-ink mt-2.5 leading-tight">{p.name}</div>
                <div className="text-[11px] text-muted mt-0.5 leading-tight">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

// ── Benchmark bar component ──
function BenchmarkBar({ label, value, valueLabel, rangeMin, rangeMax, scaleMax, ticks, unit, color }) {
  const colors = {
    green:  { marker: 'bg-stone-700', range: 'bg-stone-200', pill: 'bg-stone-700' },
    coral:  { marker: 'bg-stone-500', range: 'bg-stone-200/70', pill: 'bg-stone-500' },
    blue:   { marker: 'bg-stone-600', range: 'bg-stone-200/50', pill: 'bg-stone-600' },
  };
  const c = colors[color] || colors.blue;
  const pct = (v) => (v / scaleMax) * 100;

  return (
    <div className="mb-6 last:mb-0">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-xs text-muted">Média do mercado: {unit === 'R$' ? `R$ ${rangeMin.toLocaleString('pt-BR')}` : `${rangeMin}%`} – {unit === 'R$' ? `R$ ${rangeMax.toLocaleString('pt-BR')}` : `${rangeMax}%`}</span>
      </div>
      {/* Bar */}
      <div className="relative h-10 rounded-lg bg-stone-100 overflow-hidden">
        {/* Market range */}
        <div className={`absolute top-0 bottom-0 ${c.range} rounded`} style={{ left: `${pct(rangeMin)}%`, width: `${pct(rangeMax) - pct(rangeMin)}%` }} />
        {/* Rodojacto marker */}
        <div className="absolute top-0 bottom-0 flex items-center" style={{ left: `${pct(value)}%`, transform: 'translateX(-50%)' }}>
          <div className={`w-1 h-full ${c.marker}`} />
        </div>
        {/* Pill */}
        <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${pct(value)}%`, transform: 'translateX(-50%) translateY(-50%)' }}>
          <span className={`${c.pill} text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm whitespace-nowrap`}>
            {valueLabel}
          </span>
        </div>
      </div>
      {/* Ticks */}
      <div className="relative h-4 mt-1">
        {ticks.map((t, i) => (
          <div key={i} className="absolute flex flex-col items-center" style={{ left: `${pct(t)}%`, transform: 'translateX(-50%)' }}>
            <div className="w-px h-1.5 bg-stone-300" />
            <span className="text-[9px] text-muted tabular-nums mt-0.5">{unit === 'R$' ? `${(t/1000).toFixed(0)}k` : `${t}%`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagSection() {
  const radarData = DIAG.map(d => ({ label: d.dim, value: d.level }));
  const levelTone = (l) => l <= 2 ? 'amber' : l === 3 ? 'brand' : 'brand';
  const markerPct = 78;

  return (
    <Section id="diagnostico" className="bg-white border-y border-stone-200/70">
      <SectionHeader title="Diagnóstico" subtitle="Análise completa da operação da Rodojacto — indicadores comparados ao mercado e maturidade técnica." />

      {/* ── Bloco 1: Diagnóstico da operação ── */}
      <Reveal>
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-ink tracking-tight mb-1">Diagnóstico da sua operação</h3>
          <p className="text-sm text-subink mb-6">Indicadores-chave da Rodojacto comparados à média de mercado.</p>
          <Card grad className="p-5 md:p-6">
            <BenchmarkBar
              label="Taxa de utilização"
              value={56} valueLabel="56%"
              rangeMin={30} rangeMax={75}
              scaleMax={100}
              ticks={[0,10,20,30,40,50,60,70,80,90,100]}
              unit="%" color="green"
            />
            <BenchmarkBar
              label="Mix manutenção"
              value={30} valueLabel="30%"
              rangeMin={10} rangeMax={80}
              scaleMax={100}
              ticks={[0,10,20,30,40,50,60,70,80,90,100]}
              unit="%" color="coral"
            />
            <BenchmarkBar
              label="Custo manutenção"
              value={4000} valueLabel="R$ 4.0k"
              rangeMin={500} rangeMax={5500}
              scaleMax={6000}
              ticks={[0,1000,2000,3000,4000,5000,6000]}
              unit="R$" color="blue"
            />
          </Card>
        </div>
      </Reveal>

      {/* ── Bloco 2: Distribuição do tempo da frota ── */}
      <Reveal delay={60}>
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-ink tracking-tight mb-1">Distribuição do tempo da frota</h3>
          <p className="text-sm text-subink mb-6">Onde o tempo da operação realmente acontece, em % do total.</p>
          <Card grad className="p-5 md:p-6">
            {/* Stacked bar */}
            <div className="flex rounded-xl overflow-hidden" style={{ height: 64 }}>
              {[
                { label: 'Rota', value: 56, bg: '#047857', text: 'text-white' },
                { label: 'Manutenção', value: 18, bg: '#78716c', text: 'text-white' },
                { label: 'Pátio', value: 14, bg: '#a8a29e', text: 'text-white' },
                { label: 'Cliente', value: 7, bg: '#c8c5c0', text: 'text-stone-700' },
                { label: 'Espera', value: 5, bg: '#d6d3d1', text: 'text-stone-700' },
              ].map((s, i) => (
                <div key={i} className={`flex flex-col items-center justify-center overflow-hidden px-1 ${s.text}`} style={{ width: `${s.value}%`, background: s.bg }}>
                  <span className="text-[10px] font-medium leading-tight">{s.label}</span>
                  <span className="text-[11px] font-semibold leading-tight">{s.value}%</span>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
              {[
                { label: 'Rota', value: 56, color: '#047857' },
                { label: 'Manutenção', value: 18, color: '#78716c' },
                { label: 'Pátio', value: 14, color: '#a8a29e' },
                { label: 'Cliente', value: 7, color: '#c8c5c0' },
                { label: 'Espera', value: 5, color: '#d6d3d1' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-subink">{s.label}</span>
                  <span className="text-xs font-medium text-ink tabular-nums">{s.value}%</span>
                </div>
              ))}
            </div>
            {/* Insights */}
            <div className="mt-5 pt-5 border-t border-stone-200/70 space-y-2">
              <div className="flex items-start gap-2 text-sm text-subink leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#047857' }} />
                <span><span className="font-medium text-ink">56% em rota</span> — frota produtiva mais da metade do tempo, dentro do esperado para o setor</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-subink leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-500 mt-1.5 shrink-0" />
                <span><span className="font-medium text-ink">18% em manutenção</span> — quase 1 em cada 5 dias parado; principal alvo de redução</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-subink leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                <span><span className="font-medium text-ink">14% em pátio + 5% em espera</span> — 19% do tempo em ociosidade não produtiva, oportunidade clara</span>
              </div>
            </div>
          </Card>
        </div>
      </Reveal>

      {/* ── Bloco 3: Maturidade técnica ── */}
      <Reveal delay={100}>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-ink tracking-tight mb-1">Maturidade técnica</h3>
          <p className="text-sm text-subink mb-6">Avaliação em 4 dimensões, com base no que observamos durante a Blitz e nas entrevistas com a liderança.</p>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-6 items-stretch mb-10">
        <Reveal delay={120} className="flex">
          <Card className="p-5 md:p-6 flex flex-col justify-center w-full">
            <RadarChart data={radarData} />
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-600/80"/>Situação atual</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border border-stone-200/70"/>Escala 1–5</span>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={200} className="flex">
          <div className="border border-stone-200/70 rounded-xl overflow-hidden bg-white flex flex-col w-full">
            <div className="grid grid-cols-[1fr_72px] md:grid-cols-[1.3fr_80px_2fr] bg-stone-50 border-b border-stone-200/70 text-[11px] font-medium uppercase tracking-wider text-muted">
              <div className="px-4 py-2.5">Dimensão</div>
              <div className="px-4 py-2.5">Nível</div>
              <div className="hidden md:block px-4 py-2.5">Situação</div>
            </div>
            <div className="flex-1 flex flex-col">
              {DIAG.map((d, i) => (
                <div key={i} className="grid grid-cols-[1fr_72px] md:grid-cols-[1.3fr_80px_2fr] border-b last:border-b-0 border-stone-100 items-center flex-1">
                  <div className="px-4 py-3.5 text-sm font-medium text-ink">{d.dim}</div>
                  <div className="px-4 py-3.5">
                    <Pill tone={levelTone(d.level)}>{d.level}/5</Pill>
                  </div>
                  <div className="hidden md:block px-4 py-3.5 text-sm text-subink">{d.status}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Bloco 3: Curva de maturidade ── */}
      <Reveal delay={250}>
        <Card className="p-5 md:p-8">
          <div className="text-sm font-semibold text-ink mb-5">Curva de maturidade operacional</div>
          <div className="relative mb-4">
            <div className="flex h-10 rounded-lg overflow-hidden border border-stone-200/70">
              {PHASES.map((p, i) => {
                const bg = ['bg-stone-100', 'bg-brand-50', 'bg-brand-100', 'bg-brand-200/80'][i];
                const fg = ['text-stone-700', 'text-brand-800', 'text-brand-800', 'text-brand-900'][i];
                return (
                  <div key={p.key} className={`${bg} ${fg} flex items-center justify-center text-xs font-medium border-r last:border-r-0 border-white`} style={{ width: `${p.pct}%` }}>
                    {p.pct}%
                  </div>
                );
              })}
            </div>
            <div className="absolute -top-2 -bottom-2 flex flex-col items-center" style={{ left: `calc(${markerPct}% - 44px)`, width: 88 }}>
              <div className="text-[10px] font-medium uppercase tracking-wider text-brand-700 whitespace-nowrap bg-white px-2 py-0.5 rounded border border-brand-200">Você está aqui</div>
              <div className="w-px flex-1 bg-brand-600 mt-1" />
              <div className="w-2 h-2 rounded-full bg-brand-600 ring-4 ring-white -mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
            {PHASES.map((p, i) => {
              const active = i === 1;
              return (
                <div key={p.key} className={`p-4 rounded-xl border ${active ? 'border-brand-600 bg-brand-50/40' : 'border-stone-200/70 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted">{p.sub}</div>
                    {active && <Pill tone="brand">Atual</Pill>}
                  </div>
                  <div className="mt-1.5 text-base font-semibold text-ink">{p.title}</div>
                  <div className="mt-1.5 text-xs text-subink leading-relaxed">{p.desc}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-6 border-t border-stone-200/70 text-center">
            <p className="text-sm text-subink">
              Você está em <span className="font-semibold text-ink">Adaptativo</span>. Meta: <span className="font-semibold text-brand-600">Proativo</span> em 90 dias.
            </p>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}

// MaturidadeSection kept as alias for backwards compat in presentation mode
function MaturidadeSection() { return null; }

function SobreSection() {
  const CLIENTS_LIST = [
    'ABC Cargas', 'Brasilweb', 'Contatto', 'Coca-Cola Andina',
    'Grupo Petrópolis', 'Gerdau', 'Imediato Nexway', 'Tegma',
    'Brasspress', 'TransBen', 'Bora Transportes',
  ];
  return (
    <Section id="sobre" className="bg-white border-y border-stone-200/70">
      <SectionHeader
        title="Por que a Rabbot está aqui"
        subtitle="Cada hora parado custa caro. É isso que resolvemos para as maiores transportadoras do Brasil."
      />

      {/* Grid: texto + foto */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-stretch mb-8">
        <div>
          {/* Texto narrativo */}
          <Reveal>
            <div className="space-y-4 text-sm text-subink leading-relaxed mb-8">
              <p>
                Operações de transporte ainda vivem no improviso — WhatsApp como sistema, planilhas como fonte da verdade, pátio sem rastro digital. A Rabbot existe pra mudar isso: digitalizamos o pátio, conectamos checklists, ordens de serviço e indicadores num só lugar.
              </p>
              <p>
                A Blitz é como começamos toda parceria: um dia inteiro dentro da operação do cliente, mapeando o real antes de propor qualquer coisa.
              </p>
            </div>
          </Reveal>

          {/* Frota e operação — 2 cards */}
          <Reveal delay={80}>
            <div className="grid grid-cols-2 gap-3">
              <div className="card-grad border border-stone-200/70 rounded-xl p-4 card-hover">
                <div className="flex items-center gap-1.5 text-muted text-xs font-medium uppercase tracking-wider">Frota gerida</div>
                <div className="mt-2 text-base font-semibold text-ink tracking-tight">60K+</div>
                <div className="mt-1 text-xs text-subink">Caminhões</div>
              </div>
              <div className="card-grad border border-stone-200/70 rounded-xl p-4 card-hover">
                <div className="flex items-center gap-1.5 text-muted text-xs font-medium uppercase tracking-wider">Operação</div>
                <div className="mt-2 text-base font-semibold text-ink tracking-tight">8 anos</div>
                <div className="mt-1 text-xs text-subink">no mercado</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Foto da operação */}
        <Reveal delay={120} className="h-full">
          <div className="rounded-xl overflow-hidden border border-stone-200/70 h-full">
            <img src="assets/blitz-01.jpeg" alt="Equipe Rodojacto + Rabbot" className="w-full h-full object-cover" />
          </div>
        </Reveal>
      </div>

      {/* Resultados que geramos — 3 cards */}
      <Reveal delay={160}>
        <div className="text-sm font-semibold text-ink mb-4">Resultados que geramos</div>
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { value: '+10%', label: 'Disponibilidade do ativo' },
            { value: '-15%', label: 'Manutenções corretivas' },
            { value: '-6%', label: 'Redução de custo em peças' },
          ].map((r, i) => (
            <div key={i} className="card-grad border border-stone-200/70 rounded-xl p-5 card-hover text-center">
              <div className="text-2xl font-semibold text-brand-700 tracking-tight">{r.value}</div>
              <div className="mt-1.5 text-xs text-subink">{r.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Quem confia na Rabbot */}
      <Reveal delay={240}>
        <div className="text-sm font-semibold text-ink mb-5">Quem confia na Rabbot</div>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {CLIENTS_LIST.map((name, i) => (
            <span key={i} className="text-sm font-medium text-stone-400 whitespace-nowrap">{name}</span>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

Object.assign(window, { Nav, Hero, BlitzSection, DiagSection, MaturidadeSection, SobreSection });
