// Nav, Hero, Blitz, Diagnóstico, Curva de Maturidade
const { useState: useStateT, useEffect: useEffectT, useRef: useRefT, useMemo: useMemoT } = React;

const NAV_ITEMS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'diagnostico', label: 'Diagnóstico' },
  { id: 'blitz', label: 'Blitz' },
  { id: 'checklists', label: 'Dados coletados' },
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
            {CLIENT.city}
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
        subtitle="Um dia de piloto dentro da operação da Rodojacto — com implantação e teste da plataforma Rabbot para mapear processos, identificar dores e provar impacto e retorno na prática."
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
            <div className="text-xs font-mono text-muted tabular-nums">{CLIENT.blitzDate}</div>
          </div>
          <div className="relative">
            <div className="absolute top-[3px] left-1 right-1 h-px bg-stone-200" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5 relative">
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


  return (
    <Section id="diagnostico" className="bg-white border-y border-stone-200/70">
      <SectionHeader title="Diagnóstico" />

      {/* ── Maturidade técnica ── */}
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
        <Card className="p-6 md:p-10">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-base md:text-lg font-semibold text-ink tracking-tight">Maturidade de Gestão Operacional</h3>
            <p className="text-xs text-muted mt-0.5">Rumo a uma gestão exponencial</p>
          </div>

          {/* Badge "Você está aqui" */}
          {/* Barra segmentada — alinhada ao grid de 4 cards */}
          <div className="hidden lg:grid grid-cols-4 gap-2 mb-4" role="group" aria-label="Distribuição por fase de maturidade">
            {[
              { pct: 70, cols: 1 },
              { pct: 20, cols: 2, active: true },
              { pct: 10, cols: 1 },
            ].map((seg, i) => (
              <div
                key={i}
                className={`flex items-center justify-center h-10 text-xs font-medium rounded-lg ${
                  seg.active
                    ? 'bg-ink text-white'
                    : 'bg-stone-100 text-stone-500 border border-stone-200/70'
                }`}
                style={{ gridColumn: `span ${seg.cols}` }}
                role="meter"
                aria-label={`${seg.pct}%`}
                aria-valuenow={seg.pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {seg.pct}%
              </div>
            ))}
          </div>
          {/* Mobile bar */}
          <div className="flex lg:hidden gap-2 mb-4" role="group" aria-label="Distribuição por fase de maturidade">
            {[
              { pct: 70 },
              { pct: 20, active: true },
              { pct: 10 },
            ].map((seg, i) => (
              <div
                key={i}
                className={`flex items-center justify-center h-10 text-xs font-medium rounded-lg ${
                  seg.active
                    ? 'bg-ink text-white flex-[2]'
                    : 'bg-stone-100 text-stone-500 border border-stone-200/70 flex-1'
                }`}
              >
                {seg.pct}%
              </div>
            ))}
          </div>

          {/* Badge "Você está aqui" sobre o card Proativo */}
          <div className="flex justify-center mb-3">
            <div className="bg-brand-600 text-white text-[10px] font-medium tracking-wide px-3 py-1 rounded-full whitespace-nowrap" role="status" aria-label="Fase atual: Proativo">
              Você está aqui
            </div>
          </div>

          {/* Cards das fases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PHASES.map((p, i) => {
              const isActive = i === 2;
              return (
                <div key={p.key} className={`p-4 rounded-xl border ${isActive ? 'border-brand-500/60 bg-brand-50/20' : 'border-stone-200/70 bg-white'}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted">{p.sub}</div>
                    {isActive && <span className="text-[10px] font-medium text-brand-600">Atual</span>}
                  </div>
                  <div className="text-sm font-semibold text-ink mb-1.5">{p.title}</div>
                  <div className="text-xs text-subink leading-relaxed">{p.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Rodapé com meta */}
          <div className="mt-8 pt-6 border-t border-stone-200/70 text-center">
            <p className="text-sm text-subink">
              <span className="font-semibold text-ink">Meta:</span> Avançar da gestão <span className="font-semibold text-ink">Proativa</span> para uma operação <span className="font-semibold text-brand-600">Preditiva</span>, automatizada e integrada.
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
  const CLIENTS_WITH_LOGO = [
    { name: 'ABC Cargas', logo: 'assets/logos/abccargas.png' },
    { name: 'Brasilweb', logo: 'assets/logos/brasilweb-logo.png', h: 16 },
    { name: 'Contatto', logo: 'assets/logos/contatto.png?v=2', h: 22 },
    { name: 'Coca-Cola Andina', logo: 'assets/logos/cocacola.png', h: 54 },
    { name: 'Grupo Petrópolis', logo: 'assets/logos/grupopetropolis.png', h: 30 },
    { name: 'Gerdau', logo: 'assets/logos/gerdau-logo.png', h: 54 },
    { name: 'Imediato Nexway', logo: 'assets/logos/imediato.png?v=2' },
    { name: 'Tegma', logo: 'assets/logos/tegma.png?v=2' },
    { name: 'Brasspress', logo: 'assets/logos/braspress.png', h: 54 },
    { name: 'TransBen', logo: 'assets/logos/transben.png?v=2', h: 22 },
    { name: 'Bora Transportes', logo: 'assets/logos/bora.png', h: 54 },
    { name: 'PepsiCo', logo: 'assets/logos/pepsico-logo.png', h: 54 },
    { name: 'Bauminas', logo: 'assets/logos/bauminas-logo.png', h: 54 },
  ];
  const CLIENTS_TEXT = [];
  return (
    <Section id="sobre" className="bg-white border-y border-stone-200/70">
      {/* ── Bloco institucional ── */}
      <Reveal>
        <div className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-4">Quem é a Rabbot</div>
        <h2 className="text-2xl md:text-3xl font-bold text-ink leading-tight tracking-tight mb-4">A Rabbot nasceu pra manter os caminhões do Brasil rodando.</h2>
        <p className="text-sm text-subink leading-relaxed">
          <strong className="text-ink">60 mil caminhões</strong> na plataforma · <strong className="text-ink">8 anos</strong> de operação · <strong className="text-ink">Bradesco</strong> entre os investidores
        </p>
      </Reveal>

      {/* ── As 3 doenças crônicas ── */}
      <Reveal delay={80}>
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mt-10 mb-4">As 3 doenças crônicas do transporte rodoviário</div>
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            {
              tag: 'D · Disponibilidade',
              tagColor: 'text-red-600',
              title: 'Veículo parado é receita perdida.',
              desc: 'Transportadoras não enxergam, em tempo real, quais veículos estão parados, há quanto tempo, ou se dá pra contar com eles no próximo planejamento de carga.',
            },
            {
              tag: 'M · Manutenção',
              tagColor: 'text-red-600',
              title: '90% ainda no papel e no WhatsApp.',
              desc: 'Mesmo com ERP, TMS e rastreador, a operação acontece em planilha, grupo do WhatsApp e checklist no papel. Sem fonte da verdade.',
            },
            {
              tag: 'A · Aquisição de Peças',
              tagColor: 'text-red-600',
              title: 'Peça errada paralisa o caminhão.',
              desc: 'Tempo aguardando peça é o maior ofensor da manutenção. Compra errada ou atraso multiplica o tempo de veículo parado.',
            },
          ].map((d, i) => (
            <div key={i} className="border border-stone-200/70 rounded-xl p-5 bg-white">
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${d.tagColor}`}>{d.tag}</div>
              <div className="text-sm font-semibold text-ink mb-2">{d.title}</div>
              <p className="text-xs text-subink leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── Quanto isso custa hoje ── */}
      <Reveal delay={120}>
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted mb-4">Quanto isso custa hoje na sua operação</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { tag: 'D · Disponibilidade', value: 'R$ 1.500/dia', sub: 'caminhão parado' },
            { tag: 'M · Manutenção', value: '3 a 6 dias', sub: 'do problema à liberação' },
            { tag: 'M · Manutenção', value: '3× mais caro', sub: 'preventiva vira corretiva' },
            { tag: 'A · Peças', value: '+15%', sub: 'na compra sem competitividade' },
            { tag: 'A · Almoxarifado', value: '20% diverg.', sub: 'estoque registrado vs real' },
          ].map((c, i) => (
            <div key={i} className="border border-red-200 bg-red-50/50 rounded-xl p-4 text-center">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted mb-1.5">{c.tag}</div>
              <div className="text-lg md:text-xl font-bold text-ink tracking-tight">{c.value}</div>
              <div className="mt-1 text-[11px] text-subink">{c.sub}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── Com Rabbot — resultados ── */}
      <Reveal delay={160}>
        <div className="rounded-xl bg-brand-50 border border-brand-200 px-6 py-4 flex flex-wrap items-center justify-center gap-6 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Com Rabbot</span>
          <span className="h-5 w-px bg-brand-200 hidden sm:block" />
          {[
            { value: '+10%', label: 'disponibilidade' },
            { value: '−15%', label: 'corretivas' },
            { value: '−6%', label: 'custo peças' },
          ].map((r, i) => (
            <div key={i} className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-brand-700">{r.value}</span>
              <span className="text-xs text-brand-600">{r.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── Quem roda com a Rabbot ── */}
      <Reveal delay={200}>
        <div className="text-sm font-semibold text-ink mb-5">Quem roda com a Rabbot</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '24px 32px', alignItems: 'center', justifyItems: 'center' }}>
          {CLIENTS_WITH_LOGO.map((c, i) => (
            <div key={`logo-${i}`} style={{ width: '100%', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={c.logo} alt={c.name} style={{ maxHeight: (c.h || 32) + 'px', width: 'auto', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── Parceiros e Investidores ── */}
      <Reveal delay={260}>
        <div className="text-sm font-semibold text-ink mb-5 mt-10">Parceiros e Investidores</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '24px 32px', alignItems: 'center', justifyItems: 'center' }}>
          {[
            { name: 'Exame', logo: 'assets/logos/exame.png', h: 22 },
            { name: 'ScaleUp Endeavor', logo: 'assets/logos/scaleup-endeavor.png', h: 22 },
            { name: 'Tegup Ventures', logo: 'assets/logos/tegup-ventures.png', h: 22 },
            { name: 'Labs', logo: 'assets/logos/labs.png', h: 22 },
            { name: 'Valor', logo: 'assets/logos/valor.png', h: 22 },
            { name: 'Bradesco', logo: 'assets/logos/bradesco.png' },
          ].map((c, i) => (
            <div key={i} style={{ width: '100%', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={c.logo} alt={c.name} style={{ maxHeight: (c.h || 32) + 'px', width: 'auto', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── Case Braspress ── */}
      <Reveal delay={320}>
        <div className="mt-12 rounded-2xl bg-stone-50 border border-stone-200/70 overflow-hidden">
          <div className="grid lg:grid-cols-2 items-stretch">
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-stone-400">Case de sucesso</div>
                <img src="assets/logos/braspress.png" alt="Braspress" style={{ height: 42, width: 'auto', objectFit: 'contain' }} />
              </div>
              <h3 className="text-lg font-bold text-ink leading-snug mb-4">Como a Braspress ganhou controle total da frota</h3>
              <p className="text-sm text-subink leading-relaxed mb-2">
                A Braspress, uma das maiores transportadoras de encomendas do Brasil, enfrentava desafios com a gestão de pátio e visibilidade da operação em tempo real. Com a Rabbot, a empresa digitalizou seus processos de checklist e manutenção, centralizou informações e ganhou controle total sobre a frota.
              </p>
              <p className="text-sm text-subink leading-relaxed mb-4">
                O resultado: mais disponibilidade dos veículos, redução de custos com manutenções corretivas e uma operação que finalmente fala a mesma língua — do pátio à diretoria.
              </p>
              <p className="text-xs text-muted">Assista à demonstração ao lado e veja como a transformação aconteceu na prática.</p>
            </div>
            <div className="bg-black min-h-[280px] lg:min-h-0">
              <video className="w-full h-full object-cover" controls preload="metadata">
                <source src="assets/braspressvideo.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos HTML5.
              </video>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Ponte para o diagnóstico ── */}
      <Reveal delay={380}>
        <div className="mt-12 rounded-xl bg-stone-50 border border-stone-200/70 px-6 py-5 text-center">
          <p className="text-sm text-subink leading-relaxed">
            Estamos aqui justamente porque <strong className="text-ink">identificamos esses mesmos problemas na operação de vocês</strong>. A seguir, o diagnóstico completo que levantamos durante a Blitz.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

Object.assign(window, { Nav, Hero, BlitzSection, DiagSection, MaturidadeSection, SobreSection });
