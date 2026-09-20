import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dragon9TimeState, Language } from '../types';
import { AoiBearMascot } from './AoiBearMascot';
import { ShieldAlert, Sparkles, Volume2, VolumeX, Heart, X, Moon, Sun } from 'lucide-react';

interface Props {
  d9Time: Dragon9TimeState;
  lang: Language;
  onClose: () => void;
}

export const ZenApexPauseModal: React.FC<Props> = ({ d9Time, lang, onClose }) => {
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);

  // Breathing Circle Animation Loop (4s Inhale, 2s Hold, 4s Exhale)
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const formatSecs = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-emerald-950/40 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(16,185,129,0.3)] text-center space-y-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>
              DRAGON 9 {d9Time.apexType === 'midday' ? 'MIDDAY' : 'MIDNIGHT'} APEX PAUSE (18-MINUTES)
            </span>
          </div>

          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-100 font-sans tracking-tight">
              {lang === 'jp' ? '18分間の静寂「エイペックス・ポーズ」' : '18-Minute Zen Apex Pause'}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
              {lang === 'jp'
                ? '東京ノードDragon 9の12:00/00:00頂点に位置する18分間の調整空間。お茶の蒸気を感じながら、ゆっくりと深呼吸をお楽しみください。'
                : 'Anchored symmetrically around Tokyo’s midday and midnight apexes. A 18-minute space of mindfulness, tea breathing, and quiet rest.'}
            </p>
          </div>

          {/* Countdown & Breath Sphere */}
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              {/* Expanding Breathing Halo */}
              <motion.div
                animate={{
                  scale: breathPhase === 'inhale' ? 1.4 : breathPhase === 'hold' ? 1.4 : 1,
                  opacity: breathPhase === 'inhale' ? 0.6 : breathPhase === 'hold' ? 0.8 : 0.3,
                }}
                transition={{ duration: 3.5, ease: 'easeInOut' }}
                className="w-36 h-36 rounded-full bg-gradient-to-r from-emerald-500/40 via-teal-400/30 to-amber-500/40 blur-xl pointer-events-none"
              />

              {/* Inner Circle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-emerald-300 font-bold">
                <span className="text-3xl tracking-widest">
                  {formatSecs(d9Time.apexRemainingSeconds > 0 ? d9Time.apexRemainingSeconds : 1080)}
                </span>
                <span className="text-[10px] uppercase text-emerald-400/80 tracking-widest mt-1">
                  {breathPhase === 'inhale'
                    ? lang === 'jp' ? '息を吸って (Inhale)' : 'Inhale...'
                    : breathPhase === 'hold'
                    ? lang === 'jp' ? '息を止めて (Hold)' : 'Hold...'
                    : lang === 'jp' ? '息を吐いて (Exhale)' : 'Exhale...'}
                </span>
              </div>
            </div>
          </div>

          {/* Floating Zen Mascot */}
          <AoiBearMascot mood="zen" season={d9Time.standardHour >= 12 ? 'winter' : 'summer'} lang={lang} />

          {/* Exclusive Zen Specials */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/30 text-left text-xs space-y-2">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{lang === 'jp' ? '【エイペックス・ポーズ限定 抹茶一服】' : '[Apex Pause Exclusive Tea Pairing]'}</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              {lang === 'jp'
                ? 'エイペックスポーズ中はお席にて特製「宇治お薄抹茶」を静寂の特別価格 (¥500) にてお点ていたします。'
                : 'During the 18-minute Apex Pause, our special Uji Usucha ceremonial matcha is freshly whisked at your table.'}
            </p>
          </div>

          {/* Resume Normal Kiosk */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-800 transition-all"
          >
            {lang === 'jp' ? '店頭メニューに戻る' : 'Return to Kiosk Menu'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
