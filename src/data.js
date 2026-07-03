// ═══════════════════════════════════════════
//  FRASES MOTIVACIONAIS — Temática Dark Fantasy
// ═══════════════════════════════════════════
export const QUOTES = [
  'Não ouse esmorecer, guerreiro.',
  'A dor de hoje é a força de amanhã.',
  'Cada série é uma runa conquistada.',
  'Os fracos sucumbem. Os fortes persistem.',
  'Sua jornada está longe de acabar.',
  'O trono não se conquista sem sacrifício.',
  'Erga-se, Maculado. Ainda não é hora de descansar.',
  'A gravidade é seu adversário. Domine-a.',
  'Forjado pelo ferro, temperado pela dor.',
  'Você não está cansado. Está se transformando.',
  'O caminho é solitário, mas a glória é eterna.',
  'Cada repetição te afasta do abismo.',
  'Nenhum Elden Lord nasceu forte. Todos foram forjados.',
  'A barra não mente. Seu esforço é a verdade.',
  'Lembre-se por que começou. Agora termine.',
  'Seu corpo é a arma. Afie-a todos os dias.',
  'O descanso é merecido. A desistência, nunca.',
  'Mais uma série. Mais uma runa. Mais perto do trono.',
  'Quando seus braços falharem, sua vontade segura.',
  'Você é mais forte do que o peso que carrega.',
];

// ═══════════════════════════════════════════
//  TÍTULOS — Progressão estilo Elden Ring
// ═══════════════════════════════════════════
export const TITLES = [
  { minLevel: 1,  name: 'Maculado',            subtitle: 'Sem graça, sem runas, sem destino.' },
  { minLevel: 3,  name: 'Vagante',             subtitle: 'Primeiros passos no mundo hostil.' },
  { minLevel: 5,  name: 'Guerreiro',           subtitle: 'O primeiro golpe foi dado.' },
  { minLevel: 8,  name: 'Escudeiro',           subtitle: 'A disciplina começa a florescer.' },
  { minLevel: 10, name: 'Cavaleiro',           subtitle: 'A disciplina forjou sua armadura.' },
  { minLevel: 13, name: 'Paladino',            subtitle: 'Força e honra guiam seus passos.' },
  { minLevel: 15, name: 'Campeão',             subtitle: 'Poucos chegam tão longe.' },
  { minLevel: 18, name: 'Centurião',           subtitle: 'Cem batalhas, nenhuma derrota.' },
  { minLevel: 20, name: 'Lorde',               subtitle: 'Sua força inspira temor.' },
  { minLevel: 25, name: 'Lorde Ancestral',     subtitle: 'Memórias de poder ecoam em você.' },
  { minLevel: 30, name: 'Senhor das Runas',    subtitle: 'O poder corre em suas veias.' },
  { minLevel: 35, name: 'Semideus',            subtitle: 'Entre mortais e deuses, você ascende.' },
  { minLevel: 40, name: 'Elden Lord',          subtitle: 'Você conquistou o Trono Ancestral.' },
];

// ═══════════════════════════════════════════
//  TREINOS — PPL 6x/semana Calistenia + Musculação
// ═══════════════════════════════════════════
export const WORKOUTS = [
  // ── PUSH A ──
  {
    id: 'push-a',
    name: 'PUSH A',
    subtitle: 'Peito • Ombro • Tríceps',
    day: 'Segunda',
    dayNum: 1,
    time: '35-40 min',
    sections: [
      {
        title: 'Skill Work',
        icon: '⭐',
        exercises: [
          { id: 'pa-s1', name: 'Parada de mão na parede', detail: 'barriga virada', sets: 2, reps: '20-30s', rest: 45 },
        ]
      },
      {
        title: 'Calistenia',
        icon: '💎',
        exercises: [
          { id: 'pa-c1', name: 'Flexão',           detail: 'ver progressão', sets: 3, reps: '8-12', rest: 60 },
          { id: 'pa-c2', name: 'Dips',              detail: 'paralela ou banco', sets: 3, reps: '6-10', rest: 60 },
          { id: 'pa-c3', name: 'Pike push-up',      detail: 'ombro', sets: 3, reps: '6-10', rest: 45 },
        ]
      },
      {
        title: 'Musculação',
        icon: '🏋️',
        exercises: [
          { id: 'pa-w1', name: 'Elevação lateral', detail: 'halteres', sets: 3, reps: '12-15', rest: 45 },
        ]
      }
    ]
  },

  // ── PULL A ──
  {
    id: 'pull-a',
    name: 'PULL A',
    subtitle: 'Costas • Bíceps',
    day: 'Terça',
    dayNum: 2,
    time: '35-40 min',
    sections: [
      {
        title: 'Skill Work',
        icon: '⭐',
        exercises: [
          { id: 'pla-s1', name: 'Hang ativo',      detail: 'barra', sets: 2, reps: '20-30s', rest: 45 },
        ]
      },
      {
        title: 'Calistenia',
        icon: '💎',
        exercises: [
          { id: 'pla-c1', name: 'Pull-up',          detail: 'ver progressão', sets: 3, reps: '4-8', rest: 90 },
          { id: 'pla-c2', name: 'Remada invertida',  detail: 'Australian row', sets: 3, reps: '8-12', rest: 60 },
          { id: 'pla-c3', name: 'Chin-up',           detail: 'supinada', sets: 3, reps: 'max', rest: 60 },
        ]
      },
      {
        title: 'Musculação',
        icon: '🏋️',
        exercises: [
          { id: 'pla-w3', name: 'Rosca direta',   detail: 'barra EZ', sets: 3, reps: '10-12', rest: 45 },
        ]
      }
    ]
  },

  // ── LEGS A ──
  {
    id: 'legs-a',
    name: 'LEGS A',
    subtitle: 'Pernas • Core',
    day: 'Quarta',
    dayNum: 3,
    time: '35-40 min',
    sections: [
      {
        title: 'Skill Work',
        icon: '⭐',
        exercises: [
          { id: 'la-s1', name: 'L-sit', detail: 'tucked no chão', sets: 2, reps: '10-20s', rest: 45 },
        ]
      },
      {
        title: 'Calistenia',
        icon: '💎',
        exercises: [
          { id: 'la-c1', name: 'Pistol squat progressão', detail: 'com apoio', sets: 3, reps: '5-8 cada', rest: 60 },
          { id: 'la-c2', name: 'Agachamento búlgaro',     detail: 'peso corporal', sets: 3, reps: '8-12 cada', rest: 60 },
        ]
      },
      {
        title: 'Musculação',
        icon: '🏋️',
        exercises: [
          { id: 'la-w1', name: 'Agachamento livre',  detail: 'barra', sets: 3, reps: '8-12', rest: 75 },
        ]
      },
      {
        title: 'Core',
        icon: '🔥',
        exercises: [
          { id: 'la-co1', name: 'Hollow body hold', detail: '', sets: 3, reps: '20-30s', rest: 30 },
        ]
      }
    ]
  },

  // ── PUSH B ──
  {
    id: 'push-b',
    name: 'PUSH B',
    subtitle: 'Peito • Ombro • Tríceps',
    day: 'Quinta',
    dayNum: 4,
    time: '35-40 min',
    sections: [
      {
        title: 'Skill Work',
        icon: '⭐',
        exercises: [
          { id: 'pb-s1', name: 'Parada de mão na parede', detail: 'costas virada', sets: 2, reps: '15-25s', rest: 45 },
        ]
      },
      {
        title: 'Calistenia',
        icon: '💎',
        exercises: [
          { id: 'pb-c1', name: 'Flexão archer',           detail: 'ou wide', sets: 3, reps: '5-8 cada', rest: 75 },
          { id: 'pb-c2', name: 'Dips',                     detail: 'paralela', sets: 3, reps: '8-12', rest: 75 },
          { id: 'pb-c3', name: 'Pseudo planche push-up',   detail: '', sets: 3, reps: '5-8', rest: 60 },
        ]
      },
      {
        title: 'Musculação',
        icon: '🏋️',
        exercises: [
          { id: 'pb-w1', name: 'Elevação lateral',  detail: 'cabo', sets: 3, reps: '12-15', rest: 45 },
        ]
      }
    ]
  },

  // ── PULL B ──
  {
    id: 'pull-b',
    name: 'PULL B',
    subtitle: 'Costas • Bíceps',
    day: 'Sexta',
    dayNum: 5,
    time: '35-40 min',
    sections: [
      {
        title: 'Skill Work',
        icon: '⭐',
        exercises: [
          { id: 'plb-s2', name: 'Muscle-up transition',        detail: 'barra baixa', sets: 2, reps: '5', rest: 45 },
        ]
      },
      {
        title: 'Calistenia',
        icon: '💎',
        exercises: [
          { id: 'plb-c1', name: 'Pull-up',          detail: 'pronada', sets: 3, reps: '5-10', rest: 90 },
          { id: 'plb-c2', name: 'Australian row',    detail: 'pés elevados', sets: 3, reps: '8-12', rest: 60 },
          { id: 'plb-c3', name: 'Comando pull-up',   detail: 'ou typewriter', sets: 3, reps: '4-6 cada', rest: 75 },
        ]
      },
      {
        title: 'Musculação',
        icon: '🏋️',
        exercises: [
          { id: 'plb-w3', name: 'Rosca martelo',    detail: '', sets: 3, reps: '10-12', rest: 45 },
        ]
      }
    ]
  },

  // ── LEGS B ──
  {
    id: 'legs-b',
    name: 'LEGS B',
    subtitle: 'Pernas • Core',
    day: 'Sábado',
    dayNum: 6,
    time: '35-40 min',
    sections: [
      {
        title: 'Skill Work',
        icon: '⭐',
        exercises: [
          { id: 'lb-s1', name: 'L-sit', detail: 'paralela ou chão', sets: 2, reps: '15-25s', rest: 45 },
        ]
      },
      {
        title: 'Calistenia',
        icon: '💎',
        exercises: [
          { id: 'lb-c1', name: 'Squat jump',             detail: '', sets: 3, reps: '10-12', rest: 45 },
          { id: 'lb-c2', name: 'Step-up alto',            detail: 'banco', sets: 3, reps: '8-12 cada', rest: 60 },
          { id: 'lb-c4', name: 'Nordic curl negativa',    detail: '', sets: 3, reps: '4-6', rest: 60 },
        ]
      },
      {
        title: 'Core',
        icon: '🔥',
        exercises: [
          { id: 'lb-co1', name: 'Dragon flag negativa', detail: '', sets: 3, reps: '3-5', rest: 45 },
        ]
      }
    ]
  },
];

// ═══════════════════════════════════════════
//  PROGRESSÕES DE CALISTENIA
// ═══════════════════════════════════════════
export const PROGRESSIONS = [
  {
    name: 'Flexão',
    icon: '💪',
    steps: [
      { name: 'Flexão inclinada',   req: '3×12' },
      { name: 'Flexão no chão',     req: '3×12' },
      { name: 'Flexão diamante',    req: '3×12' },
      { name: 'Flexão archer',      req: '3×8 cada' },
      { name: 'Flexão unilateral',  req: '3×5 cada' },
    ]
  },
  {
    name: 'Pull-up',
    icon: '🏋️',
    steps: [
      { name: 'Dead hang 30s+',      req: '3×30s' },
      { name: 'Pull-up negativa',     req: '3×5 (5s)' },
      { name: 'Pull-up com banda',    req: '3×8' },
      { name: 'Pull-up completa',     req: '3×8' },
      { name: 'Pull-up com peso',     req: '3×8' },
      { name: 'Muscle-up',            req: '1 rep' },
    ]
  },
  {
    name: 'Dips',
    icon: '⚔️',
    steps: [
      { name: 'Dip no banco',             req: '3×12' },
      { name: 'Dip banco pés elevados',   req: '3×12' },
      { name: 'Dip paralela assistida',   req: '3×8' },
      { name: 'Dip paralela',             req: '3×10' },
      { name: 'Dip com peso',             req: '3×8' },
    ]
  },
  {
    name: 'Agachamento',
    icon: '🦵',
    steps: [
      { name: 'Agachamento profundo',  req: '3×15' },
      { name: 'Búlgaro',               req: '3×12 cada' },
      { name: 'Pistol com apoio',       req: '3×8 cada' },
      { name: 'Pistol para banco',      req: '3×5 cada' },
      { name: 'Pistol squat completo',  req: '3×5 cada' },
    ]
  },
  {
    name: 'Handstand',
    icon: '🤸',
    steps: [
      { name: 'Parede (barriga) 30s',  req: '3×30s' },
      { name: 'Parede (barriga) 60s',  req: '3×60s' },
      { name: 'Parede (costas) 30s',   req: '3×30s' },
      { name: 'Saídas da parede',       req: '5s solto' },
      { name: 'Handstand livre',        req: '10s+' },
    ]
  },
  {
    name: 'L-sit',
    icon: '🧘',
    steps: [
      { name: 'Tucked L-sit',      req: '3×10s' },
      { name: 'Uma perna estendida', req: '3×10s cada' },
      { name: 'L-sit completo',     req: '3×10s' },
      { name: 'L-sit 20s+',         req: '3×20s' },
    ]
  },
];

// ═══════════════════════════════════════════
//  CONQUISTAS
// ═══════════════════════════════════════════
export const ACHIEVEMENTS = [
  // Treinos
  { id: 'first-workout',    name: 'Primeiro Passo',      desc: 'Complete seu primeiro treino',      icon: '🏰' },
  { id: 'five-workouts',    name: 'Persistente',          desc: 'Complete 5 treinos',                icon: '🗡️' },
  { id: 'ten-workouts',     name: 'Veterano',             desc: 'Complete 10 treinos',               icon: '🛡️' },
  { id: 'twenty-workouts',  name: 'Incansável',           desc: 'Complete 20 treinos',               icon: '⚔️' },
  { id: 'thirty-workouts',  name: 'Guerreiro de Ferro',   desc: 'Complete 30 treinos',               icon: '⚒️' },
  { id: 'fifty-workouts',   name: 'Imparável',            desc: 'Complete 50 treinos',               icon: '🔱' },
  { id: 'hundred-workouts', name: 'Lendário',             desc: 'Complete 100 treinos',              icon: '👑' },
  // Níveis
  { id: 'level-3',          name: 'Iniciado',             desc: 'Alcance o nível 3',                 icon: '🌱' },
  { id: 'level-5',          name: 'Despertar',            desc: 'Alcance o nível 5',                 icon: '✨' },
  { id: 'level-10',         name: 'Ascensão',             desc: 'Alcance o nível 10',                icon: '🌟' },
  { id: 'level-15',         name: 'Iluminado',            desc: 'Alcance o nível 15',                icon: '☀️' },
  { id: 'level-20',         name: 'Transcendência',       desc: 'Alcance o nível 20',                icon: '💫' },
  { id: 'level-30',         name: 'Divino',               desc: 'Alcance o nível 30',                icon: '⚡' },
  // Streaks
  { id: 'streak-3',         name: 'Determinação',         desc: 'Sequência de 3 dias',               icon: '🔥' },
  { id: 'week-warrior',     name: 'Guerreiro da Semana',  desc: 'Streak de 6+ dias',                 icon: '⚔️' },
  { id: 'streak-7',         name: 'Sem Descanso',         desc: 'Sequência de 7 dias',               icon: '🔥' },
  { id: 'streak-14',        name: 'Forja de Ferro',       desc: 'Sequência de 14 dias',              icon: '⛓️' },
  { id: 'streak-30',        name: 'Imbatível',            desc: 'Sequência de 30 dias',              icon: '💎' },
  // Runas
  { id: 'rune-10',          name: 'Coletor de Runas',     desc: 'Colete 10 runas',                   icon: '🔮' },
  { id: 'rune-50',          name: 'Senhor das Runas',     desc: 'Colete 50 runas',                   icon: '💠' },
  { id: 'rune-100',         name: 'Runa Ancestral',       desc: 'Colete 100 runas',                  icon: '🌀' },
];
