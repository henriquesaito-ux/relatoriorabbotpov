// Checklists + Kanbans (Disponibilidade e Manutenção) com tabs + Antes x Depois
const { useState: useStateM, useMemo: useMemoM, useEffect: useEffectM } = React;

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
  const tagStyle = c.tagColor ? (() => {
    const { r, g, b } = hexToRgb(c.tagColor);
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
      color: darkenHex(c.tagColor, 0.45),
      border: `1px solid rgba(${r}, ${g}, ${b}, 0.3)`,
    };
  })() : null;

  return (
    <div className="bg-white border border-stone-200/70 rounded-lg p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <span className="placa text-[13px] font-semibold text-ink whitespace-nowrap">{c.plate}</span>
        {c.tag && (
          tagStyle ? (
            <span className="text-[9px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded-full whitespace-nowrap" style={tagStyle}>
              {c.tag}
            </span>
          ) : (
            <span className={`text-[9px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded-full whitespace-nowrap ${TAG_CLASSES[c.tagTone] || TAG_CLASSES.neutral}`}>
              {c.tag}
            </span>
          )
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
              <div className="p-2 space-y-2 overflow-y-auto" style={{ height: 420 }}>
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

// ---------- OS Card ----------
const AREA_COLORS = {
  brand: 'bg-brand-50 text-brand-700 border border-brand-200',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  neutral: 'bg-stone-100 text-stone-600 border border-stone-200',
};
const AREA_DOT = { brand: 'bg-brand-500', amber: 'bg-amber-500', neutral: 'bg-stone-400' };
const BAR_COLORS_OS = ['bg-amber-400', 'bg-orange-500', 'bg-red-500'];

function OSCard({ c }) {
  const areaStyle = c.areaColor ? (() => {
    const { r, g, b } = hexToRgb(c.areaColor);
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
      color: darkenHex(c.areaColor, 0.45),
      border: `1px solid rgba(${r}, ${g}, ${b}, 0.3)`,
    };
  })() : null;

  return (
    <div className="bg-white border border-stone-200/70 rounded-lg p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="placa text-[14px] font-bold text-ink whitespace-nowrap">OS {c.os}</span>
          <span className="text-[11px] text-muted font-mono">{c.plate}</span>
        </div>
        <IconWrench size={14} strokeWidth={1.5} className="text-stone-300 shrink-0" />
      </div>
      {c.sub && <div className="text-[11px] text-subink mb-1.5">{c.sub}</div>}
      <div className="flex items-center gap-2 text-[11px] text-muted mb-2">
        <span className="flex items-center gap-1"><IconUser size={10} strokeWidth={1.5} />{c.setor}</span>
        {c.resp && <span className="flex items-center gap-1"><IconUsers size={10} strokeWidth={1.5} />{c.resp}</span>}
      </div>
      <div className="flex items-center gap-2 flex-wrap mb-2">
        {areaStyle ? (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={areaStyle}>
            {c.area}{c.done ? ' ✓' : ''}
          </span>
        ) : (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${AREA_COLORS[c.areaTone] || AREA_COLORS.neutral}`}>
            {c.area}{c.done ? ' ✓' : ''}
          </span>
        )}
        {c.complexBars > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="flex items-end gap-px">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`w-[3px] rounded-sm ${i < c.complexBars ? BAR_COLORS_OS[Math.min(i, 2)] : 'bg-stone-200'}`} style={{ height: 4 + i * 3 }} />
              ))}
            </span>
            {c.complex && <span className="text-[10px] text-muted">{c.complex}</span>}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-[10px] text-muted">
        {c.tempo && <span className="flex items-center gap-1"><IconClock size={10} strokeWidth={1.5} />{c.tempo}</span>}
        {c.previsto && <span className="flex items-center gap-1"><IconClock size={10} strokeWidth={1.5} />Previsto: {c.previsto}</span>}
        {c.atraso && <span className="text-red-600 font-semibold">Atraso: {c.atraso}</span>}
      </div>
    </div>
  );
}

function OSKanbanBoard({ data, summary }) {
  return (
    <div>
      {/* Summary cards */}
      {summary.length > 0 && (
        <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar">
          {summary.map((s, i) => (
            <div key={i} className="shrink-0 border border-stone-200/70 rounded-xl px-5 py-3 bg-white" style={{ minWidth: 160 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${AREA_DOT[s.tone] || AREA_DOT.neutral}`} />
                <span className="text-sm font-semibold text-ink">{s.area}</span>
              </div>
              <div className="space-y-0.5 text-[12px] text-subink tabular-nums">
                <div className="flex justify-between"><span>Aberta</span><span className="font-semibold text-ink">{s.aberta}</span></div>
                <div className="flex justify-between"><span>Em Progresso</span><span className="font-semibold text-ink">{s.progresso}</span></div>
                <div className="flex justify-between"><span>Concluída</span><span className="font-semibold text-ink">{s.concluida}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Kanban columns */}
      <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0 pb-2">
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {data.cols.map((col) => (
            <div key={col.key} className="shrink-0 w-[320px]">
              <div className="bg-stone-50 border border-stone-200/70 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-stone-200/70">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[13px] font-semibold text-ink truncate">{col.title}</span>
                  </div>
                  <span className="text-xs text-muted font-mono tabular-nums shrink-0 ml-2">{col.count}</span>
                </div>
                <div className="p-2 space-y-2 overflow-y-auto" style={{ height: 420 }}>
                  {col.cards.length === 0 ? (
                    <div className="text-[11px] text-muted text-center py-6 italic">Nenhuma OS nesta etapa</div>
                  ) : (
                    col.cards.map((c, i) => <OSCard key={i} c={c} />)
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Modal de respostas do checklist ----------
function ChecklistModal({ item, onClose }) {
  const [galleryIdx, setGalleryIdx] = useStateM(0);
  const [failedPhotos, setFailedPhotos] = useStateM({});
  if (!item) return null;

  const allPhotos = (item.photos || []).filter((_, i) => !failedPhotos[i]);
  const onImgError = (originalIdx) => setFailedPhotos(prev => ({ ...prev, [originalIdx]: true }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200/70 px-6 py-4 flex items-start justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="placa text-lg font-bold text-ink">{item.plate}</span>
              <span className="text-stone-300">|</span>
              <span className="text-sm text-subink">{item.type}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span>Data de conclusão: <span className="text-ink">{item.when}</span></span>
              <span>Responsável: <span className="text-ink">{item.who}</span></span>
            </div>
          </div>
          <button onClick={onClose} className="shrink-0 w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center transition text-stone-400 hover:text-ink">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Respostas */}
          <div className="flex-1 px-6 py-5 min-w-0">
            <h3 className="text-base font-semibold text-ink mb-4">Respostas</h3>
            <div className="space-y-3">
              {item.questions.map((q, i) => (
                <div key={i} className="border border-stone-200/70 rounded-xl px-4 py-3 flex gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-xs font-semibold text-subink">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink mb-0.5">{q.title}</div>
                    {q.answer && <div className="text-sm text-subink">{q.answer}</div>}
                    {q.type === 'CATEGORYAPPOINTMENT' && (q.categoryAppointments || []).map((ca, ci) => (
                      <div key={ci} className="mt-2">
                        <span className="text-xs font-medium text-muted">{ca.categoryReference?.name}</span>
                        <div className="mt-1 space-y-1">
                          {ca.items.map((ap, ai) => (
                            <div key={ai} className="flex items-start gap-2 text-xs">
                              <span className={`shrink-0 mt-0.5 w-3 h-3 rounded-full border-2 ${ap.isOk ? 'border-brand-500 bg-brand-50' : 'border-red-400 bg-red-50'}`} />
                              <div>
                                <span className="text-ink">{ap.name}</span>
                                {ap.descriptionProblem && <span className="text-muted ml-1">— {ap.descriptionProblem}</span>}
                                {ap.photo && ap.photo.startsWith('http') && (
                                  <img src={ap.photo} alt={ap.name} className="mt-1 rounded-lg max-h-32 object-cover" onError={e => { e.target.style.display = 'none'; }} />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: endereço + galeria */}
          <div className="w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-l border-stone-200/70 px-6 py-5 bg-stone-50/50">
            {item.address && (
              <div className="mb-4">
                <div className="text-sm font-medium text-ink mb-2">{item.address}</div>
                {item.lat && item.lng && (
                  <a href={`https://www.google.com/maps?q=${item.lat},${item.lng}`} target="_blank" rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden border border-stone-200/70 relative" style={{ height: 120 }}>
                    <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                      <rect width="400" height="120" fill="#e8e4df"/>
                      <rect x="40" y="0" width="8" height="120" fill="#f5f3f0" rx="1"/>
                      <rect x="120" y="0" width="12" height="120" fill="#f5f3f0" rx="1"/>
                      <rect x="200" y="0" width="6" height="120" fill="#f5f3f0" rx="1"/>
                      <rect x="280" y="0" width="10" height="120" fill="#f5f3f0" rx="1"/>
                      <rect x="350" y="0" width="7" height="120" fill="#f5f3f0" rx="1"/>
                      <rect x="0" y="20" width="400" height="8" fill="#f5f3f0" rx="1"/>
                      <rect x="0" y="55" width="400" height="12" fill="#f5f3f0" rx="1"/>
                      <rect x="0" y="95" width="400" height="6" fill="#f5f3f0" rx="1"/>
                      <rect x="80" y="30" width="30" height="20" fill="#d6d3d0" rx="2" opacity="0.5"/>
                      <rect x="150" y="75" width="40" height="15" fill="#d6d3d0" rx="2" opacity="0.5"/>
                      <rect x="250" y="25" width="20" height="25" fill="#d6d3d0" rx="2" opacity="0.5"/>
                      <rect x="310" y="70" width="25" height="20" fill="#d6d3d0" rx="2" opacity="0.5"/>
                      <path d="M170 8 Q180 2 190 10 Q195 5 200 12 L200 18 Q190 12 185 16 Q178 10 170 18 Z" fill="#c8dfc0" opacity="0.6"/>
                      <path d="M60 80 Q68 72 76 82 Q82 75 88 84 L88 92 Q80 84 74 88 Q68 80 60 90 Z" fill="#c8dfc0" opacity="0.5"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[13px] font-medium text-stone-500 drop-shadow-sm">clique para carregar o mapa</span>
                    </div>
                  </a>
                )}
              </div>
            )}

            {allPhotos.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-ink mb-3">Galeria</h4>
                {/* Main image */}
                <div className="rounded-xl overflow-hidden border border-stone-200/70 mb-3 relative bg-stone-100">
                  <img src={allPhotos[galleryIdx]} alt="Foto" className="w-full aspect-[4/3] object-cover" onError={e => { e.target.style.display = 'none'; }} />
                  {allPhotos.length > 1 && (
                    <>
                      <button onClick={() => setGalleryIdx((galleryIdx - 1 + allPhotos.length) % allPhotos.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition">
                        <IconChevLeft size={14} strokeWidth={2} />
                      </button>
                      <button onClick={() => setGalleryIdx((galleryIdx + 1) % allPhotos.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition">
                        <IconChevRight size={14} strokeWidth={2} />
                      </button>
                    </>
                  )}
                </div>
                {/* Thumbnails */}
                {allPhotos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {allPhotos.map((src, j) => (
                      <button key={j} onClick={() => setGalleryIdx(j)}
                        className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${j === galleryIdx ? 'border-brand-500' : 'border-stone-200/70 opacity-60 hover:opacity-100'}`}>
                        <img src={src} alt="" className="w-full h-full object-cover" onError={e => { e.target.parentElement.style.display = 'none'; }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Carrossel de checklists ----------
function ChecklistCarousel({ items: rawItems }) {
  // Sort: deprioritized plates last, then items with photos first
  const LAST_PLATES = ['RDJ1234', 'CLK9651'];
  const items = React.useMemo(() => {
    return [...rawItems].sort((a, b) => {
      const aLast = LAST_PLATES.includes(a.plate) ? 1 : 0;
      const bLast = LAST_PLATES.includes(b.plate) ? 1 : 0;
      if (aLast !== bLast) return aLast - bLast;
      const aHas = (a.photos && a.photos.length > 0) ? 1 : 0;
      const bHas = (b.photos && b.photos.length > 0) ? 1 : 0;
      return bHas - aHas;
    });
  }, [rawItems]);
  const scrollRef = React.useRef(null);
  const [canPrev, setCanPrev] = useStateM(false);
  const [canNext, setCanNext] = useStateM(true);
  const [modalItem, setModalItem] = useStateM(null);

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
      {modalItem && ReactDOM.createPortal(
        <ChecklistModal item={modalItem} onClose={() => setModalItem(null)} />,
        document.body
      )}
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
          {items.map((c, i) => (
            <div key={i} className="bg-white border border-stone-200/70 rounded-xl overflow-hidden card-hover shrink-0 flex flex-col" style={{ width: 300 }}>
              <div className="p-5 flex-1">
                {/* Header: placa + tipo */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="placa text-xl font-bold text-ink tracking-tight">{c.plate}</span>
                  <span className="text-[11px] text-muted whitespace-nowrap mt-1">{c.type}</span>
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

                {/* Fotos — só mostra as que existem; se nenhuma, 1 placeholder */}
                {(() => {
                  const realPhotos = (c.photos || []).filter(Boolean);
                  const slots = realPhotos.length > 0 ? realPhotos : [null];
                  return (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {slots.slice(0, 3).map((photo, j) => (
                        <div key={j} className="rounded-lg relative overflow-hidden bg-stone-100" style={{ aspectRatio: '1/1' }}>
                          {photo ? (
                            <img src={photo} alt="" className="w-full h-full object-cover" onError={e => { e.target.parentElement.style.display = 'none'; }} />
                          ) : (
                            <div className="ph-stripe w-full h-full flex items-center justify-center">
                              <IconCamera size={14} strokeWidth={1.5} className="text-stone-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Local */}
                {c.place && (
                  <div className="text-xs text-muted flex items-center gap-1">
                    <IconMapPin size={12} strokeWidth={1.5} />{c.place}
                  </div>
                )}
              </div>

              {/* Botão fixo no bottom */}
              <div className="px-5 pb-5">
                <button onClick={() => setModalItem(c)} className="w-full py-2 border border-stone-200/70 rounded-lg text-xs font-medium text-ink hover:bg-stone-50 transition flex items-center justify-center gap-1.5">
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
  const [checklists, setChecklists] = useStateM(CHECKLIST_FALLBACK);
  const [loadingChecklist, setLoadingChecklist] = useStateM(true);
  const [kanbanDisp, setKanbanDisp] = useStateM(KANBAN_DISP_FALLBACK);
  const [kanbanManut, setKanbanManut] = useStateM(KANBAN_MANUT_FALLBACK);
  const [kanbanOS, setKanbanOS] = useStateM(KANBAN_OS_FALLBACK);
  const [osSummary, setOsSummary] = useStateM(OS_SUMMARY_FALLBACK);
  const [loadingDisp, setLoadingDisp] = useStateM(true);
  const [loadingManut, setLoadingManut] = useStateM(true);
  const [loadingOS, setLoadingOS] = useStateM(true);

  useEffectM(() => {
    fetchChecklists()
      .then(data => setChecklists(data))
      .catch(err => console.error('Falha ao carregar Checklists:', err))
      .finally(() => setLoadingChecklist(false));
    fetchKanbanDisp()
      .then(data => setKanbanDisp(data))
      .catch(err => console.error('Falha ao carregar Kanban Disponibilidade:', err))
      .finally(() => setLoadingDisp(false));
    fetchKanbanManut()
      .then(data => setKanbanManut(data))
      .catch(err => console.error('Falha ao carregar Kanban Manutenção:', err))
      .finally(() => setLoadingManut(false));
    fetchKanbanOS()
      .then(({ kanban, summary }) => { setKanbanOS(kanban); setOsSummary(summary); })
      .catch(err => console.error('Falha ao carregar Ordens de Serviço:', err))
      .finally(() => setLoadingOS(false));
  }, []);

  const tabs = [
    { key: 'checklists', label: 'Checklists preenchidos', count: checklists.total, icon: <IconList size={14} strokeWidth={1.5} /> },
    { key: 'disp', label: 'Kanban de Disponibilidade', count: kanbanDisp.total, icon: <IconLayout size={14} strokeWidth={1.5} /> },
    { key: 'manut', label: 'Kanban de Manutenção', count: kanbanManut.total, icon: <IconWrench size={14} strokeWidth={1.5} /> },
    { key: 'os', label: 'Ordens de Serviço', count: kanbanOS.total, icon: <IconWrench size={14} strokeWidth={1.5} /> },
  ];

  const titleByView = {
    checklists: <span><span className="text-3xl font-semibold"><CountNumber value={checklists.total} /></span> checklists preenchidos</span>,
    disp: <span>Kanban de Disponibilidade <span className="text-muted font-normal">ao vivo</span></span>,
    manut: <span>Kanban de Manutenção <span className="text-muted font-normal">ao vivo</span></span>,
    os: <span>Ordens de Serviço <span className="text-muted font-normal">ao vivo</span></span>,
  };
  const subtitleByView = {
    checklists: 'Entrada e saída de frota digitalizada desde o primeiro dia. Rastreabilidade ponta-a-ponta.',
    disp: 'Espelho do quadro de ativos na plataforma Rabbot — toda placa, todo status, atualizado ao vivo pela operação.',
    manut: 'Fluxo completo das ordens de manutenção — do apontamento à liberação com pendência.',
    os: 'Visão completa das ordens de serviço — por área, status e complexidade.',
  };

  return (
    <Section id="checklists" className="bg-white border-y border-stone-200/70">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-[1.15] text-ink">{titleByView[view]}</h2>
          <p className="mt-2 text-sm text-subink max-w-2xl leading-relaxed">{subtitleByView[view]}</p>
        </div>
        <a href="https://app-v3.rabbot.co/" target="_blank" rel="noopener noreferrer"
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
          {loadingChecklist ? (
            <div className="mt-10 text-center py-12 text-muted text-sm">Carregando checklists...</div>
          ) : (
            <div className="mt-10"><ChecklistCarousel items={checklists.sample} /></div>
          )}
        </Reveal>
      )}

      {view === 'disp' && (
        <Reveal>
          {loadingDisp ? (
            <div className="mt-10 text-center py-12 text-muted text-sm">Carregando dados de disponibilidade...</div>
          ) : (
            <>
              <div className="mt-10"><KanbanBoard data={kanbanDisp} /></div>
              <div className="mt-3 text-[11px] text-muted flex items-center gap-2">
                <IconInfo size={12} strokeWidth={1.5} />
                Total rastreado: {kanbanDisp.total} ativos · arraste para ver todas as colunas
              </div>
            </>
          )}
        </Reveal>
      )}

      {view === 'manut' && (
        <Reveal>
          {loadingManut ? (
            <div className="mt-10 text-center py-12 text-muted text-sm">Carregando dados de manutenção...</div>
          ) : (
            <>
              <div className="mt-10"><KanbanBoard data={kanbanManut} emptyLabel="Nenhum card nessa etapa" /></div>
              <div className="mt-3 text-[11px] text-muted flex items-center gap-2">
                <IconInfo size={12} strokeWidth={1.5} />
                Total no fluxo de manutenção: {kanbanManut.total} ordens · arraste para ver todas as colunas
              </div>
            </>
          )}
        </Reveal>
      )}

      {view === 'os' && (
        <Reveal>
          {loadingOS ? (
            <div className="mt-10 text-center py-12 text-muted text-sm">Carregando ordens de serviço...</div>
          ) : (
            <>
              <div className="mt-10"><OSKanbanBoard data={kanbanOS} summary={osSummary} /></div>
              <div className="mt-3 text-[11px] text-muted flex items-center gap-2">
                <IconInfo size={12} strokeWidth={1.5} />
                Total de ordens: {kanbanOS.total} · arraste para ver todas as colunas
              </div>
            </>
          )}
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
      <SectionHeader title="O que vai mudar na sua operação" subtitle="Do controle manual e fragmentado para uma plataforma integrada." />
      <Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {/* ANTES */}
          <div className="bg-white border border-stone-200/70 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 pt-4 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-stone-100 text-muted px-2 py-0.5 rounded">Hoje</span>
              <h3 className="mt-2 text-base font-semibold text-ink">Planilha manual e comunicação fragmentada</h3>
              <p className="text-sm text-muted mt-1">Sem checklist de disponibilidade, preenchimento manual em planilha e comunicação fragmentada entre áreas.</p>
            </div>
            <div className="p-4 flex-1">
              <div className="rounded-lg overflow-hidden border border-stone-200/70">
                <img src="assets/planilha.jpeg" alt="Planilha manual" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          {/* DEPOIS */}
          <div className="bg-white border-2 border-brand-200 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 pt-4 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded">Com a Rabbot</span>
              <h3 className="mt-2 text-base font-semibold text-ink">Kanban integrado em tempo real</h3>
              <p className="text-sm text-muted mt-1">Visibilidade entre todas as áreas, checklists digitais e ações automáticas sobre os dados.</p>
            </div>
            <div className="p-4 flex-1">
              <div className="rounded-lg overflow-hidden border border-stone-200/70">
                <img src="assets/kanbanrabbot.png" alt="Kanban Rabbot" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Antes × Depois */}
      <Reveal delay={300}>
        <div className="mt-12 pt-10 border-t border-stone-200/70">
          <div className="grid md:grid-cols-2 gap-6">
            {/* ANTES */}
            <div className="bg-white border border-stone-200/70 rounded-xl p-6">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded">Antes</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">Processo manual e fragmentado</h3>
              <p className="text-sm text-muted mt-1 mb-6">Como a operação funciona hoje</p>

              <div className="space-y-5">
                {[
                  { title: 'Planilha manual de disponibilidade', desc: 'Google Sheets com 200+ carretas atualizada manualmente — dados desatualizados em horas.', tag: 'Frota visível só pra quem mantém a planilha' },
                  { title: 'B-Time, MO e SAP desconectados', desc: 'Apontamento no B-Time não gera OS — responsável re-digita tudo manualmente no MO.', tag: '3 digitações para 1 evento' },
                  { title: 'OS abertas com atraso e retrabalho', desc: 'Intervalo entre apontamento e abertura de OS depende de ação humana intermediária.', tag: 'Tempo produtivo perdido por Alessandro' },
                  { title: 'Carretas ociosas sem alerta', desc: 'Carretas paradas no bolsão Jato (ou no pátio) sem notificação automática.', tag: 'Custo de imobilização invisível' },
                  { title: 'Disponibilidade por ligação/WhatsApp', desc: 'Marcos Alcar e Alessandro tomam decisões sem dados consolidados em tempo real.', tag: 'Decisão baseada em feeling' },
                  { title: 'Sem histórico por placa', desc: 'Reincidências não identificadas — mesmo problema repetido no mesmo ativo sem alerta.', tag: 'Retrabalho e custos ocultos' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                        <IconAlert size={14} strokeWidth={1.5} className="text-stone-400" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-ink">{item.title}</div>
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    <div className="mt-2 ml-11 text-xs font-medium text-red-500">{item.tag}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DEPOIS */}
            <div className="bg-white border-2 border-brand-200 rounded-xl p-6">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded">Depois</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">Operação digital com Rabbot</h3>
              <p className="text-sm text-muted mt-1 mb-6">Como fica a partir da implementação</p>

              <div className="space-y-5">
                {[
                  { title: 'Kanban de disponibilidade em tempo real', desc: 'Alessandro e Marcos Alcar veem toda a frota ao vivo — por tipo, status e localização.', tag: 'Substitui a planilha Google Sheets' },
                  { title: 'Checklist Rabbot substitui o B-Time', desc: 'Motorista preenche no app → card vai ao kanban → OS aberta automaticamente no MO.', tag: 'Zero re-digitação manual' },
                  { title: 'Abertura automática de OS + baixa no SAP', desc: 'OS gerada na Rabbot sincroniza com MO e baixa no SAP — sem nenhuma etapa manual.', tag: 'Fim da duplicação entre sistemas' },
                  { title: 'Agente IA alerta carreta ociosa', desc: 'Carreta parada além do limite gera alerta automático — inclui bolsões externos (Jato).', tag: 'Custo de imobilização eliminado' },
                  { title: 'Dashboard disponível 24/7 por placa', desc: 'Sider, baú, prancha, truque — status, MTBF, MTTR e ranking de produtividade em tempo real.', tag: 'Decisão baseada em dados' },
                  { title: 'Histórico unificado por placa', desc: 'Reincidências identificadas automaticamente — mesmo problema gera alerta para Alessandro.', tag: 'Retrabalho eliminado' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                        <IconCheck size={14} strokeWidth={1.5} className="text-brand-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-ink">{item.title}</div>
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    <div className="mt-2 ml-11 text-xs font-medium text-brand-600">{item.tag}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

Object.assign(window, { ChecklistsSection, AntesDepoisSection });
