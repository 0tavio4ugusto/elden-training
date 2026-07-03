// ═══════════════════════════════════════════
//  GAME ENGINE — XP, Levels, Streaks, Runas, Achievements
// ═══════════════════════════════════════════

const STORAGE_KEY = 'elden-training-save';
const XP_PER_SET = 15;
const XP_WORKOUT_BONUS = 150;
const XP_STREAK_PER_DAY = 25;
const MAX_STREAK_BONUS = 7;
const XP_PROGRESSION_BONUS = 100;

export class GameEngine {
  constructor() {
    this.state = this._load();
  }

  // ── Persistence ──
  _load() {
    try {
      let saved = localStorage.getItem(STORAGE_KEY);
      // Migrate from old key if needed
      if (!saved) {
        saved = localStorage.getItem('fitness-quest-save');
        if (saved) {
          localStorage.setItem(STORAGE_KEY, saved);
          localStorage.removeItem('fitness-quest-save');
        }
      }
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate old saves: add new fields if missing
        if (parsed.runes === undefined) parsed.runes = 0;
        if (parsed.progressionLevels === undefined) parsed.progressionLevels = {};
        return parsed;
      }
    } catch (e) { /* ignore */ }
    return this._defaultState();
  }

  _defaultState() {
    return {
      totalXP: 0,
      level: 1,
      runes: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastWorkoutDate: null,
      completedWorkouts: [],       // { date, workoutId, xp }
      unlockedAchievements: [],
      todayProgress: {},           // { [workoutId]: { [exerciseId]: [bool, bool, ...] } }
      _lastProgressDate: null,
      progressionLevels: {},       // { [progressionName]: stepIndex }
    };
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  // ── XP & Level Calculations ──
  xpForLevel(level) {
    // Slightly exponential curve: each level needs more XP
    return Math.floor(100 + (level - 1) * 75 + Math.pow(level - 1, 1.3) * 10);
  }

  xpProgressInLevel() {
    let xpRemaining = this.state.totalXP;
    for (let l = 1; l < this.state.level; l++) {
      xpRemaining -= this.xpForLevel(l);
    }
    const needed = this.xpForLevel(this.state.level);
    return {
      current: Math.max(0, xpRemaining),
      needed,
      percentage: Math.min(100, (Math.max(0, xpRemaining) / needed) * 100),
    };
  }

  _recalculateLevel() {
    let xp = this.state.totalXP;
    let level = 1;
    while (xp >= this.xpForLevel(level)) {
      xp -= this.xpForLevel(level);
      level++;
    }
    const oldLevel = this.state.level;
    this.state.level = level;
    return level > oldLevel;
  }

  // ── Set Tracking ──
  toggleSet(workoutId, exerciseId, setIndex) {
    if (!this.state.todayProgress[workoutId]) {
      this.state.todayProgress[workoutId] = {};
    }
    if (!this.state.todayProgress[workoutId][exerciseId]) {
      this.state.todayProgress[workoutId][exerciseId] = [];
    }

    const sets = this.state.todayProgress[workoutId][exerciseId];
    const wasComplete = !!sets[setIndex];
    sets[setIndex] = !wasComplete;

    if (sets[setIndex]) {
      this.state.totalXP += XP_PER_SET;
    } else {
      this.state.totalXP = Math.max(0, this.state.totalXP - XP_PER_SET);
    }

    const leveledUp = this._recalculateLevel();
    this.save();

    return {
      xpChange: sets[setIndex] ? XP_PER_SET : -XP_PER_SET,
      leveledUp,
      completed: sets[setIndex],
    };
  }

  isSetDone(workoutId, exerciseId, setIndex) {
    return !!this.state.todayProgress?.[workoutId]?.[exerciseId]?.[setIndex];
  }

  getCompletedSets(workoutId, exerciseId) {
    const sets = this.state.todayProgress?.[workoutId]?.[exerciseId] || [];
    return sets.filter(Boolean).length;
  }

  isExerciseDone(workoutId, exerciseId, totalSets) {
    return this.getCompletedSets(workoutId, exerciseId) >= totalSets;
  }

  getWorkoutProgress(workout) {
    let totalSets = 0;
    let doneSets = 0;
    for (const section of workout.sections) {
      for (const ex of section.exercises) {
        totalSets += ex.sets;
        doneSets += Math.min(this.getCompletedSets(workout.id, ex.id), ex.sets);
      }
    }
    return { totalSets, doneSets, percentage: totalSets > 0 ? (doneSets / totalSets) * 100 : 0 };
  }

  // ── Workout Completion ──
  completeWorkout(workoutId) {
    const today = this._today();

    const alreadyDone = this.state.completedWorkouts.some(
      w => w.date === today && w.workoutId === workoutId
    );
    if (alreadyDone) return { xpGained: 0, leveledUp: false, newAchievements: [], streakBonus: 0, runesGained: 0 };

    // Streak logic
    const yesterday = this._dateOffset(-1);
    if (this.state.lastWorkoutDate === yesterday || this.state.lastWorkoutDate === today) {
      if (this.state.lastWorkoutDate !== today) this.state.currentStreak++;
    } else {
      this.state.currentStreak = 1;
    }
    if (this.state.currentStreak > this.state.bestStreak) {
      this.state.bestStreak = this.state.currentStreak;
    }
    this.state.lastWorkoutDate = today;

    // XP Bonus
    const streakBonus = Math.min(this.state.currentStreak, MAX_STREAK_BONUS) * XP_STREAK_PER_DAY;
    const totalBonus = XP_WORKOUT_BONUS + streakBonus;
    this.state.totalXP += totalBonus;

    // Runas: 1 per workout + 1 extra every 5 streak days
    let runesGained = 1;
    if (this.state.currentStreak > 0 && this.state.currentStreak % 5 === 0) {
      runesGained += 1;
    }
    this.state.runes += runesGained;

    this.state.completedWorkouts.push({ date: today, workoutId, xp: totalBonus });

    const leveledUp = this._recalculateLevel();
    const newAchievements = this._checkAchievements();
    this.save();

    return { xpGained: totalBonus, leveledUp, newAchievements, streakBonus, runesGained };
  }

  isWorkoutCompletedToday(workoutId) {
    const today = this._today();
    return this.state.completedWorkouts.some(w => w.date === today && w.workoutId === workoutId);
  }

  // ── Achievements ──
  _checkAchievements() {
    const s = this.state;
    const total = s.completedWorkouts.length;
    const newlyUnlocked = [];

    const checks = {
      'first-workout':    total >= 1,
      'five-workouts':    total >= 5,
      'ten-workouts':     total >= 10,
      'twenty-workouts':  total >= 20,
      'thirty-workouts':  total >= 30,
      'fifty-workouts':   total >= 50,
      'hundred-workouts': total >= 100,
      'level-3':          s.level >= 3,
      'level-5':          s.level >= 5,
      'level-10':         s.level >= 10,
      'level-15':         s.level >= 15,
      'level-20':         s.level >= 20,
      'level-30':         s.level >= 30,
      'streak-3':         s.bestStreak >= 3,
      'streak-7':         s.bestStreak >= 7,
      'streak-14':        s.bestStreak >= 14,
      'streak-30':        s.bestStreak >= 30,
      'week-warrior':     s.currentStreak >= 6,
      'rune-10':          s.runes >= 10,
      'rune-50':          s.runes >= 50,
      'rune-100':         s.runes >= 100,
    };

    for (const [id, unlocked] of Object.entries(checks)) {
      if (unlocked && !s.unlockedAchievements.includes(id)) {
        s.unlockedAchievements.push(id);
        newlyUnlocked.push(id);
      }
    }

    return newlyUnlocked;
  }

  // ── Progression Skill Tree ──
  setProgressionLevel(name, step) {
    const oldStep = this.state.progressionLevels[name] || 0;
    this.state.progressionLevels[name] = step;
    // Grant XP for advancing (not for going back)
    if (step > oldStep) {
      this.state.totalXP += XP_PROGRESSION_BONUS;
      this._recalculateLevel();
    }
    this.save();
  }

  getProgressionLevel(name) {
    return this.state.progressionLevels[name] || 0;
  }

  // ── Stats ──
  getStats() {
    return {
      totalXP: this.state.totalXP,
      level: this.state.level,
      runes: this.state.runes,
      currentStreak: this.state.currentStreak,
      bestStreak: this.state.bestStreak,
      totalWorkouts: this.state.completedWorkouts.length,
      unlockedAchievements: [...this.state.unlockedAchievements],
    };
  }

  getCalendarData() {
    const data = {};
    const today = new Date();
    for (let i = 0; i < 42; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = this._toLocalDateStr(d);
      data[ds] = this.state.completedWorkouts.filter(w => w.date === ds).length;
    }
    return data;
  }

  getWorkoutHistory(limit = 15) {
    return [...this.state.completedWorkouts]
      .reverse()
      .slice(0, limit);
  }

  // ── Daily Reset ──
  resetDayProgressIfNeeded() {
    const today = this._today();
    if (this.state._lastProgressDate !== today) {
      this.state.todayProgress = {};
      this.state._lastProgressDate = today;

      // Recalculate streak if missed days
      if (this.state.lastWorkoutDate) {
        const yesterday = this._dateOffset(-1);
        if (this.state.lastWorkoutDate !== today && this.state.lastWorkoutDate !== yesterday) {
          this.state.currentStreak = 0;
        }
      }

      this.save();
    }
  }

  // ── Reset All Data ──
  resetAllData() {
    this.state = this._defaultState();
    this.save();
  }

  // ── Helpers ──
  _toLocalDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  _today() {
    return this._toLocalDateStr(new Date());
  }

  _dateOffset(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return this._toLocalDateStr(d);
  }
}
