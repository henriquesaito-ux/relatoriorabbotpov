// Mock data for Rodojacto report
const CLIENT = {
  name: 'Rodojacto',
  city: 'Oriente — SP',
  fleet: { cavalos: 27, carretas: 98 },
  sponsor: 'Marcos Brasil',
  sponsorRole: 'Processos, Qualidade e Tecnologia',
  responsavel: 'Gustavo Carlino',
  responsavelRole: 'Customer Success Rabbot',
  periodStart: '14/04/2026',
  periodEnd: '28/04/2026',
  blitzDate: '22/04/2026',
  participantes: 3,
};

const TEAM = [
  { name: 'Marcos Aukar', role: 'Diretor Geral Rodojacto' },
  { name: 'Marcos Brasil', role: 'Ger. Processos e Inovação' },
  { name: 'Fábio Tadal', role: 'Ger. Torre de Controle' },
  { name: 'Alessandro Trinca', role: 'Ger. Manutenção' },
  { name: 'Marcio Trambaioli', role: 'Ger. Operacional' },
  { name: 'Marcos Garcia', role: 'Compras' },
];

const TIMELINE = [
  { label: 'Briefing', time: '08h00', desc: 'Briefing com Marcos Brasil e alinhamento do dia.' },
  { label: 'Manutenção', time: '09h00', desc: 'Apresentação do time de manutenção.' },
  { label: 'Inspeção', time: '09h30', desc: 'Inspeção de pátio e manutenção até 12h.' },
  { label: 'Almoço', time: '12h00', desc: 'Pausa para almoço.' },
  { label: 'Preparação', time: '13h00', desc: 'Preparação da apresentação com dados coletados.' },
  { label: 'Reunião Aukar', time: '14h30', desc: 'Reunião com Marcos Aukar, Diretor Geral.' },
  { label: 'Apresentação', time: '15h30', desc: 'Apresentação para o restante do time até 17h.' },
];

const DIAG = [
  { dim: 'Qualidade de Dados', level: 2, status: 'Possui BTime, MO e SAP, mas não estão conectados. Falta de dados em tempo real.' },
  { dim: 'Gestão das Informações', level: 3, status: '3 sistemas e algumas digitações manuais. Disponibilidade com preenchimento manual.' },
  { dim: 'Visão Sistêmica', level: 3, status: 'Planilha de disponibilidade existe, mas é manual. BTime importante, mas com ressalvas.' },
  { dim: 'Resultados (KPIs)', level: 2, status: 'Há dashboards, mas não são simples e dependem de preenchimentos manuais.' },
];

const PHASES = [
  { key: 'reativo', title: 'Modelo Reativo', sub: 'Fase 0', pct: 60, desc: 'Processos 100% analógicos, checklists de papel, telefone e e-mails, sem controle de processos nem visibilidade da operação.' },
  { key: 'adaptativo', title: 'Modelo Adaptativo', sub: 'Fase 1', pct: 25, desc: 'Controles de processos feitos por checklists de papel e planilhas de Excel alimentadas de forma manual.' },
  { key: 'proativo', title: 'Modelo Proativo', sub: 'Fase 2', pct: 10, desc: 'Controles de processos feitos em ERPs e/ou outros sistemas, com dados coletados manual/digitalmente e visibilidade em tempo real, com baixo grau de automação.' },
  { key: 'preditivo', title: 'Modelo Preditivo', sub: 'Fase 3', pct: 5, desc: 'Integração das informações de checklists digitais e sistemas, garantindo visão 360° da operação e atualizações em tempo real, com alto grau de automação, incluindo decisões automatizadas.' },
];

// ── Checklists API integration ──
function formatChecklistDate(isoDate) {
  const d = new Date(isoDate);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month} · ${hours}h${mins}`;
}

function extractChecklistImages(questions) {
  const imgs = [];
  (questions || []).forEach(q => {
    (q.categoryAppointments || []).forEach(ca => {
      (ca.items || []).forEach(ci => {
        if (ci.photo && ci.photo.startsWith('http')) imgs.push(ci.photo);
      });
    });
  });
  return imgs;
}

function transformChecklistItem(item) {
  const photos = extractChecklistImages(item.questions);
  return {
    code: item.id,
    type: item.form?.title || '',
    when: formatChecklistDate(item.submittedDate),
    who: item.user?.name || '',
    plate: item.asset?.identification || '',
    place: [item.address?.city, item.address?.state].filter(Boolean).join(' — ') || '',
    address: [item.address?.street, item.address?.city, item.address?.state].filter(Boolean).join(', '),
    photos,
    questions: (item.questions || []).filter(q => q.type !== 'SIGNATURE'),
    lat: item.address?.geolocation?.latitude,
    lng: item.address?.geolocation?.longitude,
  };
}

function buildChecklistWeekly(items) {
  const weeks = {};
  items.forEach(item => {
    const d = new Date(item.submittedDate);
    const weekNum = Math.ceil(d.getDate() / 7);
    const key = `Sem ${weekNum}`;
    weeks[key] = (weeks[key] || 0) + 1;
  });
  return Object.entries(weeks)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, n]) => ({ week, n }));
}

async function fetchChecklists() {
  const now = new Date();
  const endDate = String(now.getDate()).padStart(2, '0') + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + now.getFullYear();
  const res = await fetch('https://api-v3.rabbot.co/v1/saas/formsAnswer/search', {
    method: 'POST',
    headers: RABBOT_HEADERS,
    body: JSON.stringify({
      query: [
        { fieldName: 'saveDate', operator: 'GREATER_THAN_OR_EQUAL_TO', values: ['30/03/2026'] },
        { fieldName: 'saveDate', operator: 'LESS_THAN_OR_EQUAL_TO', values: [endDate] },
      ],
      sorting: [{ fieldName: 'saveDate', order: 'DESCENDING' }],
      pagination: { pageNumber: 1, pageSize: 1000 },
    }),
  });
  if (!res.ok) throw new Error('Checklists API error: ' + res.status);
  const data = await res.json();
  const items = data.items || [];
  return {
    total: items.length,
    sample: items.map(transformChecklistItem),
    weekly: buildChecklistWeekly(items),
  };
}

const CHECKLIST_FALLBACK = { total: 0, sample: [], weekly: [] };

// ── Kanban API integration ──
const RABBOT_API = 'https://api-v3.rabbot.co/v1/agentic/process/board';
const RABBOT_HEADERS = {
  'Content-Type': 'application/json',
  'Tenant-Id': '69cc049f95346de3a4e3d935',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIzMjQ4NmZlYi0zNDBlLTQ2MjMtYjc2Ny1iNDhiNjg0NzQ5ZjIiLCJUZW5hbnRzIjoiW10iLCJDdXJyZW50VGVuYW50SWQiOiI2NmNmMzVkMWQ0NzEzNDkwZDg5MzYyM2IiLCJQcm9maWxlIjoiU3VwZXJBZG1pbmlzdHJhdG9yIiwiVXNlcklkTGVnYWN5IjoiMCIsIlVzZXJEZXNjcmlwdGlvbiI6IiIsIm5hbWVpZCI6InJvb3RAcmFiYm90LmNvIiwidW5pcXVlX25hbWUiOiJSb290IFJhYmJvdCIsImVtYWlsIjoicm9vdEByYWJib3QuY28iLCJqdGkiOiJkZDIzMzMyNS0yMzU4LTQwODQtYjQwMS1jMmY4ZmUxOTBmYjYiLCJNZW51cyI6IltdIiwiU2V0dGluZ3MiOiJbXSIsIkJvYXJkQWNjZXNLaW5kIjoiMSIsIm5iZiI6MTc3Njg1MDA0OCwiZXhwIjoxODA3OTY4NDQ4LCJpYXQiOjE3NzY4NjQ0NDgsImlzcyI6Imh0dHBzOi8vYXV0aC5yYWJib3QuY28iLCJhdWQiOiJodHRwczovL2F1dGgucmFiYm90LmNvIn0.-eNdMP1GXYkHnF6PDNYupF_agUnbj0rbpDwrjRrknBM',
};
const RABBOT_PAYLOAD = {
  deliveryDate: null, members: [], processTime: null, slaColumn: null,
  sorting: 'DeliveryDate', sortingOrder: 'ASCENDING', tags: [], columns: [],
  updates: null, pagination: { pageNumber: 1, pageSize: 1000 },
};

const BOARD_ID_DISP = '69d7b56f580bb0ae4c682e42';
const BOARD_ID_MANUT = '69d8dc085c0617ed4a478e33';

// Column order & tone mapping for each board
const DISP_COLUMNS = [
  { key: 'disponivel', title: 'Disponível', tone: 'brand' },
  { key: 'rota', title: 'Em Rota', tone: 'purple' },
  { key: 'indisp', title: 'Indisponível', tone: 'pink' },
  { key: 'espera', title: 'Espera Operacional', tone: 'amber' },
  { key: 'manut', title: 'Manutenção', tone: 'brown' },
];

const MANUT_COLUMNS = [
  { key: 'problemas', title: 'Problemas Apontados', tone: 'neutral' },
  { key: 'aguardando', title: 'Ag. Manutenção', tone: 'brown' },
  { key: 'iniciada', title: 'Manutenção Iniciada', tone: 'brown' },
  { key: 'final', title: 'Finalizada', tone: 'neutral' },
  { key: 'pendencia', title: 'Liberado com Pendência', tone: 'orange' },
];

function formatElapsed(ms) {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return '<1min';
  if (mins < 60) return mins + 'min';
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hours < 24) return remMins > 0 ? hours + 'h' + String(remMins).padStart(2, '0') : hours + 'h';
  const days = Math.floor(hours / 24);
  return days + 'd';
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function darkenHex(hex, factor) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
}

function truncateTag(name, max) {
  if (!name) return '';
  if (name.length <= max) return name;
  return name.slice(0, max - 3).trim() + '...';
}

function transformBoardData(items, columnsConfig) {
  const now = Date.now();
  const grouped = {};
  columnsConfig.forEach(c => { grouped[c.title] = []; });

  items.forEach(item => {
    const colName = item.columnName;
    if (!grouped[colName]) grouped[colName] = [];
    const movedAt = new Date(item.movedat).getTime();
    const elapsed = now - movedAt;
    grouped[colName].push({
      plate: item.asset.identification,
      sub: item.subTitle || '',
      tag: truncateTag(item.tag?.name, 18),
      tagColor: item.tag?.color || null,
      time: formatElapsed(elapsed),
      parked: formatElapsed(elapsed),
      stripes: elapsed < 86400000 ? 1 : elapsed < 259200000 ? 2 : 3,
    });
  });

  const cols = columnsConfig.map(cfg => {
    const cards = grouped[cfg.title] || [];
    return { key: cfg.key, title: cfg.title, count: cards.length, tone: cfg.tone, cards };
  });

  return { cols, total: items.length };
}

async function fetchBoard(boardId) {
  const res = await fetch(`${RABBOT_API}/${boardId}/search`, {
    method: 'POST', headers: RABBOT_HEADERS, body: JSON.stringify(RABBOT_PAYLOAD),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.items || [];
}

async function fetchKanbanDisp() {
  const items = await fetchBoard(BOARD_ID_DISP);
  return transformBoardData(items, DISP_COLUMNS);
}

async function fetchKanbanManut() {
  const items = await fetchBoard(BOARD_ID_MANUT);
  return transformBoardData(items, MANUT_COLUMNS);
}

// Fallback mock data (used if API fails)
const KANBAN_DISP_FALLBACK = { cols: DISP_COLUMNS.map(c => ({ ...c, count: 0, cards: [] })), total: 0 };
const KANBAN_MANUT_FALLBACK = { cols: MANUT_COLUMNS.map(c => ({ ...c, count: 0, cards: [] })), total: 0 };

// Antes x Depois
const BEFORE_AFTER = [
  {
    before: 'Sem checklist de disponibilidade',
    after: 'Checklist Rabbot',
    impact: 'Preenchimento manual → digital',
    desc: 'Hoje o controle de disponibilidade é feito em planilha, preenchida manualmente, sem rastreabilidade.',
    image: 'assets/planilha.jpeg',
  },
  {
    before: 'BTime com pouca integração',
    after: 'Kanban de Ativos',
    impact: 'Comunicação entre áreas fragmentada',
    desc: 'O BTime não se comunica bem entre áreas e tem pouca integração com outros sistemas.',
  },
  {
    before: 'Controle manual de problemas',
    after: 'OS digital',
    impact: 'Dificuldade em identificar problemas',
    desc: 'Hoje há dificuldade em identificar os problemas apontados nos ativos e dar visibilidade para a operação.',
    image: 'assets/whatsapp.png',
  },
];

// Projeção
function projectarFrota(pctMigrada) {
  const totalAtivos = 125;
  const migrados = Math.round((pctMigrada / 100) * totalAtivos);
  const economiaMes = migrados * 1850;
  const horasMes = migrados * 3.4;
  const placasVirtuais = Math.round(migrados * 0.18);
  const investimentoMes = migrados * 240;
  const roi = investimentoMes > 0 ? ((economiaMes - investimentoMes) / investimentoMes) * 100 : 0;
  const serie = Array.from({ length: 12 }, (_, i) => ({
    mes: ['Mai','Jun','Jul','Ago','Set','Out','Nov','Dez','Jan','Fev','Mar','Abr'][i],
    acum: economiaMes * (i + 1),
  }));
  return {
    economia: economiaMes * 12,
    horas: Math.round(horasMes * 12),
    placas: placasVirtuais,
    roi: Math.round(roi),
    serie,
  };
}

// Plano 90 dias
const MILESTONES = [
  { day: 'Dia 0', title: 'Go-live POV', desc: 'Onboarding de 6 operadores. Pátio Oriente migrado.' },
  { day: 'Dia 30', title: 'Checklists 100%', desc: 'Entrada/saída digital para 100% da frota ativa.' },
  { day: 'Dia 60', title: 'OS conectada', desc: 'Oficina e compras no mesmo fluxo; SLA de peças visível.' },
  { day: 'Dia 90', title: 'Proativo', desc: 'Rotinas preditivas ligadas; meta Fase 2 atingida.' },
];

const ENTREGAS = [
  { entrega: 'Onboarding operadores (6)', resp: 'Rabbot', prazo: 'D+7', tone: 'brand' },
  { entrega: 'Migração pátio Oriente', resp: 'Ambos', prazo: 'D+15', tone: 'neutral' },
  { entrega: 'Integração ERP (Sankhya)', resp: 'Cliente', prazo: 'D+30', tone: 'dark' },
  { entrega: 'Rollout filial Garça', resp: 'Rabbot', prazo: 'D+45', tone: 'brand' },
  { entrega: 'Relatório de meio-POV', resp: 'Rabbot', prazo: 'D+60', tone: 'brand' },
  { entrega: 'Go-live preditivo', resp: 'Ambos', prazo: 'D+90', tone: 'neutral' },
];

// ── OS API integration ──
const CATEGORY_TONE = {
  'Mecânica': 'brand',
  'Elétrica': 'amber',
  'Borracharia': 'neutral',
};

const COMPLEXITY_MAP = {
  'b8e2f02d-244f-4aa0-8e99-6720c8803860': { label: 'Simples', bars: 1 },
  '0432a16f-d5d1-441c-9b6b-16132cb47de5': { label: 'Médio', bars: 2 },
  '0e231c53-0a83-445a-952e-e6f3b7a8b5a3': { label: 'Complexo', bars: 3 },
};

function transformOSItem(item, catColorMap) {
  const now = Date.now();
  const created = new Date(item.createdAt).getTime();
  const elapsed = formatElapsed(now - created);
  const cat = (item.categories && item.categories[0]) || {};
  const areaTone = CATEGORY_TONE[cat.name] || 'neutral';
  const compKey = item.complexity?.key;
  const comp = COMPLEXITY_MAP[compKey];
  const critPrio = item.criticity?.priority;
  const CRIT_FALLBACK = { 1: { label: 'Baixa', bars: 1 }, 2: { label: 'Média', bars: 2 }, 3: { label: 'Alta', bars: 3 }, 4: { label: 'Urgente', bars: 3 } };
  const critFallback = critPrio ? CRIT_FALLBACK[critPrio] : null;
  const resolved = comp || critFallback;
  const fields = item.fields || [];
  const subParts = fields.map(f => f.value).filter(Boolean);
  const resp = (item.childrenResponsibles || []).map(r => r.name).join(', ');
  const deadline = item.deadlineInfo || {};
  const isDone = item.step?.name === 'Concluída';

  return {
    os: '#' + item.osNumber,
    plate: item.asset?.identification || '',
    sub: subParts.length ? subParts.join(' ') : '',
    setor: 'Manutenção',
    resp: resp || undefined,
    area: cat.name || '',
    areaColor: cat.color || catColorMap[cat.key] || null,
    areaTone,
    done: isDone,
    complex: comp ? comp.label : undefined,
    complexBars: resolved ? resolved.bars : 0,
    tempo: elapsed + ' em aberto',
    previsto: deadline.expectedTime || undefined,
    atraso: deadline.status === 'DELAYED' ? (deadline.statusTime + ' (' + deadline.childReference + ')') : undefined,
  };
}

function transformOSData(apiData) {
  const steps = apiData.steps || [];

  // Build color map by category key (use first non-empty color found)
  const catColorMap = {};
  steps.forEach(step => {
    step.items.forEach(item => {
      (item.categories || []).forEach(c => {
        if (c.color && !catColorMap[c.key]) catColorMap[c.key] = c.color;
      });
    });
  });

  const cols = steps.map(step => ({
    key: step.stepKey,
    title: step.stepName,
    count: step.metadata.itemsCount,
    tone: step.stepName === 'Concluída' ? 'brand' : step.stepName === 'Em Progresso' ? 'purple' : 'neutral',
    cards: step.items.map(item => transformOSItem(item, catColorMap)),
  }));
  const total = cols.reduce((s, c) => s + c.count, 0);

  // Build summary by category
  const catMap = {};
  steps.forEach(step => {
    step.items.forEach(item => {
      const cat = (item.categories && item.categories[0])?.name || 'Outros';
      if (!catMap[cat]) catMap[cat] = { area: cat, tone: CATEGORY_TONE[cat] || 'neutral', aberta: 0, progresso: 0, concluida: 0 };
      if (step.stepName === 'Aberta') catMap[cat].aberta++;
      else if (step.stepName === 'Em Progresso') catMap[cat].progresso++;
      else if (step.stepName === 'Concluída') catMap[cat].concluida++;
    });
  });
  const summary = Object.values(catMap).sort((a, b) => (b.aberta + b.progresso + b.concluida) - (a.aberta + a.progresso + a.concluida));

  return { kanban: { cols, total }, summary };
}

function getTodayFormatted() {
  const d = new Date();
  return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
}

async function fetchKanbanOS() {
  const res = await fetch('https://api-v3.rabbot.co/v1/saas/serviceorder/search', {
    method: 'POST',
    headers: RABBOT_HEADERS,
    body: JSON.stringify({
      step: '', pagination: { pageNumber: 1, pageSize: 200 },
      sorting: '', sortingOrder: 'DESCENDING', filter: '',
      category: null, complexity: null, criticity: null,
      delayedOnly: false, fields: [], filterFields: [],
      stepDateFilters: [],
    }),
  });
  if (!res.ok) throw new Error('OS API error: ' + res.status);
  const data = await res.json();
  return transformOSData(data);
}

const KANBAN_OS_FALLBACK = { cols: [], total: 0 };
const OS_SUMMARY_FALLBACK = [];

Object.assign(window, {
  CLIENT, TEAM, TIMELINE, DIAG, PHASES,
  CHECKLIST_FALLBACK, fetchChecklists,
  KANBAN_DISP_FALLBACK, KANBAN_MANUT_FALLBACK, fetchKanbanDisp, fetchKanbanManut,
  hexToRgb, darkenHex,
  BEFORE_AFTER, projectarFrota, MILESTONES, ENTREGAS,
  KANBAN_OS_FALLBACK, OS_SUMMARY_FALLBACK, fetchKanbanOS,
});
