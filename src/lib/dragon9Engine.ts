import { Dragon9TimeState } from '../types';

/**
 * Dragon 9 Tokyo Node Time Engine
 * Reallocates the 1,440-minute day into:
 * - 13 Dragon 9 Hours per cycle (54 minutes per hour) = 702 minutes
 * - 18-minute Apex Pause anchored symmetrically around Midday Apex (11:51 JST - 12:09 JST) and Midnight Apex (23:51 JST - 00:09 JST)
 * - The 13th Hour is the Open Transition Wedge leading into the Apex Pause.
 */
export function calculateDragon9Time(simulatedHourOffset: number = 0): Dragon9TimeState {
  const now = new Date();
  
  // Calculate Tokyo Time (JST = UTC+9)
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const jstMs = utcMs + (9 * 3600000) + (simulatedHourOffset * 3600000);
  const jstDate = new Date(jstMs);

  const hours = jstDate.getHours();
  const minutes = jstDate.getMinutes();
  const seconds = jstDate.getSeconds();

  const totalJstMinutesInDay = (hours * 60) + minutes + (seconds / 60);

  // Midday Apex Pause: 11:51 JST to 12:09 JST (711 min to 729 min in total day)
  // Midnight Apex Pause: 23:51 JST to 00:09 JST (1431 min to 1440 min OR 0 min to 9 min)
  const middayApexStart = (11 * 60) + 51; // 711
  const middayApexEnd = (12 * 60) + 9;   // 729

  const midnightApexStart = (23 * 60) + 51; // 1431
  const midnightApexEnd = 9;               // 9

  let isApexPause = false;
  let apexType: 'midday' | 'midnight' | null = null;
  let apexRemainingSeconds = 0;

  if (totalJstMinutesInDay >= middayApexStart && totalJstMinutesInDay < middayApexEnd) {
    isApexPause = true;
    apexType = 'midday';
    const remainingMins = middayApexEnd - totalJstMinutesInDay;
    apexRemainingSeconds = Math.round(remainingMins * 60);
  } else if (totalJstMinutesInDay >= midnightApexStart || totalJstMinutesInDay < midnightApexEnd) {
    isApexPause = true;
    apexType = 'midnight';
    let remainingMins = 0;
    if (totalJstMinutesInDay >= midnightApexStart) {
      remainingMins = (1440 - totalJstMinutesInDay) + midnightApexEnd;
    } else {
      remainingMins = midnightApexEnd - totalJstMinutesInDay;
    }
    apexRemainingSeconds = Math.round(remainingMins * 60);
  }

  // Calculate Dragon 9 Hour (1 to 13) and Minute (0 to 53)
  // Half-day 1: 00:00 to 12:00. Half-day 2: 12:00 to 24:00
  const isSecondHalf = totalJstMinutesInDay >= 720;
  let cycleMinute = totalJstMinutesInDay % 720; // 0 to 719

  // Deduct Apex offset if after midday apex in half cycle
  if (cycleMinute >= 711) {
    cycleMinute = 701.99; // Cap at end of 13th hour
  }

  const d9HourRaw = Math.floor(cycleMinute / 54) + 1; // 1 to 13
  const dragon9Hour = Math.min(13, Math.max(1, d9HourRaw));
  const dragon9Minute = Math.floor(cycleMinute % 54);
  const dragon9Second = Math.floor((cycleMinute % 1) * 60);

  const is13thHourWedge = dragon9Hour === 13 && !isApexPause;

  // Determine Ambient Lighting State
  let ambientLighting: Dragon9TimeState['ambientLighting'] = 'morning';

  if (isApexPause) {
    ambientLighting = apexType === 'midday' ? 'zen_midday' : 'zen_midnight';
  } else if (hours >= 5 && hours < 8) {
    ambientLighting = 'dawn';
  } else if (hours >= 8 && hours < 11) {
    ambientLighting = 'morning';
  } else if (hours >= 11 && hours < 14) {
    ambientLighting = 'midday';
  } else if (hours >= 14 && hours < 17) {
    ambientLighting = 'afternoon';
  } else if (hours >= 17 && hours < 19) {
    ambientLighting = 'dusk';
  } else if (hours >= 19 && hours < 22) {
    ambientLighting = 'twilight';
  } else {
    ambientLighting = 'night';
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const jstTimeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  const activeCycleNameJp = isSecondHalf ? '陰ノ月サイクル (Moon Cycle)' : '陽ノ陽サイクル (Sun Cycle)';
  const activeCycleNameEn = isSecondHalf ? 'Yin Moon Phase' : 'Yang Sun Phase';

  return {
    jstTimeString,
    standardHour: hours,
    standardMinute: minutes,
    standardSecond: seconds,
    dragon9Hour,
    dragon9Minute,
    dragon9Second,
    isApexPause,
    apexType,
    apexRemainingSeconds,
    is13thHourWedge,
    ambientLighting,
    simulatedHourOffset,
    activeCycleNameJp,
    activeCycleNameEn,
  };
}

/**
 * Get CSS theme colors for ambient canvas lighting based on Tokyo Dragon 9 state
 */
export function getAmbientTheme(lighting: Dragon9TimeState['ambientLighting']) {
  switch (lighting) {
    case 'zen_midday':
      return {
        bg: 'from-amber-900/30 via-emerald-950/40 to-slate-950',
        cardBg: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-100',
        accentColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        glow: 'shadow-[0_0_50px_rgba(16,185,129,0.25)]',
        headerGlow: 'from-emerald-500/10 via-amber-500/10 to-transparent',
        label: 'Midday Apex Zen Pause (18-Min Calm)',
      };
    case 'zen_midnight':
      return {
        bg: 'from-indigo-950/60 via-purple-950/50 to-slate-950',
        cardBg: 'bg-indigo-950/80 border-indigo-500/30 text-indigo-100',
        accentColor: 'text-indigo-300',
        badgeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40',
        glow: 'shadow-[0_0_50px_rgba(99,102,241,0.25)]',
        headerGlow: 'from-indigo-500/10 via-purple-500/10 to-transparent',
        label: 'Midnight Apex Zen Pause (18-Min Quiet)',
      };
    case 'dawn':
      return {
        bg: 'from-rose-950/20 via-sky-950/30 to-slate-900',
        cardBg: 'bg-slate-900/90 border-rose-400/20 text-slate-100',
        accentColor: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]',
        headerGlow: 'from-rose-500/10 to-transparent',
        label: 'Dawn Node Transition',
      };
    case 'morning':
      return {
        bg: 'from-sky-950/30 via-teal-950/20 to-slate-900',
        cardBg: 'bg-slate-900/90 border-cyan-500/20 text-cyan-100',
        accentColor: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
        headerGlow: 'from-cyan-500/10 to-transparent',
        label: 'Morning Sun Cycle',
      };
    case 'midday':
      return {
        bg: 'from-cyan-950/20 via-sky-900/30 to-slate-900',
        cardBg: 'bg-slate-900/90 border-sky-400/30 text-sky-100',
        accentColor: 'text-sky-300',
        badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
        glow: 'shadow-[0_0_30px_rgba(56,189,248,0.2)]',
        headerGlow: 'from-sky-500/15 to-transparent',
        label: 'Midday Zenith Wedge',
      };
    case 'afternoon':
      return {
        bg: 'from-amber-950/30 via-slate-900 to-slate-950',
        cardBg: 'bg-slate-900/90 border-amber-500/20 text-amber-100',
        accentColor: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
        headerGlow: 'from-amber-500/10 to-transparent',
        label: 'Afternoon Sun Cycle',
      };
    case 'dusk':
      return {
        bg: 'from-orange-950/30 via-purple-950/30 to-slate-950',
        cardBg: 'bg-slate-900/90 border-orange-500/20 text-orange-100',
        accentColor: 'text-orange-400',
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        glow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]',
        headerGlow: 'from-orange-500/10 to-transparent',
        label: 'Yanaka Dusk Lighting',
      };
    case 'twilight':
      return {
        bg: 'from-purple-950/40 via-indigo-950/30 to-slate-950',
        cardBg: 'bg-slate-900/90 border-purple-500/20 text-purple-100',
        accentColor: 'text-purple-300',
        badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
        headerGlow: 'from-purple-500/10 to-transparent',
        label: 'Twilight Node Wedge',
      };
    case 'night':
    default:
      return {
        bg: 'from-slate-950 via-slate-900 to-indigo-950/40',
        cardBg: 'bg-slate-900/90 border-slate-700/40 text-slate-100',
        accentColor: 'text-cyan-300',
        badgeBg: 'bg-slate-800 text-cyan-300 border-slate-700',
        glow: 'shadow-[0_0_30px_rgba(30,41,59,0.3)]',
        headerGlow: 'from-indigo-500/10 to-transparent',
        label: 'Night Tokyo Atmosphere',
      };
  }
}
