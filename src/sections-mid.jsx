// Checklists + Kanbans (Disponibilidade e Manutenção) com tabs + Antes x Depois
const { useState: useStateM, useMemo: useMemoM } = React;

// ---------- Kanban card (espelho da plataforma Rabbot) ----------
const TAG_CLASSES = {
  brand:     'bg-brand-50 text-brand-700 border border-brand-500/30',
  purple:    'bg-purple-50 text-purple-700 border border-purple-200',
  pink:      'bg-pink-100 text-pink-700 border border-pink-200',
  amber:     'bg-amber-50 text-amber-700 border border-amber-200',
  brown:     'bg-orange-100 text-orange-800 border border-orange-200',
  orange:    'bg-orange-100 text-orange-800 border border-orange-200',
  blueLight: 'bg-blue-50 text-blue-700 border border-blue-200',
  neutral:   'bg-stone-100 text-stone-600 border border-stone-200',
};

const DOT_CLASSES = {
  brand: 'bg-brand-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  amber: 'bg-amber-500',
  brown: 'bg-orange-600',
  orange: 'bg-orange-500',
  neutral: 'bg-stone-300',
};

function KanbanCard({ c }) {
  return (
    <div className="bg-white border border-stone-200/70 rounded-lg p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <span className="placa text-[13px] font-semibold text-ink whitespace-nowrap">{c.plate}</span>
        {c.tag && (
          <span className={`text-[9px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded whitespace-nowrap ${TAG_CLASSES[c.tagTone] || TAG_CLASSES.neutral}`}>
            {c.tag}
          </span>
        )}
      </div>
      {c.sub && <div className="mt-1 text-[11px] text-subink leading-snug truncate">{c.sub}</div>}
      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted font-mono tabular-nums">
        <span>{c.time}</span>
        <div className="flex items-center gap-2">
          {c.alert && (
            <span className="flex items-center gap-1 text-red-600 font-sans font-medium">
              <span className="w-1 h-1 rounded-full bg-red-500" />{c.alert}
            </span>
          )}
          <span className="flex items-center gap-1 text-stone-400">
            <IconClock size={9} strokeWidth={1.5} />{c.parked}
          </span>
          {c.stripes > 0 && (
            <span className="flex items-end gap-px text-stone-400" aria-hidden>
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`w-[2px] ${i < c.stripes ? 'bg-stone-400' : 'bg-stone-200'}`} style={{ height: 3 + i * 2 }} />
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function KanbanBoard({ data, emptyLabel = 'Sem itens no período' }) {
  return (
    <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0 pb-2">
      <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
        {data.cols.map((col) => (
          <div key={col.key} className="shrink-0 w-[280px]">
            <div className="bg-stone-50 border border-stone-200/70 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-stone-200/70">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_CLASSES[col.tone] || DOT_CLASSES.neutral}`} />
                  <span className="text-[13px] font-medium text-ink truncate">{col.title}</span>
                </div>
                <span className="text-xs text-muted font-mono tabular-nums shrink-0 ml-2">{col.count}</span>
              </div>
              <div className="p-2 space-y-2 min-h-[220px]">
                {col.cards.length === 0 ? (
                  <div className="text-[11px] text-muted text-center py-6 italic">{emptyLabel}</div>
                ) : (
                  col.cards.map((c, i) => <KanbanCard key={i} c={c} />)
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Carrossel de checklists ----------
function ChecklistCarousel() {
  const scrollRef = React.useRef(null);
  const [canPrev, setCanPrev] = useStateM(false);
  const [canNext, setCanNext] = useStateM(true);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener('scroll', updateButtons, { passive: true });
    return () => el.removeEventListener('scroll', updateButtons);
  }, []);

  return (
    <div className="relative">
      {/* Setas */}
      {canPrev && (
        <button onClick={() => scroll(-1)}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-stone-200/70 shadow-sm flex items-center justify-center text-ink hover:bg-stone-50 transition">
          <IconChevLeft size={16} strokeWidth={1.5} />
        </button>
      )}
      {canNext && (
        <button onClick={() => scroll(1)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-stone-200/70 shadow-sm flex items-center justify-center text-ink hover:bg-stone-50 transition">
          <IconChevRight size={16} strokeWidth={1.5} />
        </button>
      )}

      <div ref={scrollRef} className="overflow-x-auto no-scrollbar pt-1 pb-2">
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {CHECKLIST_SAMPLE.map((c, i) => (
            <div key={i} className="bg-white border border-stone-200/70 rounded-xl overflow-hidden card-hover shrink-0" style={{ width: 300 }}>
              <div className="p-5">
                {/* Header: placa + tipo */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="placa text-xl font-bold text-ink tracking-tight">{c.plate}</span>
                  <span className="text-[11px] text-muted whitespace-nowrap mt-1">Checklist de<br />{c.type}</span>
                </div>

                {/* Data de conclusão */}
                <div className="mb-1.5">
                  <span className="text-xs font-medium text-muted">Data de conclusão: </span>
                  <span className="text-xs text-ink">{c.when}</span>
                </div>

                {/* Responsável */}
                <div className="mb-4">
                  <span className="text-xs font-medium text-muted">Responsável: </span>
                  <span className="text-xs text-ink">{c.who}</span>
                </div>

                {/* 3 fotos quadradas */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="ph-stripe rounded-lg relative" style={{ aspectRatio: '1/1' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconCamera size={14} strokeWidth={1.5} className="text-stone-400" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Local */}
                <div className="text-xs text-muted flex items-center gap-1 mb-4">
                  <IconMapPin size={12} strokeWidth={1.5} />{c.place}
                </div>

                {/* Botão */}
                <button className="w-full py-2 border border-stone-200/70 rounded-lg text-xs font-medium text-ink hover:bg-stone-50 transition flex items-center justify-center gap-1.5">
                  Ver respostas <IconArrowRight size={12} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Seção principal com 3 tabs ----------
function ChecklistsSection() {
  const [view, setView] = useStateM('checklists');

  const tabs = [
    { key: 'checklists', label: 'Checklists preenchidos', count: 84, icon: <IconList size={14} strokeWidth={1.5} /> },
    { key: 'disp', label: 'Kanban de Disponibilidade', count: 163, icon: <IconLayout size={14} strokeWidth={1.5} /> },
    { key: 'manut', label: 'Kanban de Manutenção', count: 26, icon: <IconWrench size={14} strokeWidth={1.5} /> },
  ];

  const titleByView = {
    checklists: <span><span className="text-3xl font-semibold"><CountNumber value={84} /></span> checklists preenchidos</span>,
    disp: <span>Kanban de Disponibilidade <span className="text-muted font-normal">ao vivo</span></span>,
    manut: <span>Kanban de Manutenção <span className="text-muted font-normal">ao vivo</span></span>,
  };
  const subtitleByView = {
    checklists: 'Entrada e saída de frota digitalizada desde o primeiro dia. Rastreabilidade ponta-a-ponta.',
    disp: 'Espelho do quadro de ativos na plataforma Rabbot — toda placa, todo status, atualizado ao vivo pela operação.',
    manut: 'Fluxo completo das ordens de manutenção — do apontamento à liberação com pendência.',
  };

  return (
    <Section id="checklists" className="bg-white border-y border-stone-200/70">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-[1.15] text-ink">{titleByView[view]}</h2>
          <p className="mt-2 text-sm text-subink max-w-2xl leading-relaxed">{subtitleByView[view]}</p>
        </div>
        <a href="https://app.rabbot.co" target="_blank" rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
          Ir para plataforma
          <IconArrowRight size={14} strokeWidth={1.5} />
        </a>
      </div>
      <div>
        <div className="flex border-b border-stone-200/70 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setView(t.key)}
              className={`flex-1 md:flex-1 flex-shrink-0 px-4 py-2.5 text-sm font-medium transition flex items-center justify-center gap-1.5 border-b-2 -mb-px whitespace-nowrap ${view === t.key ? 'border-brand-600 text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
              {t.icon}{t.label}
              <span className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${view === t.key ? 'bg-brand-50 text-brand-700' : 'bg-stone-100 text-muted'}`}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {view === 'checklists' && (
        <Reveal>
          <ChecklistCarousel />
        </Reveal>
      )}

      {view === 'disp' && (
        <Reveal>
          <KanbanBoard data={KANBAN_DISP} />
          <div className="mt-3 text-[11px] text-muted flex items-center gap-2">
            <IconInfo size={12} strokeWidth={1.5} />
            Total rastreado: {KANBAN_DISP.total} ativos · arraste para ver todas as colunas
          </div>
        </Reveal>
      )}

      {view === 'manut' && (
        <Reveal>
          <KanbanBoard data={KANBAN_MANUT} emptyLabel="Nenhuma ordem nesta etapa" />
          <div className="mt-3 text-[11px] text-muted flex items-center gap-2">
            <IconInfo size={12} strokeWidth={1.5} />
            Total no fluxo de manutenção: {KANBAN_MANUT.total} ordens · arraste para ver todas as colunas
          </div>
        </Reveal>
      )}
    </Section>
  );
}

// ---------- Antes x Depois ----------
function BeforeVisual({ kind }) {
  if (kind === 'WhatsApp') {
    return (
      <div className="h-full bg-[#ECE5DD] p-3 flex flex-col gap-1.5 justify-end">
        <div className="self-start max-w-[80%] bg-white rounded-lg rounded-tl-none px-2.5 py-1.5 text-[11px] text-stone-700">
          Chefia, o 4A21 tá com barulho no freio
        </div>
        <div className="self-end max-w-[80%] bg-[#DCF8C6] rounded-lg rounded-tr-none px-2.5 py-1.5 text-[11px] text-stone-700">
          Anota aí, vê com o Wilson amanhã
        </div>
        <div className="self-start max-w-[80%] bg-white rounded-lg rounded-tl-none px-2.5 py-1.5 text-[11px] text-stone-700">
          👍
        </div>
      </div>
    );
  }
  if (kind === 'Planilha Excel') {
    return (
      <div className="h-full bg-white p-2.5 text-[10px] font-mono text-stone-700">
        <div className="grid grid-cols-4 gap-px bg-line">
          {['Placa','Status','Obs','Data'].map((h,i) => (
            <div key={i} className="bg-[#217346] text-white px-1.5 py-1 font-medium">{h}</div>
          ))}
          {Array.from({length: 5}).flatMap((_,r) => (
            ['RBT-'+['4A21','8C04','2E99','9F47','3B12'][r],['OK','Parado','OK','Freio','OK'][r],['—','ver wilson','—','amanhã','—'][r],'14/04'].map((c,i) => (
              <div key={`${r}${i}`} className="bg-white px-1.5 py-1 truncate">{c}</div>
            ))
          ))}
        </div>
        <div className="mt-1.5 text-[9px] text-stone-500">frota_abril_v7_FINAL_rev2.xlsx</div>
      </div>
    );
  }
  // Papel
  return (
    <div className="h-full bg-[#F5EFD9] p-3 flex flex-col gap-0.5 text-[11px] font-serif text-stone-800 relative"
         style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 22px, rgba(0,0,0,0.06) 22px 23px)' }}>
      <div className="font-bold text-sm">OS #0421</div>
      <div>Placa: RBT-6M82</div>
      <div>Serviço: pastilha freio</div>
      <div>Mec: Wilson</div>
      <div className="mt-1.5 italic text-stone-500">(rasurado)</div>
      <div className="absolute bottom-3 right-3 w-14 h-6 border-t border-stone-600 text-center text-[9px] text-stone-500 pt-0.5">assinatura</div>
    </div>
  );
}

function AfterVisual({ kind }) {
  if (kind === 'Checklist Rabbot') {
    return (
      <div className="h-full bg-white p-2.5 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted">F0C5F58</span>
          <Pill tone="brand">Entrada</Pill>
        </div>
        <div className="placa text-sm font-medium">RBT-4A21</div>
        {['Pneus','Luzes','Freios','Óleo','Docs'].map((q,i) => (
          <div key={i} className="flex items-center justify-between border-b border-stone-100 pb-0.5">
            <span className="text-[11px] text-stone-700">{q}</span>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center ${i === 2 ? 'bg-amber-100 text-amber-700' : 'bg-brand-50 text-brand-700'}`}>
              {i === 2 ? <IconAlert size={10} strokeWidth={1.5} /> : <IconCheck size={10} strokeWidth={1.5} />}
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (kind === 'Kanban de Ativos') {
    return (
      <div className="h-full bg-stone-50 p-1.5 grid grid-cols-3 gap-1">
        {['Disp','Indisp','Prob'].map((t,i) => (
          <div key={i} className="bg-white border border-stone-200/70 rounded p-1">
            <div className={`text-[9px] font-medium mb-1 ${['text-brand-700','text-muted','text-amber-700'][i]}`}>{t}</div>
            {Array.from({length: 3}).map((_,j) => (
              <div key={j} className="border border-stone-200/70 rounded-sm px-1 py-0.5 mb-0.5 placa text-[8px] text-ink">RBT-{Math.floor(Math.random()*9000+1000)}</div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  // OS digital
  return (
    <div className="h-full bg-white p-2.5">
      <div className="text-[10px] font-mono text-muted">OS-0421</div>
      <div className="placa text-sm font-medium text-ink mt-0.5">RBT-6M82</div>
      <div className="text-[11px] text-stone-700 mt-0.5">Troca pastilha de freio</div>
      <div className="mt-1.5 space-y-0.5">
        {['Aberta','Em execução','Aguardando peça','Concluída'].map((s,i) => (
          <div key={i} className={`flex items-center gap-1.5 text-[10px] ${i === 1 ? 'text-ink font-medium' : 'text-muted'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${i <= 1 ? 'bg-brand-500' : 'bg-stone-200'}`} />{s}
          </div>
        ))}
      </div>
      <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center gap-1.5">
        <Avatar name="Wilson T" size={18} />
        <span className="text-[10px] text-ink">Wilson</span>
      </div>
    </div>
  );
}

function AntesDepoisSection() {
  return (
    <Section id="antes-depois">
      <SectionHeader title="O que mudou na sua operação" subtitle="Três processos-chave que saíram do improviso para um fluxo rastreável." />
      <div className="grid md:grid-cols-3 gap-4">
        {BEFORE_AFTER.map((b, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="bg-white border border-stone-200/70 rounded-xl overflow-hidden h-full flex flex-col card-hover">
              <div className="grid grid-cols-2 border-b border-stone-200/70" style={{ aspectRatio: '2/1' }}>
                <div className="relative border-r border-stone-200/70 overflow-hidden">
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <span className="text-[9px] font-mono uppercase tracking-wider bg-white/90 text-muted px-1.5 py-0.5 rounded">Antes</span>
                  </div>
                  <BeforeVisual kind={b.before} />
                </div>
                <div className="relative overflow-hidden">
                  <div className="absolute top-1.5 left-1.5 z-10">
                    <span className="text-[9px] font-mono uppercase tracking-wider bg-brand-600 text-white px-1.5 py-0.5 rounded">Depois</span>
                  </div>
                  <AfterVisual kind={b.after} />
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="text-[11px] text-muted">{b.before} → {b.after}</div>
                <div className="mt-1 text-base font-semibold text-ink">{b.impact}</div>
                <div className="mt-3 pt-3 border-t border-stone-100 flex gap-2.5">
                  <IconQuote size={14} strokeWidth={1.5} className="text-brand-600 shrink-0 mt-0.5" fill="currentColor" />
                  <div>
                    <p className="text-sm text-stone-700 leading-relaxed">"{b.quote}"</p>
                    <p className="text-xs text-muted mt-1.5">— {b.who}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* BTime × Rabbot */}
      <Reveal delay={300}>
        <div className="mt-12 pt-10 border-t border-stone-200/70">
          <h3 className="text-lg font-semibold text-ink tracking-tight mb-1">BTime × Rabbot</h3>
          <p className="text-sm text-subink mb-6">O sistema atual registra. A Rabbot age.</p>

          <div className="overflow-x-auto">
          <div className="border border-stone-200/70 rounded-xl overflow-hidden mb-10" style={{ minWidth: 600 }}>
            <div className="grid grid-cols-[1.2fr_1.5fr_1.5fr] bg-stone-50 border-b border-stone-200/70 text-[10px] font-medium uppercase tracking-wider text-muted">
              <div className="px-4 py-2.5">Aspecto</div>
              <div className="px-4 py-2.5">BTime (hoje)</div>
              <div className="px-4 py-2.5 border-l-2 border-brand-600">Rabbot</div>
            </div>
            {[
              { aspecto: 'Checklists', btime: 'Existem, mas preenchidos manualmente', rabbot: 'Captura automática integrada ao fluxo do pátio' },
              { aspecto: 'Visibilidade dos dados', btime: 'Restrita a setores específicos', rabbot: 'Conectada entre todas as áreas — pátio, manutenção, operação e liderança veem o mesmo' },
              { aspecto: 'Automações', btime: 'Limitadas e padronizadas', rabbot: 'Personalizadas por operação e tipo de evento' },
              { aspecto: 'Ação sobre o dado', btime: 'Operador identifica e aciona manualmente', rabbot: 'Agente de IA se comunica diretamente com motoristas e envolvidos' },
              { aspecto: 'Natureza do sistema', btime: 'Registro digital de operação manual', rabbot: 'Plataforma operacional integrada' },
              { aspecto: 'Tempo entre evento e ação', btime: 'Depende de alguém abrir o relatório', rabbot: 'Imediato — o sistema avisa antes de virar problema' },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-[1.2fr_1.5fr_1.5fr] border-b last:border-b-0 border-stone-100 ${i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}`}>
                <div className="px-4 py-3.5 text-sm font-medium text-ink">{row.aspecto}</div>
                <div className="px-4 py-3.5 text-sm text-subink">{row.btime}</div>
                <div className="px-4 py-3.5 text-sm font-medium text-ink border-l-2 border-brand-600/30">{row.rabbot}</div>
              </div>
            ))}
          </div>
          </div>

          <div className="text-center py-8">
            <p className="text-lg md:text-xl font-medium text-ink leading-snug tracking-tight max-w-2xl mx-auto">
              "BTime é um sistema de apontamento.<br />Rabbot é uma operação que se autoajusta."
            </p>
            <p className="mt-3 text-sm text-muted">
              Mesma origem (registro de evento), destinos diferentes (relatório vs ação).
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

Object.assign(window, { ChecklistsSection, AntesDepoisSection });
