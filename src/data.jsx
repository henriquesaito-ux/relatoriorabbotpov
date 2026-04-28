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
  blitzDate: '14/04/2026',
  participantes: 6,
};

const TEAM = [
  { name: 'Marcos Brasil', role: 'Processos · Qualidade' },
  { name: 'Wilson Tavares', role: 'Ger. Manutenção' },
  { name: 'Carla Mendes', role: 'Operações' },
  { name: 'Douglas Ramos', role: 'Líder Pátio' },
  { name: 'Gustavo Carlino', role: 'Rabbot · CS' },
  { name: 'Ana Prado', role: 'Rabbot · Implantação' },
];

const TIMELINE = [
  { label: 'Manhã', time: '08h30', desc: 'Kick-off, tour pelo pátio e mapeamento de dores.' },
  { label: 'Almoço', time: '12h00', desc: 'Alinhamento com liderança e definição de KPIs.' },
  { label: 'Tarde', time: '14h00', desc: 'Workshop: checklists, OS e fluxo atual.' },
  { label: 'Encerramento', time: '17h30', desc: 'Plano de POV, responsáveis e próximos passos.' },
];

const DIAG = [
  { dim: 'Qualidade de Dados', level: 2, status: 'Planilhas fragmentadas; dados em WhatsApp.' },
  { dim: 'Gestão das Informações', level: 2, status: 'Sem fonte única; retrabalho alto.' },
  { dim: 'Visão Sistêmica', level: 3, status: 'Processos mapeados, execução inconsistente.' },
  { dim: 'Resultados (KPIs)', level: 2, status: 'Indicadores reativos, sem meta clara.' },
];

const PHASES = [
  { key: 'reativo', title: 'Reativo', sub: 'Fase 0', pct: 60, desc: 'Apaga incêndios. Sem padrão. Decisões por memória.' },
  { key: 'adaptativo', title: 'Adaptativo', sub: 'Fase 1', pct: 25, desc: 'Processos existem, mas vivem em planilhas e pessoas.' },
  { key: 'proativo', title: 'Proativo', sub: 'Fase 2', pct: 10, desc: 'Dados centralizados. Ação antes do problema escalar.' },
  { key: 'preditivo', title: 'Preditivo', sub: 'Fase 3', pct: 5, desc: 'Modelos antecipam falhas. Operação orquestrada por sinais.' },
];

// 84 checklists — generate grid sample
const CHECKLIST_SAMPLE = [
  { code: 'F0C5F58', type: 'Entrada', when: '14/04 · 08h47', who: 'Douglas Ramos', plate: 'RBT-4A21', place: 'Pátio Oriente' },
  { code: 'F0C5F73', type: 'Saída', when: '14/04 · 10h12', who: 'Julia Sato', plate: 'RBT-8C04', place: 'Pátio Oriente' },
  { code: 'F0C60A1', type: 'Entrada', when: '15/04 · 06h33', who: 'Paulo Neves', plate: 'RBT-2E99', place: 'Filial Garça' },
  { code: 'F0C6211', type: 'Entrada', when: '16/04 · 07h58', who: 'Douglas Ramos', plate: 'RBT-9F47', place: 'Pátio Oriente' },
  { code: 'F0C62F8', type: 'Saída', when: '17/04 · 14h01', who: 'Julia Sato', plate: 'RBT-3B12', place: 'Pátio Oriente' },
  { code: 'F0C63D2', type: 'Entrada', when: '18/04 · 09h21', who: 'Marcos Lira', plate: 'RBT-5D77', place: 'Filial Garça' },
];

const CHECKLIST_WEEKLY = [
  { week: 'Sem 1', n: 22 }, { week: 'Sem 2', n: 28 }, { week: 'Sem 3', n: 18 }, { week: 'Sem 4', n: 16 },
];

// Kanban — Disponibilidade
const KANBAN_DISP = {
  cols: [
    {
      key: 'disponivel', title: 'Disponível', count: 68, tone: 'brand',
      cards: [
        { plate: 'HNP3I88', tag: 'FIM DE VIA...', tagTone: 'brand', time: '5h02', parked: '6d', stripes: 1 },
        { plate: 'CLJ9554', tag: 'FIM DE VIA...', tagTone: 'brand', time: '15h32', parked: '4d', stripes: 1 },
        { plate: 'EVO6A62', tag: 'FIM DE VIA...', tagTone: 'brand', time: '1d', parked: '6d', stripes: 1 },
        { plate: 'BXC4F77', tag: 'FIM DE VIA...', tagTone: 'brand', time: '1d', parked: '6d', stripes: 1 },
        { plate: 'DAJ8F69', tag: 'FIM DE VIA...', tagTone: 'brand', time: '1d', parked: '6d', stripes: 1 },
      ],
    },
    {
      key: 'rota', title: 'Em Rota', count: 46, tone: 'purple',
      cards: [
        { plate: 'CLJ9710', tag: 'REINICIO D...', tagTone: 'purple', time: '1h', parked: '2d', stripes: 1 },
        { plate: 'MKI6E90', tag: 'REINICIO D...', tagTone: 'purple', time: '9h32', parked: '6d', stripes: 1 },
        { plate: 'EJY1G84', tag: 'REINICIO D...', tagTone: 'purple', time: '16h31', parked: '1d', stripes: 1 },
        { plate: 'FOK6909', sub: '6021', tag: 'REINICIO D...', tagTone: 'purple', time: '1d', parked: '2d', stripes: 2 },
        { plate: 'FBW0992', sub: 'Baú 3 eixos Distanciados (Trava)', tag: 'Em Rota', tagTone: 'blueLight', time: '1d', parked: '2d', stripes: 3 },
      ],
    },
    {
      key: 'indisp', title: 'Indisponível', count: 21, tone: 'pink',
      cards: [
        { plate: 'CLJ9613', sub: 'Sider 2 eixos – Bitrem', tag: 'Carregado', tagTone: 'pink', time: '1d', parked: '2d', stripes: 1 },
        { plate: 'TJE4H15', sub: 'Baú 3 eixos – (Trava) – MARONI', tag: 'Carregado', tagTone: 'pink', time: '1d', parked: '2d', stripes: 2 },
        { plate: 'CLJ9482', sub: 'Sider 3 eixos Distanciado – Assoalho de Madeira', tag: 'Carregado', tagTone: 'pink', time: '1d', parked: '2d', stripes: 1 },
        { plate: 'CLJ9531', sub: 'Sider 3 eixos Distanciado – Modificada', tag: 'Carregado', tagTone: 'pink', time: '1d', parked: '2d', stripes: 1 },
        { plate: 'CLJ9635', sub: 'Sider 2 eixos – Bitrem', tag: 'Carregado', tagTone: 'pink', time: '1d', parked: '2d', stripes: 3 },
      ],
    },
    {
      key: 'espera', title: 'Espera Operacional', count: 6, tone: 'amber',
      cards: [
        { plate: 'FJX2F65', tag: 'PARADA EV...', tagTone: 'amber', time: '1min', parked: '1d', stripes: 1 },
        { plate: 'CLJ9F80', tag: 'PARADA EV...', tagTone: 'amber', time: '1min', parked: '1d', stripes: 1 },
        { plate: 'FIM1H96', tag: 'PARADA EV...', tagTone: 'amber', time: '1min', parked: '1d', stripes: 1 },
        { plate: 'BWC9590', tag: 'PARADA EV...', tagTone: 'amber', time: '2h01', parked: '1d', stripes: 1 },
        { plate: 'JBR5I80', tag: 'PARADA EV...', tagTone: 'amber', time: '7h32', parked: '1d', stripes: 1 },
      ],
    },
    {
      key: 'problemas', title: 'Problemas Apontados', count: 0, tone: 'neutral', cards: [],
    },
    {
      key: 'manut', title: 'Manutenção', count: 22, tone: 'brown',
      cards: [
        { plate: 'GEK3632', sub: 'Baú 3 eixos Distanciados (Trava)', tag: 'Manutenção', tagTone: 'brown', time: '1d', parked: '2d', stripes: 1, alert: '22/04 16:20' },
        { plate: 'CLJ9505', sub: 'Carga Seca 3 eixos Extensível', tag: 'Manutenção', tagTone: 'brown', time: '1d', parked: '2d', stripes: 1 },
        { plate: 'CLJ9456', sub: 'Sider 3 eixos Distanciado – Assoalho de Chapa', tag: 'Manutenção', tagTone: 'brown', time: '1d', parked: '2d', stripes: 1 },
        { plate: 'CLJ9539', sub: 'Baú 3 eixos', tag: 'Manutenção', tagTone: 'brown', time: '1d', parked: '2d', stripes: 1 },
        { plate: 'DHL5B96', tag: 'Manutenção', tagTone: 'brown', time: '1d', parked: '2d', stripes: 1 },
      ],
    },
  ],
  total: 163,
};

// Kanban — Manutenção
const KANBAN_MANUT = {
  cols: [
    { key: 'problemas', title: 'Problemas Apontados', count: 0, tone: 'neutral', cards: [] },
    {
      key: 'aguardando', title: 'Ag. Manutenção', count: 15, tone: 'brown',
      cards: [
        { plate: 'CLJ9505', sub: 'Carga Seca 3 eixos Extensível', tag: 'Corretiva', tagTone: 'brown', time: '2d', parked: '2d', stripes: 1 },
        { plate: 'CLJ9456', sub: 'Sider 3 eixos Distanciado – Assoalho de Chapa', tag: 'Corretiva', tagTone: 'brown', time: '2d', parked: '2d', stripes: 1 },
        { plate: 'CLJ9539', sub: 'Baú 3 eixos', tag: 'Corretiva', tagTone: 'brown', time: '2d', parked: '2d', stripes: 1 },
        { plate: 'GEK3632', sub: 'Baú 3 eixos Distanciados (Trava)', tag: 'Corretiva', tagTone: 'brown', time: '2d', parked: '2d', stripes: 1 },
        { plate: 'FQO3A68', sub: 'Prancha Dupla – 3 eixos – RODOMOURA', tag: 'Corretiva', tagTone: 'brown', time: '2d', parked: '2d', stripes: 1 },
      ],
    },
    {
      key: 'iniciada', title: 'Manutenção Iniciada', count: 9, tone: 'brown',
      cards: [
        { plate: 'FOK6909', sub: '6021', tag: 'Corretiva', tagTone: 'brown', time: '2d', parked: '2d', stripes: 2 },
        { plate: 'DHL5B96', tag: 'Corretiva', tagTone: 'brown', time: '2d', parked: '2d', stripes: 1 },
        { plate: 'FYS4755', sub: '5905', tag: 'Corretiva', tagTone: 'brown', time: '2d', parked: '2d', stripes: 1 },
        { plate: 'NKT6507', sub: 'Baú 3 eixos Distanciados (TETO DE METAL)', tag: 'Corretiva', tagTone: 'brown', time: '2d', parked: '2d', stripes: 1 },
        { plate: 'NKT6337', sub: 'Baú 3 eixos Distanciados (TETO DE METAL)', tag: 'Corretiva', tagTone: 'brown', time: '2d', parked: '2d', stripes: 1 },
      ],
    },
    { key: 'final', title: 'Finalizada', count: 0, tone: 'neutral', cards: [] },
    {
      key: 'pendencia', title: 'Liberado com Pendência', count: 2, tone: 'orange',
      cards: [
        { plate: 'RDJI234', sub: '1234', tag: 'Liberado co...', tagTone: 'orange', time: '1d', parked: '1d', stripes: 2 },
        { plate: 'CLJ9631', sub: 'Sider 2 eixos – Bitrem', tag: 'Liberado co...', tagTone: 'orange', time: '1d', parked: '2d', stripes: 2 },
      ],
    },
  ],
  total: 26,
};

// Antes x Depois
const BEFORE_AFTER = [
  {
    before: 'WhatsApp',
    after: 'Checklist Rabbot',
    impact: 'De 30 min para <5 min',
    quote: 'A gente passou a ter rastreabilidade. Antes era "alguém falou num grupo".',
    who: 'Wilson, Gerente de Manutenção',
  },
  {
    before: 'Planilha Excel',
    after: 'Kanban de Ativos',
    impact: 'De 2h para tempo real',
    quote: 'Agora a liderança abre no celular e sabe a foto do pátio na hora.',
    who: 'Douglas, Líder de Pátio',
  },
  {
    before: 'Papel + caneta',
    after: 'OS digital',
    impact: 'De 18% para 0% OS perdidas',
    quote: 'Nenhuma OS cai mais no vão. A oficina inteira trabalha no mesmo quadro.',
    who: 'Marcos, Processos e Qualidade',
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

Object.assign(window, {
  CLIENT, TEAM, TIMELINE, DIAG, PHASES, CHECKLIST_SAMPLE, CHECKLIST_WEEKLY,
  KANBAN_DISP, KANBAN_MANUT, BEFORE_AFTER, projectarFrota, MILESTONES, ENTREGAS,
});
