// ═══════════════════════════════════════════
//  ELDEN TRAINING — Main Application
//  Dark Fantasy Gamified Calisthenics Tracker
// ═══════════════════════════════════════════

import { WORKOUTS, PROGRESSIONS, TITLES, ACHIEVEMENTS, QUOTES } from './data.js';
import { GameEngine } from './game.js';
import './style.css';

// ── State ──
const game = new GameEngine();

let currentView = 'dashboard';
let selectedWorkoutIndex = 0;

let timerInterval = null;
let timerSeconds = 0;
let timerTotal = 0;

let overlayTimeout = null;

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════

function init() {
  game.resetDayProgressIfNeeded();

  const todayIndex = getTodaysWorkoutIndex();
  if (todayIndex !== null) selectedWorkoutIndex = todayIndex;

  document.getElementById('app').addEventListener('click', handleClick);
  document.getElementById('app').addEventListener('change', handleChange);
  render();
}

// ═══════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════

function getTodaysWorkoutIndex() {
  const day = new Date().getDay();
  const map = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
  return map[day] !== undefined ? map[day] : null;
}

function getTitle(level) {
  let result = TITLES[0];
  for (const t of TITLES) {
    if (level >= t.minLevel) result = t;
  }
  return result;
}

function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

function getWorkoutLabel(workoutId) {
  const w = WORKOUTS.find(w => w.id === workoutId);
  return w ? w.name : workoutId;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}`;
}

function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getScaledReps(repsStr, difficulty) {
  if (repsStr === 'max') return 'max';
  
  // Multiplicador: Nível 5 é padrão (1.00)
  // Cada nível ajusta 15% (Nível 1 = 40%, Nível 10 = 175%)
  const mult = 0.4 + (difficulty - 1) * 0.15;
  
  const isSeconds = repsStr.endsWith('s');
  const cleanStr = isSeconds ? repsStr.slice(0, -1) : repsStr;
  
  if (cleanStr.includes('-')) {
    const parts = cleanStr.split('-');
    const minVal = Math.max(1, Math.round(parseInt(parts[0]) * mult));
    const maxVal = Math.max(minVal, Math.round(parseInt(parts[1]) * mult));
    return `${minVal}-${maxVal}${isSeconds ? 's' : ''}`;
  } else {
    const val = Math.max(1, Math.round(parseInt(cleanStr) * mult));
    return `${val}${isSeconds ? 's' : ''}`;
  }
}

// ═══════════════════════════════════════════
//  NAVIGATION & RENDERING
// ═══════════════════════════════════════════

function navigate(view, opts = {}) {
  if (opts.workoutIndex !== undefined) selectedWorkoutIndex = opts.workoutIndex;
  currentView = view;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  const app = document.getElementById('app');
  let html = '';

  switch (currentView) {
    case 'dashboard':    html = renderDashboard(); break;
    case 'workout':      html = renderWorkout(); break;
    case 'journey':      html = renderJourney(); break;
    case 'progressions': html = renderProgressions(); break;
  }

  html += renderNav();
  app.innerHTML = html;

  // Post-render: check if complete button should shake
  if (currentView === 'workout') {
    requestAnimationFrame(checkShakeButton);
  }
}

// ═══════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════

function renderDashboard() {
  const stats = game.getStats();
  const xp = game.xpProgressInLevel();
  const title = getTitle(stats.level);
  const todayIdx = getTodaysWorkoutIndex();
  const todayWorkout = todayIdx !== null ? WORKOUTS[todayIdx] : null;
  const isRestDay = todayIdx === null;
  const todayDone = todayWorkout ? game.isWorkoutCompletedToday(todayWorkout.id) : false;
  const quote = randomQuote();

  return `
    <div class="dashboard">
      <header class="hero-header">
        <span class="hero-ornament">⚜</span>
        <h1 class="hero-title">ELDEN TRAINING</h1>
        <span class="hero-ornament">⚜</span>
      </header>

      <div class="player-card ornate-card glow-border">
        <div class="player-title-section">
          <div class="player-emblem">🗡️</div>
          <div class="player-info">
            <h2 class="player-title gold-text">${title.name}</h2>
            <p class="player-subtitle">${title.subtitle}</p>
          </div>
          <div class="player-level">
            <span class="level-number">${stats.level}</span>
            <span class="level-label">NÍVEL</span>
          </div>
        </div>
        <div class="xp-section">
          <div class="xp-bar"><div class="xp-bar-fill shimmer" style="width:${xp.percentage}%"></div></div>
          <div class="xp-text">
            <span>${Math.floor(xp.current)} / ${xp.needed} XP</span>
            <span>Próx. nível</span>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-item ornate-card"><span class="stat-icon">🔥</span><span class="stat-value">${stats.currentStreak}</span><span class="stat-label">Streak</span></div>
        <div class="stat-item ornate-card"><span class="stat-icon">⚔️</span><span class="stat-value">${stats.totalWorkouts}</span><span class="stat-label">Treinos</span></div>
        <div class="stat-item ornate-card"><span class="stat-icon">🔮</span><span class="stat-value">${stats.runes}</span><span class="stat-label">Runas</span></div>
        <div class="stat-item ornate-card"><span class="stat-icon">🏆</span><span class="stat-value">${stats.bestStreak}</span><span class="stat-label">Record</span></div>
      </div>

      <div class="difficulty-section ornate-card">
        <div class="diff-header">
          <span class="diff-icon">🛡️</span>
          <span class="diff-title">Dificuldade da Forja</span>
        </div>
        <select class="diff-select" data-action="change-difficulty">
          ${[...Array(10).keys()].map(i => {
            const val = i + 1;
            const label = val === 5 ? 'Padrão' : val < 5 ? 'Mais Fácil' : 'Mais Difícil';
            return `<option value="${val}" ${stats.difficulty === val ? 'selected' : ''}>Nível ${val} (${label})</option>`;
          }).join('')}
        </select>
      </div>

      <div class="quote-section ornate-card">
        <p class="quote-text">"${quote}"</p>
      </div>

      ${isRestDay ? `
        <div class="today-section">
          <h3 class="section-heading">Hoje</h3>
          <div class="rest-day-card ornate-card">
            <div class="rest-icon">🛌</div>
            <h3 class="gold-text">Dia de Descanso</h3>
            <p>Descanse, guerreiro. A batalha continua amanhã.</p>
          </div>
        </div>
      ` : `
        <div class="today-section">
          <h3 class="section-heading">Treino de Hoje</h3>
          <div class="today-workout-card ornate-card ${todayDone ? 'completed' : ''}"
               data-action="go-workout" data-idx="${todayIdx}">
            <div class="today-workout-info">
              <h3 class="gold-text">${todayWorkout.name}</h3>
              <p>${todayWorkout.subtitle}</p>
              <p class="workout-day">${todayWorkout.day} • ${todayWorkout.time}</p>
            </div>
            <div class="today-workout-action">
              ${todayDone
                ? '<span class="completed-badge">✓ Completo</span>'
                : '<span class="start-badge">INICIAR ▶</span>'}
            </div>
          </div>
        </div>
      `}

      <div class="all-workouts-section">
        <h3 class="section-heading">Todos os Treinos</h3>
        <div class="workout-grid">
          ${WORKOUTS.map((w, i) => {
            const done = game.isWorkoutCompletedToday(w.id);
            const isToday = i === todayIdx;
            return `
              <div class="workout-mini-card ornate-card ${done ? 'completed' : ''} ${isToday ? 'is-today' : ''}"
                   data-action="go-workout" data-idx="${i}">
                <div class="mini-card-day">${w.day.substring(0, 3)}</div>
                <div class="mini-card-name">${w.name}</div>
                <div class="mini-card-subtitle">${w.subtitle}</div>
                ${done ? '<div class="mini-card-check">✓</div>' : ''}
                ${isToday && !done ? '<div class="mini-card-today">HOJE</div>' : ''}
              </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════
//  WORKOUT VIEW
// ═══════════════════════════════════════════

function renderWorkout() {
  const workout = WORKOUTS[selectedWorkoutIndex];
  if (!workout) return renderDashboard();

  const progress = game.getWorkoutProgress(workout);
  const alreadyDone = game.isWorkoutCompletedToday(workout.id);
  const remaining = progress.totalSets - progress.doneSets;

  // Motivational remaining text
  let remainingText = '';
  if (alreadyDone) {
    remainingText = '⚔️ Vitória conquistada!';
  } else if (remaining <= 0) {
    remainingText = '🔥 Todas as séries completas! Finalize o treino!';
  } else if (remaining <= 3) {
    remainingText = `⚡ Apenas ${remaining} séries para a glória!`;
  } else if (remaining <= progress.totalSets / 2) {
    remainingText = `🗡️ ${remaining} séries restantes. Quase lá!`;
  } else {
    remainingText = `⚔️ ${remaining} séries restantes. Avante!`;
  }

  let html = `<div class="workout-view">
    <div class="workout-header">
      <button class="back-btn" data-action="go-dashboard">←</button>
      <div class="workout-header-info">
        <h2>${workout.name}</h2>
        <p>${workout.subtitle} • ${workout.time}</p>
      </div>
    </div>

    <div class="workout-progress">
      <div class="workout-progress-bar"><div class="workout-progress-fill" style="width:${progress.percentage}%"></div></div>
      <div class="workout-progress-text">
        <span>${progress.doneSets}/${progress.totalSets} séries</span>
        <span>${Math.round(progress.percentage)}%</span>
      </div>
    </div>

    <div class="remaining-text ${remaining <= 0 && !alreadyDone ? 'pulse-gold' : ''}">${remainingText}</div>`;

  for (const section of workout.sections) {
    html += `<div class="exercise-section">
      <div class="section-divider">
        <span class="divider-orn">⚜</span>
        <span class="divider-text">${section.icon} ${section.title}</span>
        <span class="divider-orn">⚜</span>
      </div>`;

    for (const ex of section.exercises) {
      const isDone = game.isExerciseDone(workout.id, ex.id, ex.sets);
      const difficulty = game.getDifficulty();
      const scaledReps = getScaledReps(ex.reps, difficulty);
      html += `<div class="exercise-card ornate-card ${isDone ? 'done' : ''}" id="ex-${ex.id}">
        <div class="exercise-top">
          <div>
            <div class="exercise-name">${ex.name}</div>
            ${ex.detail ? `<div class="exercise-detail">${ex.detail}</div>` : ''}
          </div>
          <div class="exercise-meta">
            <div class="exercise-reps">${ex.sets}×${scaledReps}</div>
            <div class="exercise-rest">⏱ ${ex.rest}s</div>
          </div>
        </div>
        <div class="sets-row">`;

      for (let s = 0; s < ex.sets; s++) {
        const setDone = game.isSetDone(workout.id, ex.id, s);
        html += `<button class="set-btn ${setDone ? 'done' : ''}"
                         data-action="toggle-set"
                         data-workout="${workout.id}"
                         data-exercise="${ex.id}"
                         data-set="${s}"
                         data-rest="${ex.rest}"
                         data-total-sets="${ex.sets}">
                   ${setDone ? '✓' : s + 1}
                 </button>`;
      }

      html += `</div></div>`;
    }

    html += `</div>`;
  }

  html += `<button class="complete-workout-btn ${alreadyDone ? 'already-done' : ''} ${remaining <= 0 && !alreadyDone ? 'shake-attention' : ''}"
                   data-action="complete-workout" data-workout-id="${workout.id}">
             ${alreadyDone ? '✓ TREINO COMPLETO' : '⚔️ COMPLETAR TREINO'}
           </button>`;

  html += `</div>`;

  // Timer overlay
  if (timerInterval) {
    const pct = timerTotal > 0 ? (timerSeconds / timerTotal) * 100 : 0;
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    const isUrgent = timerSeconds <= 5;
    html += `<div class="rest-timer ${isUrgent ? 'timer-urgent' : ''}">
      <div class="timer-progress-wrap"><div class="timer-progress-bar" style="width:${pct}%"></div></div>
      <span class="timer-countdown ${isUrgent ? 'pulse-gold' : ''}">${mins}:${String(secs).padStart(2, '0')}</span>
      <button class="timer-skip-btn" data-action="skip-timer">PULAR</button>
    </div>`;
  }

  return html;
}

// ═══════════════════════════════════════════
//  JOURNEY VIEW
// ═══════════════════════════════════════════

function renderJourney() {
  const stats = game.getStats();
  const calendar = game.getCalendarData();
  const history = game.getWorkoutHistory(15);

  // Build calendar grid (6 weeks)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - dayOfWeek - 35);

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  let calendarHTML = days.map(d => `<div class="calendar-header-cell">${d}</div>`).join('');

  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const ds = toLocalDateStr(d);
    const todayStr = toLocalDateStr(today);
    const isToday = ds === todayStr;
    const isFuture = d > today && !isToday;
    const count = calendar[ds] || 0;
    const dayNum = d.getDate();

    let cls = 'calendar-day';
    if (isToday) cls += ' today';
    if (count > 0) cls += ' has-workout';
    if (isFuture) cls += ' future';

    calendarHTML += `<div class="${cls}">${dayNum}</div>`;
  }

  return `<div class="journey-view">
    <header class="hero-header">
      <span class="hero-ornament">⚜</span>
      <h1 class="hero-title">JORNADA</h1>
      <span class="hero-ornament">⚜</span>
    </header>

    <div class="journey-stats">
      <div class="journey-stat-card ornate-card">
        <span class="stat-value">${stats.totalWorkouts}</span>
        <span class="stat-label">Treinos</span>
      </div>
      <div class="journey-stat-card ornate-card">
        <span class="stat-value">${stats.currentStreak}</span>
        <span class="stat-label">Streak</span>
      </div>
      <div class="journey-stat-card ornate-card">
        <span class="stat-value">${stats.runes}</span>
        <span class="stat-label">Runas</span>
      </div>
      <div class="journey-stat-card ornate-card">
        <span class="stat-value">${stats.bestStreak}</span>
        <span class="stat-label">Record</span>
      </div>
    </div>

    <div class="calendar-section">
      <h3 class="section-heading">Calendário</h3>
      <div class="calendar-grid">${calendarHTML}</div>
    </div>

    <div class="achievements-section">
      <h3 class="section-heading">Conquistas (${stats.unlockedAchievements.length}/${ACHIEVEMENTS.length})</h3>
      <div class="achievements-grid">
        ${ACHIEVEMENTS.map(a => {
          const unlocked = stats.unlockedAchievements.includes(a.id);
          return `<div class="achievement-card ornate-card ${unlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-name">${unlocked ? a.name : '???'}</div>
            <div class="achievement-desc">${unlocked ? a.desc : '???'}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="history-section">
      <h3 class="section-heading">Últimos Treinos</h3>
      ${history.length === 0 ? `
        <div class="history-empty ornate-card">
          <p>Nenhum treino registrado ainda.</p>
          <p class="gold-text">Comece sua jornada!</p>
        </div>
      ` : `
        <div class="history-list">
          ${history.map(h => `
            <div class="history-item ornate-card">
              <div class="history-date">${formatDate(h.date)}</div>
              <div class="history-info">
                <span class="history-workout">${getWorkoutLabel(h.workoutId)}</span>
              </div>
              <div class="history-xp gold-text">+${h.xp} XP</div>
            </div>
          `).join('')}
        </div>
      `}
    </div>

    <div class="reset-section">
      <button class="reset-btn" data-action="reset-data">Resetar Progresso</button>
    </div>
  </div>`;
}

// ═══════════════════════════════════════════
//  PROGRESSIONS VIEW
// ═══════════════════════════════════════════

function renderProgressions() {
  return `<div class="progressions-view">
    <header class="hero-header">
      <span class="hero-ornament">⚜</span>
      <h1 class="hero-title">SKILLS</h1>
      <span class="hero-ornament">⚜</span>
    </header>

    <p class="skills-subtitle">Toque no próximo passo para avançar na progressão (+100 XP)</p>

    ${PROGRESSIONS.map(prog => {
      const currentStep = game.getProgressionLevel(prog.name);
      return `<div class="progression-tree ornate-card">
        <div class="progression-header">
          <span class="progression-header-icon">${prog.icon}</span>
          <h3>${prog.name}</h3>
          <span class="progression-counter">${currentStep}/${prog.steps.length}</span>
        </div>
        <div class="progression-steps">
          ${prog.steps.map((step, i) => {
            let cls = 'progression-step';
            if (i < currentStep) cls += ' completed';
            else if (i === currentStep) cls += ' active';
            else cls += ' locked';
            return `<div class="${cls}" data-action="set-progression" data-prog="${prog.name}" data-step="${i}">
              <div class="progression-step-marker"></div>
              <div class="progression-step-content">
                <div class="progression-step-name">${step.name}</div>
                <div class="progression-step-req">Meta: ${step.req}</div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

// ═══════════════════════════════════════════
//  BOTTOM NAVIGATION
// ═══════════════════════════════════════════

function renderNav() {
  const items = [
    { view: 'dashboard',    icon: '🏰', label: 'Início' },
    { view: 'workout',      icon: '⚔️', label: 'Treino' },
    { view: 'journey',      icon: '📜', label: 'Jornada' },
    { view: 'progressions', icon: '🗡️', label: 'Skills' },
  ];

  return `<nav class="bottom-nav">
    ${items.map(it => `
      <button class="nav-item ${currentView === it.view ? 'active' : ''}"
              data-action="navigate" data-view="${it.view}">
        <span class="nav-icon">${it.icon}</span>
        <span class="nav-label">${it.label}</span>
      </button>
    `).join('')}
  </nav>`;
}

// ═══════════════════════════════════════════
//  EVENT HANDLING
// ═══════════════════════════════════════════

function handleClick(e) {
  // Dismiss overlays
  const overlay = e.target.closest('.level-up-overlay, .complete-overlay, .reset-modal');
  if (overlay && !e.target.closest('[data-action]')) {
    overlay.remove();
    if (overlayTimeout) { clearTimeout(overlayTimeout); overlayTimeout = null; }
    return;
  }

  const target = e.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;

  switch (action) {
    case 'navigate':
      navigate(target.dataset.view);
      break;

    case 'go-dashboard':
      navigate('dashboard');
      break;

    case 'go-workout':
      navigate('workout', { workoutIndex: parseInt(target.dataset.idx) });
      break;

    case 'toggle-set': {
      const wid = target.dataset.workout;
      const eid = target.dataset.exercise;
      const si = parseInt(target.dataset.set);
      const rest = parseInt(target.dataset.rest);
      const totalSets = parseInt(target.dataset.totalSets);

      const result = game.toggleSet(wid, eid, si);

      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(result.completed ? 30 : 15);

      // XP float animation
      if (result.completed) {
        showXPFloat(target, result.xpChange);
      }

      // Level up!
      if (result.leveledUp) {
        showLevelUp();
      }

      // Start rest timer on completing a set
      if (result.completed && rest > 0) {
        startTimer(rest);
      }

      render();

      // Auto-scroll to next exercise if all sets done
      if (result.completed) {
        const completedSets = game.getCompletedSets(wid, eid);
        if (completedSets >= totalSets) {
          autoScrollToNextExercise(eid);
        }
      }
      break;
    }

    case 'complete-workout': {
      const workout = WORKOUTS[selectedWorkoutIndex];
      if (game.isWorkoutCompletedToday(workout.id)) return;

      const result = game.completeWorkout(workout);

      // Haptic
      if (navigator.vibrate) {
        if (result.tacticalRetreat) {
          navigator.vibrate([100, 100, 100]); // slow vibrations for retreat
        } else {
          navigator.vibrate([50, 30, 50, 30, 100]);
        }
      }

      // Stop timer
      stopTimer();

      // Show confetti only on full completion
      if (!result.tacticalRetreat) {
        showConfetti();
      }

      // Show completion/retreat overlay
      showWorkoutComplete(result);

      // Show achievement toasts
      if (result.newAchievements.length > 0) {
        setTimeout(() => {
          showAchievementToast(result.newAchievements[0]);
        }, 2000);
      }

      // Level up after completion
      if (result.leveledUp) {
        setTimeout(() => showLevelUp(), result.newAchievements.length > 0 ? 4500 : 2500);
      }

      render();
      break;
    }

    case 'skip-timer':
      stopTimer();
      render();
      break;

    case 'set-progression': {
      const prog = target.dataset.prog;
      const step = parseInt(target.dataset.step);
      const current = game.getProgressionLevel(prog);
      if (step === current + 1) {
        // Advance to next step — grant XP
        game.setProgressionLevel(prog, step + 1);
        showXPFloat(target, 100);
      } else if (step < current) {
        // Tap a completed step to undo (set back to that step)
        game.setProgressionLevel(prog, step);
      }
      // Tapping locked steps (step > current+1) does nothing
      if (navigator.vibrate) navigator.vibrate(20);
      render();
      break;
    }

    case 'reset-data': {
      showResetModal();
      break;
    }

    case 'confirm-reset': {
      game.resetAllData();
      document.querySelector('.reset-modal')?.remove();
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      navigate('dashboard');
      break;
    }

    case 'cancel-reset': {
      document.querySelector('.reset-modal')?.remove();
      break;
    }
  }
}

function handleChange(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;

  if (action === 'change-difficulty') {
    game.setDifficulty(target.value);
    if (navigator.vibrate) navigator.vibrate(20);
    render();
  }
}

// ═══════════════════════════════════════════
//  TIMER
// ═══════════════════════════════════════════

function startTimer(seconds) {
  stopTimer();
  timerSeconds = seconds;
  timerTotal = seconds;

  timerInterval = setInterval(() => {
    timerSeconds--;
    if (timerSeconds <= 0) {
      stopTimer();
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
    render();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerSeconds = 0;
  timerTotal = 0;
}

// ═══════════════════════════════════════════
//  AUTO-SCROLL
// ═══════════════════════════════════════════

function autoScrollToNextExercise(currentExerciseId) {
  requestAnimationFrame(() => {
    const workout = WORKOUTS[selectedWorkoutIndex];
    if (!workout) return;

    const allExercises = [];
    for (const section of workout.sections) {
      for (const ex of section.exercises) {
        allExercises.push(ex);
      }
    }

    const currentIdx = allExercises.findIndex(ex => ex.id === currentExerciseId);
    if (currentIdx < 0 || currentIdx >= allExercises.length - 1) return;

    const nextEx = allExercises[currentIdx + 1];
    const nextEl = document.getElementById(`ex-${nextEx.id}`);
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// ═══════════════════════════════════════════
//  POST-RENDER CHECKS
// ═══════════════════════════════════════════

function checkShakeButton() {
  const workout = WORKOUTS[selectedWorkoutIndex];
  if (!workout) return;
  const progress = game.getWorkoutProgress(workout);
  const btn = document.querySelector('.complete-workout-btn:not(.already-done)');
  if (btn && progress.doneSets >= progress.totalSets) {
    btn.classList.add('shake-attention');
  }
}

// ═══════════════════════════════════════════
//  ANIMATIONS & OVERLAYS
// ═══════════════════════════════════════════

function showXPFloat(element, xp) {
  const rect = element.getBoundingClientRect();
  const float = document.createElement('div');
  float.className = 'xp-float';
  float.textContent = `+${xp} XP`;
  float.style.left = `${rect.left + rect.width / 2 - 30}px`;
  float.style.top = `${rect.top - 10}px`;
  document.body.appendChild(float);
  setTimeout(() => float.remove(), 1200);
}

function showConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    const hue = Math.random() > 0.5 ? `45, 80%` : `35, 70%`; // gold tones
    const lightness = 40 + Math.random() * 30;
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      background: hsl(${hue}, ${lightness}%);
      animation-delay: ${Math.random() * 0.8}s;
      animation-duration: ${1.5 + Math.random() * 1.5}s;
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
    `;
    container.appendChild(particle);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 4000);
}

function showLevelUp() {
  const stats = game.getStats();
  const title = getTitle(stats.level);

  let particles = '';
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 100;
    const delay = Math.random() * 2;
    const size = 2 + Math.random() * 5;
    particles += `<div class="particle" style="left:${x}%;bottom:0;animation-delay:${delay}s;width:${size}px;height:${size}px;"></div>`;
  }

  const overlay = document.createElement('div');
  overlay.className = 'level-up-overlay';
  overlay.innerHTML = `
    <div class="level-up-particles">${particles}</div>
    <div class="level-up-content">
      <div class="level-up-label">NÍVEL ALCANÇADO</div>
      <div class="level-up-number">${stats.level}</div>
      <div class="level-up-title">${title.name}</div>
      <div class="level-up-subtitle">${title.subtitle}</div>
      <div class="level-up-dismiss">toque para continuar</div>
    </div>`;

  document.body.appendChild(overlay);

  if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

  overlayTimeout = setTimeout(() => {
    if (overlay.parentNode) overlay.remove();
  }, 6000);
}

function showWorkoutComplete(result) {
  const stats = game.getStats();

  const overlay = document.createElement('div');
  overlay.className = 'complete-overlay';
  
  if (result.tacticalRetreat) {
    const pct = Math.round(result.completedPct * 100);
    overlay.innerHTML = `
      <div class="complete-icon" style="filter: hue-rotate(320deg);">🛡️</div>
      <div class="complete-title" style="color: var(--red); text-shadow: 0 0 20px rgba(196,64,64,0.4);">RETIRADA TÁTICA</div>
      <p class="retreat-warning-desc" style="font-size:0.75rem; color: var(--text-secondary); text-align:center; max-width:280px; margin:-10px 0 16px; line-height:1.4;">
        Você recuou com <strong>${pct}%</strong> do treino concluído.<br>
        Punição: -50% de XP e sem runas.
      </p>
      <div class="complete-stats">
        <div class="complete-stat">XP Ganho: <strong style="color: var(--gold);">+${result.xpGained}</strong></div>
        <div class="complete-stat">Runas Ganhas: <strong>0 🔮</strong></div>
        <div class="complete-stat" style="color: var(--green);">Streak Mantido: <strong>${stats.currentStreak} dias 🔥</strong></div>
      </div>
      <div class="complete-dismiss">toque para continuar</div>`;
  } else {
    overlay.innerHTML = `
      <div class="complete-icon">⚔️</div>
      <div class="complete-title">TREINO COMPLETO</div>
      <div class="complete-stats">
        <div class="complete-stat">XP Ganho: <strong>+${result.xpGained}</strong></div>
        ${result.streakBonus > 0 ? `<div class="complete-stat">Bônus Streak: <strong>+${result.streakBonus}</strong></div>` : ''}
        <div class="complete-stat">Runas: <strong>+${result.runesGained} 🔮</strong></div>
        <div class="complete-stat">Streak: <strong>${stats.currentStreak} dias 🔥</strong></div>
      </div>
      <div class="complete-dismiss">toque para continuar</div>`;
  }

  document.body.appendChild(overlay);

  overlayTimeout = setTimeout(() => {
    if (overlay.parentNode) overlay.remove();
  }, 5000);
}

function showAchievementToast(achievementId) {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return;

  document.querySelectorAll('.achievement-toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'achievement-toast';
  toast.innerHTML = `
    <div class="toast-icon">${achievement.icon}</div>
    <div class="toast-content">
      <div class="toast-label">CONQUISTA DESBLOQUEADA</div>
      <div class="toast-name">${achievement.name}</div>
      <div class="toast-desc">${achievement.desc}</div>
    </div>`;

  document.body.appendChild(toast);

  if (navigator.vibrate) navigator.vibrate([50, 30, 50]);

  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, 4000);
}

function showResetModal() {
  document.querySelector('.reset-modal')?.remove();

  const modal = document.createElement('div');
  modal.className = 'reset-modal';
  modal.innerHTML = `
    <div class="reset-modal-content ornate-card">
      <div class="reset-modal-icon">⚠️</div>
      <h3 class="gold-text">Resetar Progresso?</h3>
      <p>Todo seu XP, nível, streak, runas e conquistas serão perdidos permanentemente.</p>
      <p class="reset-warning">Esta ação não pode ser desfeita!</p>
      <div class="reset-modal-actions">
        <button class="reset-cancel-btn" data-action="cancel-reset">Cancelar</button>
        <button class="reset-confirm-btn" data-action="confirm-reset">Resetar Tudo</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
}

// ═══════════════════════════════════════════
//  START
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', init);
