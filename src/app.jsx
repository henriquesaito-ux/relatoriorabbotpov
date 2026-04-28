const { useState: useStateApp, useEffect: useEffectApp, useCallback: useCallbackApp, useRef: useRefApp } = React;

// ═══════════════════════════════════════════════
//  SlideReveal — staggered entrance per element
// ═══════════════════════════════════════════════
function SlideReveal({ children, delay = 0, active = true, className = '' }) {
  const ref = useRefApp(null);
  const [shown, setShown] = useStateApp(false);

  useEffectApp(() => {
    if (!active) { setShown(false); return; }
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  return (
    <div
      ref={ref}
      className={`slide-el ${shown ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// SlideCountUp — counter that fires when slide becomes active
function SlideCountUp({ value, active, prefix = '', suffix = '', className = '' }) {
  const [val, setVal] = useStateApp(0);
  const hasRun = useRefApp(false);

  useEffectApp(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;
    const start = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(value * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  useEffectApp(() => {
    if (!active) { hasRun.current = false; setVal(0); }
  }, [active]);

  return <span className={className}>{prefix}{val.toLocaleString('pt-BR')}{suffix}</span>;
}

// ═══════════════════════════════════════════════
//  Shared slide primitives
// ═══════════════════════════════════════════════

function SlideShell({ children, bg = 'bg-white', className = '' }) {
  return (
    <div className={`flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-14 md:py-20 ${bg} text-ink ${className}`}>
      <div className="max-w-5xl w-full mx-auto">{children}</div>
    </div>
  );
}

function SlideEyebrow({ children, active, delay = 0 }) {
  return (
    <SlideReveal active={active} delay={delay}>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-10 bg-brand-600" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-700">{children}</span>
      </div>
    </SlideReveal>
  );
}

function SlideTitle({ children, active, delay = 80 }) {
  return (
    <SlideReveal active={active} delay={delay}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.08] text-ink mb-10">
        {children}
      </h2>
    </SlideReveal>
  );
}

function GlassCard({ children, className = '' }) {
  return (
    <div className={`glass-strong rounded-2xl ${className}`}>{children}</div>
  );
}

// ═══════════════════════════════════════════════
//  SLIDES — all light theme
// ═══════════════════════════════════════════════

// ── Slide 0: Cover ──
function SlideCover({ active }) {
  return (
    <div className="flex-1 flex relative overflow-hidden">
      {/* ── LEFT SIDE ── */}
      <div className="flex flex-col justify-between relative" style={{ flex: '0 0 50%', background: '#fafaf7' }}>
        {/* Logos — top, larger */}
        <div style={{ padding: '40px 48px 0 80px' }}>
          <SlideReveal active={active} delay={0}>
            <div className="flex items-center gap-5">
              <Logo className="[&_svg]:w-[160px] [&_svg]:h-auto" />
              <span className="w-px" style={{ height: 28, background: '#c8c7c2' }} />
              <img src="assets/rodojacto-logo.png" alt="Rodojacto" className="w-auto" style={{ height: 40 }} />
            </div>
          </SlideReveal>
        </div>

        {/* Center block — vertically centered */}
        <div style={{ padding: '0 48px 0 80px' }}>
          {/* Accent bar + eyebrow */}
          <SlideReveal active={active} delay={100}>
            <div className="mb-5">
              <span className="block rounded-full mb-4" style={{ width: 32, height: 3, background: '#1D9E75' }} />
              <span className="font-medium uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: '#1D9E75' }}>Blitz Operacional</span>
            </div>
          </SlideReveal>

          {/* Title */}
          <SlideReveal active={active} delay={220}>
            <h1 className="font-semibold" style={{ fontSize: 48, lineHeight: 1.05, letterSpacing: '-0.025em', color: '#1a1a18' }}>
              Sua operação sob uma<br />nova perspectiva
            </h1>
          </SlideReveal>

          {/* Location & period */}
          <SlideReveal active={active} delay={360}>
            <div className="mt-6 flex flex-col gap-0.5" style={{ fontSize: 14, color: '#5F5E5A' }}>
              <span>{CLIENT.city}</span>
              <span>14 a 28 de abril, 2026</span>
            </div>
          </SlideReveal>
        </div>

        {/* Footer — bottom */}
        <div style={{ padding: '0 48px 32px 80px' }}>
          <SlideReveal active={active} delay={500}>
            <div className="flex flex-col gap-0.5" style={{ fontSize: 10, color: '#888780' }}>
              <span>{CLIENT.responsavel} · Account Executive</span>
              <span>Emitido em 24/04/2026</span>
            </div>
          </SlideReveal>
        </div>
      </div>

      {/* ── RIGHT SIDE: photo bleeding to edges ── */}
      <div className="relative" style={{ flex: '0 0 50%' }}>
        <SlideReveal active={active} delay={150} className="h-full">
          <img
            src="assets/blitz-01.jpeg"
            alt="Equipe Rodojacto + Rabbot"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '55% 45%' }}
          />
        </SlideReveal>
      </div>
    </div>
  );
}

// ── Slide 1: Agenda ──
function SlideAgenda({ active }) {
  const items = [
    { num: '01', title: 'A Rabbot', desc: 'Quem somos e como ajudamos operações de transporte a evoluir.' },
    { num: '02', title: 'Retornos operacionais', desc: 'O que mudou na sua operação após a Blitz — processos, dados e rotina.' },
    { num: '03', title: 'Retornos financeiros', desc: 'Economia gerada, projeção de ROI e impacto no custo por placa.' },
    { num: '04', title: 'Proposta comercial', desc: 'Investimento, condições e garantia de resultado.' },
  ];
  return (
    <SlideShell bg="bg-bg">
      <SlideEyebrow active={active}>Agenda</SlideEyebrow>
      <SlideTitle active={active}>O que vamos apresentar</SlideTitle>

      <div className="grid md:grid-cols-2 gap-5">
        {items.map((item, i) => (
          <SlideReveal key={i} active={active} delay={200 + i * 120}>
            <GlassCard className="p-6 flex items-start gap-5 h-full">
              <span className="text-3xl font-bold text-brand-600/20 tabular-nums leading-none mt-0.5">{item.num}</span>
              <div>
                <div className="text-base font-semibold text-ink tracking-tight">{item.title}</div>
                <p className="text-sm text-subink mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </GlassCard>
          </SlideReveal>
        ))}
      </div>
    </SlideShell>
  );
}

// ── Slide 2: Blitz ──
function SlideBlitz({ active }) {
  const cards = [
    { label: 'Data', value: CLIENT.blitzDate, icon: <IconCalendar size={15} strokeWidth={1.5} className="text-brand-600" /> },
    { label: 'Cliente', value: CLIENT.name, icon: <IconMapPin size={15} strokeWidth={1.5} className="text-brand-600" /> },
    { label: 'Responsável', value: CLIENT.responsavel, icon: <IconUser size={15} strokeWidth={1.5} className="text-brand-600" /> },
    { label: 'Participantes', value: `${CLIENT.participantes} pessoas`, icon: <IconUsers size={15} strokeWidth={1.5} className="text-brand-600" /> },
  ];
  return (
    <SlideShell bg="bg-bg">
      <SlideEyebrow active={active}>Blitz concluída</SlideEyebrow>
      <SlideTitle active={active}>Um dia dentro da<br />operação da {CLIENT.name}</SlideTitle>

      <SlideReveal active={active} delay={200}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((c, i) => (
            <GlassCard key={i} className="p-5">
              <div className="flex items-center gap-2 text-muted text-xs font-medium uppercase tracking-wider mb-2">{c.icon}{c.label}</div>
              <div className="text-lg font-semibold text-ink tracking-tight">{c.value}</div>
            </GlassCard>
          ))}
        </div>
      </SlideReveal>

      <SlideReveal active={active} delay={350}>
        <GlassCard className="p-6 md:p-7">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-5">Timeline do dia</div>
          <div className="relative">
            <div className="absolute top-[5px] left-2 right-2 h-px bg-brand-200" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
              {TIMELINE.map((t, i) => (
                <div key={i}>
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-brand-600 relative z-10 shadow-sm" />
                  <div className="mt-3">
                    <div className="text-xs font-mono text-muted tabular-nums">{t.time}</div>
                    <div className="text-sm font-semibold text-ink mt-0.5">{t.label}</div>
                    <div className="text-xs text-subink mt-1 leading-relaxed">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </SlideReveal>
    </SlideShell>
  );
}

// ── Slide 2: Diagnóstico ──
function SlideDiag({ active }) {
  const radarData = DIAG.map(d => ({ label: d.dim, value: d.level }));
  const levelTone = (l) => l <= 2 ? 'amber' : 'brand';
  return (
    <SlideShell bg="bg-white">
      <SlideEyebrow active={active}>Diagnóstico</SlideEyebrow>
      <SlideTitle active={active}>Maturidade operacional</SlideTitle>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <SlideReveal active={active} delay={200}>
          <GlassCard className="p-6">
            <RadarChart data={radarData} />
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-600/80"/>Atual</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border border-stone-200"/>Escala 1–5</span>
            </div>
          </GlassCard>
        </SlideReveal>
        <SlideReveal active={active} delay={350}>
          <div className="space-y-3">
            {DIAG.map((d, i) => (
              <GlassCard key={i} className="p-5 flex items-start gap-4">
                <div className="shrink-0 mt-0.5"><Pill tone={levelTone(d.level)}>{d.level}/5</Pill></div>
                <div>
                  <div className="text-sm font-semibold text-ink">{d.dim}</div>
                  <div className="text-xs text-subink mt-1 leading-relaxed">{d.status}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </SlideReveal>
      </div>
    </SlideShell>
  );
}

// ── Slide 3: Maturidade ──
function SlideMaturidade({ active }) {
  const markerPct = 78;
  return (
    <SlideShell bg="bg-bg">
      <SlideEyebrow active={active}>Curva de maturidade</SlideEyebrow>
      <SlideTitle active={active}>Rumo a uma gestão<br />exponencial</SlideTitle>

      <SlideReveal active={active} delay={200}>
        <div className="relative mb-6">
          <div className="flex h-12 rounded-2xl overflow-hidden border border-stone-200/70 shadow-sm">
            {PHASES.map((p, i) => {
              const bg = ['bg-stone-100', 'bg-brand-50', 'bg-brand-100', 'bg-brand-200/80'][i];
              const fg = ['text-stone-600', 'text-brand-800', 'text-brand-800', 'text-brand-900'][i];
              return (
                <div key={p.key} className={`${bg} ${fg} flex items-center justify-center text-xs font-semibold border-r last:border-r-0 border-white/60`} style={{ width: `${p.pct}%` }}>
                  {p.pct >= 15 && <span>{p.title}</span>}
                </div>
              );
            })}
          </div>
          <div className="absolute -top-3 -bottom-3 flex flex-col items-center" style={{ left: `calc(${markerPct}% - 44px)`, width: 88 }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-700 whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-brand-200 shadow-sm">Você está aqui</div>
            <div className="w-px flex-1 bg-brand-600 mt-1" />
            <div className="w-3 h-3 rounded-full bg-brand-600 ring-4 ring-white shadow -mt-1" />
          </div>
        </div>
      </SlideReveal>

      <SlideReveal active={active} delay={400}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
          {PHASES.map((p, i) => {
            const isActive = i === 1;
            return (
              <GlassCard key={p.key} className={`p-5 ${isActive ? '!border-brand-500 !bg-brand-50/60 ring-1 ring-brand-200' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{p.sub}</span>
                  {isActive && <Pill tone="brand">Atual</Pill>}
                </div>
                <div className="text-base font-semibold text-ink">{p.title}</div>
                <div className="mt-1.5 text-xs text-subink leading-relaxed">{p.desc}</div>
              </GlassCard>
            );
          })}
        </div>
      </SlideReveal>

      <SlideReveal active={active} delay={550}>
        <div className="mt-8 text-center">
          <p className="text-sm text-subink">
            Meta: sair de <span className="font-semibold text-ink">Adaptativo</span> para <span className="font-semibold text-brand-600">Proativo</span> em 90 dias.
          </p>
        </div>
      </SlideReveal>
    </SlideShell>
  );
}

// ── Slide 4: Checklists ──
function SlideChecklists({ active }) {
  return (
    <SlideShell bg="bg-white">
      <SlideEyebrow active={active}>Checklists & Kanban</SlideEyebrow>
      <SlideReveal active={active} delay={80}>
        <div className="flex items-baseline gap-4 mb-10">
          <span className="text-5xl md:text-6xl lg:text-7xl font-semibold text-ink tabular-nums tracking-tight">
            <SlideCountUp value={84} active={active} />
          </span>
          <span className="text-xl md:text-2xl text-subink font-medium">checklists preenchidos</span>
        </div>
      </SlideReveal>

      <SlideReveal active={active} delay={250}>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {CHECKLIST_SAMPLE.slice(0, 3).map((c, i) => (
            <GlassCard key={i} className="overflow-hidden">
              <div className="ph-stripe h-14 border-b border-stone-200/40 flex items-center justify-center">
                <span className="font-mono text-[10px] uppercase text-stone-500 bg-white/90 px-1.5 py-0.5 rounded">{c.plate}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="placa text-xs font-medium text-ink bg-stone-100/80 px-1.5 py-0.5 rounded">{c.code}</span>
                  <Pill tone={c.type === 'Entrada' ? 'brand' : 'blue'}>{c.type}</Pill>
                </div>
                <div className="text-xs text-muted">{c.when} · {c.who}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </SlideReveal>

      <SlideReveal active={active} delay={420}>
        <div className="grid grid-cols-3 gap-4">
          {[
            { n: 163, label: 'ativos rastreados', sub: 'Kanban Disponibilidade' },
            { n: 26, label: 'ordens no fluxo', sub: 'Kanban Manutenção' },
            { n: 6, label: 'operadores ativos', sub: 'Desde dia 1' },
          ].map((m, i) => (
            <GlassCard key={i} className="p-5 text-center">
              <div className="text-3xl font-semibold text-ink tabular-nums">
                <SlideCountUp value={m.n} active={active} />
              </div>
              <div className="text-xs text-muted mt-1">{m.label}</div>
              <div className="text-[10px] text-brand-700 font-medium mt-2">{m.sub}</div>
            </GlassCard>
          ))}
        </div>
      </SlideReveal>
    </SlideShell>
  );
}

// ── Slide 5: Antes × Depois ──
function SlideAntesDepois({ active }) {
  return (
    <SlideShell bg="bg-bg">
      <SlideEyebrow active={active}>Antes × Depois</SlideEyebrow>
      <SlideTitle active={active}>O que mudou na<br />sua operação</SlideTitle>

      <SlideReveal active={active} delay={200}>
        <div className="grid md:grid-cols-3 gap-5">
          {BEFORE_AFTER.map((b, i) => (
            <GlassCard key={i} className="overflow-hidden">
              <div className="grid grid-cols-2 border-b border-stone-200/40" style={{ height: 120 }}>
                <div className="relative border-r border-stone-200/40 overflow-hidden">
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[9px] font-mono uppercase tracking-wider bg-white/90 text-muted px-1.5 py-0.5 rounded">Antes</span>
                  </div>
                  <BeforeVisual kind={b.before} />
                </div>
                <div className="relative overflow-hidden">
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[9px] font-mono uppercase tracking-wider bg-brand-600 text-white px-1.5 py-0.5 rounded">Depois</span>
                  </div>
                  <AfterVisual kind={b.after} />
                </div>
              </div>
              <div className="p-5">
                <div className="text-[11px] text-muted mb-1">{b.before} → {b.after}</div>
                <div className="text-lg font-semibold text-ink tracking-tight">{b.impact}</div>
                <div className="mt-3 pt-3 border-t border-stone-200/40 flex gap-2">
                  <IconQuote size={12} strokeWidth={1.5} className="text-brand-600 shrink-0 mt-0.5" fill="currentColor" />
                  <p className="text-xs text-stone-600 leading-relaxed italic">"{b.quote}" <span className="not-italic text-muted">— {b.who}</span></p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </SlideReveal>
    </SlideShell>
  );
}

// ── Slide 6: Investimento ──
function SlideInvestimento({ active }) {
  return (
    <SlideShell bg="bg-white">
      <SlideEyebrow active={active}>Investimento</SlideEyebrow>
      <SlideTitle active={active}>Previsibilidade no ticket.<br />Garantia no resultado.</SlideTitle>

      <div className="grid md:grid-cols-2 gap-6">
        <SlideReveal active={active} delay={200}>
          <GlassCard className="p-8 h-full">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Investimento mensal</div>
            <div className="text-4xl md:text-5xl font-semibold text-ink tabular-nums tracking-tight">
              R$ <SlideCountUp value={20000} active={active} />
            </div>
            <div className="mt-2 text-sm text-muted">mensalidade fixa · frota completa</div>
            <div className="mt-6 pt-6 border-t border-stone-200/40 space-y-3 text-sm text-stone-700">
              <div className="flex items-center gap-2.5"><IconCheck size={15} strokeWidth={1.5} className="text-brand-600" />Usuários ilimitados</div>
              <div className="flex items-center gap-2.5"><IconCheck size={15} strokeWidth={1.5} className="text-brand-600" />Checklists, OS e Kanban inclusos</div>
              <div className="flex items-center gap-2.5"><IconCheck size={15} strokeWidth={1.5} className="text-brand-600" />Suporte dedicado e onboarding</div>
              <div className="flex items-center gap-2.5"><IconCheck size={15} strokeWidth={1.5} className="text-brand-600" />Integração ERP</div>
            </div>
          </GlassCard>
        </SlideReveal>

        <SlideReveal active={active} delay={350}>
          <div className="rounded-2xl p-8 h-full bg-brand-50 border border-brand-200/60 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 dot-grid-light opacity-40" aria-hidden />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-3">Garantia de resultado · Ano 1</div>
              <p className="text-xl md:text-2xl font-medium leading-snug tracking-tight text-ink">
                Se em 12 meses não atingirmos <span className="text-brand-600 font-semibold">15% de ganho em disponibilidade</span>, devolvemos a mensalidade dos últimos 3 meses.
              </p>
              <div className="mt-6 pt-6 border-t border-brand-200/60 text-xs text-subink leading-relaxed">
                Termo formal assinado junto ao contrato. Meta mensurada trimestralmente contra a linha de base capturada na Blitz.
              </div>
            </div>
          </div>
        </SlideReveal>
      </div>
    </SlideShell>
  );
}

// ── Slide 7: CTA final ──
function SlideFinal({ active }) {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-brand-50">
      <div className="pointer-events-none absolute inset-0 dot-grid-light opacity-50" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] dot-grid-hero opacity-30" aria-hidden />
      <div className="flex-1 flex items-center justify-center px-8 md:px-16 lg:px-24 py-16 relative">
        <div className="max-w-3xl text-center">
          <SlideReveal active={active} delay={0}>
            <div className="inline-flex items-center gap-2 text-brand-700 text-[11px] font-semibold uppercase tracking-[0.15em] mb-6">
              <IconSparkle size={14} strokeWidth={1.5} />
              Agente de Disponibilidade
            </div>
          </SlideReveal>
          <SlideReveal active={active} delay={120}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-ink leading-[1.08] mb-6">
              Quer ver o impacto<br />do Agente de IA?
            </h2>
          </SlideReveal>
          <SlideReveal active={active} delay={250}>
            <p className="text-subink text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Horas economizadas, custo por placa, ROI detalhado — tudo no relatório dedicado do Agente de Disponibilidade.
            </p>
          </SlideReveal>

          <SlideReveal active={active} delay={400}>
            <a href="Relatório Agente.html" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-xl transition text-sm shadow-sm">
              Ver relatório do Agente
              <IconArrowRight size={15} strokeWidth={1.5} />
            </a>
          </SlideReveal>

          <SlideReveal active={active} delay={550}>
            <div className="mt-12 inline-flex gap-6">
              {[
                { k: 'Horas economizadas', v: '535h/mês' },
                { k: 'Custo por placa', v: '−22%' },
                { k: 'ROI ano 1', v: '312%' },
              ].map((r, i) => (
                <GlassCard key={i} className="px-6 py-4 text-center">
                  <div className="text-xl md:text-2xl font-semibold text-ink tabular-nums">{r.v}</div>
                  <div className="text-[10px] text-muted mt-1 uppercase tracking-wider">{r.k}</div>
                </GlassCard>
              ))}
            </div>
          </SlideReveal>
        </div>
      </div>

      <div className="px-8 md:px-16 lg:px-24 pb-8 relative flex items-center justify-between">
        <Logo />
        <span className="text-xs text-muted tabular-nums">{CLIENT.periodStart} – {CLIENT.periodEnd}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Slide wrapper — renders a report section as a full-screen slide
// ═══════════════════════════════════════
function SlideWrap({ children, bg = 'bg-bg' }) {
  return (
    <div className={`flex-1 ${bg} overflow-y-auto`}>
      <div className="min-h-full flex flex-col justify-center py-10">
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  Slide definitions — same sections as the report
// ═══════════════════════════════════════
const SLIDES = [
  { key: 'cover',        title: 'Capa',           render: () => <SlideCover active={true} /> },
  { key: 'sobre',        title: 'Sobre',          render: () => <SlideWrap bg="bg-white">{typeof SobreSection !== 'undefined' ? <SobreSection /> : null}</SlideWrap> },
  { key: 'diag',         title: 'Diagnóstico',    render: () => <SlideWrap bg="bg-white"><DiagSection /></SlideWrap> },
  { key: 'blitz',        title: 'Blitz',          render: () => <SlideWrap><BlitzSection /></SlideWrap> },
  { key: 'checklists',   title: 'Checklists',     render: () => <SlideWrap bg="bg-white"><ChecklistsSection /></SlideWrap> },
  { key: 'antes-depois', title: 'Antes × Depois', render: () => <SlideWrap><AntesDepoisSection /></SlideWrap> },
  { key: 'agente',       title: 'Agente IA',      render: () => <SlideWrap bg="bg-[#1c1917]"><AgenteCTA /></SlideWrap> },
];

// ═══════════════════════════════════════
//  Presentation mode container
// ═══════════════════════════════════════
function PresentationMode({ onExit }) {
  const [current, setCurrent] = useStateApp(0);
  const [prevIdx, setPrevIdx] = useStateApp(-1);
  const containerRef = useRefApp(null);

  const goto = useCallbackApp((idx) => {
    if (idx === current || idx < 0 || idx >= SLIDES.length) return;
    setPrevIdx(current);
    setCurrent(idx);
  }, [current]);

  const next = useCallbackApp(() => goto(current + 1), [goto, current]);
  const prev = useCallbackApp(() => goto(current - 1), [goto, current]);

  useEffectApp(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onExit]);

  useEffectApp(() => {
    const activeSlide = containerRef.current?.querySelector('.pres-slide.active');
    if (activeSlide) activeSlide.scrollTop = 0;
  }, [current]);

  return (
    <div className="pres-mode fixed inset-0 overflow-hidden bg-white">
      {/* Slides */}
      <div ref={containerRef} className="absolute inset-0">
        {SLIDES.map((slide, i) => {
          let cls = 'pres-slide';
          if (i === current) cls += ' active';
          else if (i === prevIdx) cls += ' exit';
          return (
            <div key={slide.key} className={cls}>
              {slide.render(i === current)}
            </div>
          );
        })}
      </div>

      {/* Slide counter — top right, glass pill */}
      <div className="fixed top-4 right-5 z-50 glass rounded-full px-3 py-1.5 slide-number text-[11px] font-mono text-subink">
        {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>

      {/* Exit button — top left, glass */}
      <button
        onClick={onExit}
        className="fixed top-4 left-5 z-50 w-8 h-8 rounded-full glass flex items-center justify-center text-muted hover:text-ink transition"
        title="Voltar (Esc)"
      >
        <IconX size={14} strokeWidth={1.5} />
      </button>

      {/* Side arrows */}
      {current > 0 && (
        <button
          onClick={prev}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-ink transition"
        >
          <IconChevLeft size={20} strokeWidth={1.5} />
        </button>
      )}
      {current < SLIDES.length - 1 && (
        <button
          onClick={next}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-ink transition"
        >
          <IconChevRight size={20} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
//  Report mode (unchanged)
// ═══════════════════════════════════════
function ReportMode() {
  return (
    <>
      <Nav />
      <Hero />
      {typeof SobreSection !== 'undefined' ? <SobreSection /> : null}
      <DiagSection />
      <BlitzSection />
      <ChecklistsSection />
      <AntesDepoisSection />
      <AgenteCTA />
      <Footer />
    </>
  );
}

// ═══════════════════════════════════════
//  Mode selector (landing)
// ═══════════════════════════════════════
function ModeSelector({ onSelect }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-16 relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] dot-grid-hero" aria-hidden />
      <div className="relative max-w-2xl w-full text-center">
        <div className="fade-up">
          <Logo className="justify-center mb-6" />
        </div>
        <div className="fade-up fade-up-delay-1">
          <div className="text-xs font-medium uppercase tracking-wider text-muted mb-3">Relatório POV</div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink leading-[1.1] flex items-center justify-center gap-3 flex-wrap">
            <span>Resultados —</span>
            <img src="assets/rodojacto-logo.png" alt="Rodojacto" className="h-8 md:h-10 w-auto" />
          </h1>
          <p className="mt-3 text-sm text-subink">
            {CLIENT.periodStart} a {CLIENT.periodEnd} · {CLIENT.city}
          </p>
        </div>

        <div className="fade-up fade-up-delay-2 mt-10">
          <p className="text-sm text-muted mb-6">Escolha como deseja visualizar</p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              onClick={() => onSelect('report')}
              className="group bg-white border border-stone-200/70 rounded-xl p-6 text-left hover:border-stone-300 hover:shadow-hover transition-all card-hover"
            >
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-4 group-hover:bg-brand-50 transition">
                <IconFile size={20} strokeWidth={1.5} className="text-stone-600 group-hover:text-brand-700 transition" />
              </div>
              <div className="text-base font-semibold text-ink tracking-tight">Modo Relatório</div>
              <p className="mt-1.5 text-xs text-subink leading-relaxed">
                Página completa com scroll. Ideal para leitura detalhada.
              </p>
            </button>
            <button
              onClick={() => onSelect('presentation')}
              className="group bg-white border border-stone-200/70 rounded-xl p-6 text-left hover:border-stone-300 hover:shadow-hover transition-all card-hover"
            >
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center mb-4 group-hover:bg-brand-50 transition">
                <IconLayout size={20} strokeWidth={1.5} className="text-stone-600 group-hover:text-brand-700 transition" />
              </div>
              <div className="text-base font-semibold text-ink tracking-tight">Modo Apresentação</div>
              <p className="mt-1.5 text-xs text-subink leading-relaxed">
                Slides navegáveis. Ideal para reuniões ao vivo.
              </p>
            </button>
          </div>
        </div>

        <div className="fade-up fade-up-delay-3 mt-8 text-[11px] text-muted">
          <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">←</kbd> <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">→</kbd> para navegar · <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono">Esc</kbd> para sair
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
//  App root
// ═══════════════════════════════════════
function App() {
  const [presMode, setPresMode] = useStateApp(false);

  useEffectApp(() => {
    document.body.style.overflow = presMode ? 'hidden' : '';
    if (presMode) window.scrollTo(0, 0);
    return () => { document.body.style.overflow = ''; };
  }, [presMode]);

  if (presMode) return <PresentationMode onExit={() => setPresMode(false)} />;

  return (
    <>
      <ReportMode />
      <button
        onClick={() => setPresMode(true)}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-600 hover:text-ink transition shadow-sm"
        title="Modo apresentação"
      >
        <IconLayout size={18} strokeWidth={1.5} />
      </button>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
