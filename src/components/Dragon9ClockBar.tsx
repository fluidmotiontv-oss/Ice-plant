import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dragon9TimeState, Language } from '../types';
import { Clock, Moon, Sun, ShieldAlert, Sparkles, Sliders, Play, RotateCcw, Compass, Eye } from 'lucide-react';

interface Props {
  d9Time: Dragon9TimeState;
  lang: Language;
  simulatedHourOffset: number;
  onSimulatedHourOffsetChange: (offset: number) => void;
  onTriggerApexModal: () => void;
}

export const Dragon9ClockBar: React.FC<Props> = ({
  d9Time,
  lang,
  simulatedHourOffset,
  onSimulatedHourOffsetChange,
  onTriggerApexModal,
}) => {
  const [showTimePortal, setShowTimePortal] = useState<boolean>(false);

  const formatApexCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <header className="relative w-full z-40 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-xl shadow-2xl transition-all">
      {/* Top Engine Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Brand & Dragon 9 Node Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 via-emerald-500 to-amber-500 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center font-bold text-cyan-300 text-sm">
                9
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-wide text-slate-100">
                <span className="text-cyan-400">ICE PLANT</span>
                <span className="text-slate-500">×</span>
                <span className="text-amber-400 font-mono text-[11px]">DRAGON 9</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-emerald-400" />
                <span>Tokyo Node JST Engine</span>
              </div>
            </div>
          </div>

          {/* Cycle Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            {d9Time.standardHour >= 12 ? (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{lang === 'jp' ? d9Time.activeCycleNameJp : d9Time.activeCycleNameEn}</span>
          </div>
        </div>

        {/* Center: Live Dragon 9 Time Display */}
        <div className="flex items-center gap-2 font-mono">
          {/* Standard JST Clock */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{d9Time.jstTimeString}</span>
            <span className="text-[10px] text-cyan-400/80 font-sans">JST</span>
          </div>

          {/* Dragon 9 Custom 54-Min Hour Indicator */}
          <div className="bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-slate-400 text-[10px] font-sans uppercase tracking-wider">{lang === 'jp' ? 'D9刻' : 'D9 Hour'}:</span>
            <span className="font-bold text-cyan-300 text-xs">
              {d9Time.dragon9Hour} <span className="text-slate-500 text-[10px]">/ 13</span>
            </span>
            <span className="text-amber-300 text-[11px] font-mono">
              ({String(d9Time.dragon9Minute).padStart(2, '0')}m)
            </span>
          </div>

          {/* 13th Hour Open Wedge Indicator */}
          {d9Time.is13thHourWedge && (
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-sans font-medium animate-pulse">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{lang === 'jp' ? '第13刻オープンウェッジ' : '13th Hour Open Wedge'}</span>
            </div>
          )}
        </div>

        {/* Right: Apex Status & Time Portal Toggle */}
        <div className="flex items-center gap-2">
          {/* Active Apex Pause Banner */}
          {d9Time.isApexPause ? (
            <button
              onClick={onTriggerApexModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/30 transition-all font-mono font-bold animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>
                {d9Time.apexType === 'midday' ? 'ZEN MIDDAY' : 'ZEN MIDNIGHT'} ({formatApexCountdown(d9Time.apexRemainingSeconds)})
              </span>
            </button>
          ) : (
            <button
              onClick={onTriggerApexModal}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-[11px] transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'jp' ? '禅エイペックス見学' : 'View Zen Apex'}</span>
            </button>
          )}

          {/* Time Portal Slider Trigger Button */}
          <button
            onClick={() => setShowTimePortal(!showTimePortal)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              simulatedHourOffset !== 0
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'jp' ? '時間軸制御' : 'Time Portal'}</span>
            {simulatedHourOffset !== 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Interactive Time Scrubbing Drawer */}
      <AnimatePresence>
        {showTimePortal && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-900/95 border-t border-slate-800 backdrop-blur-md px-4 py-4"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-bold text-slate-200">
                    {lang === 'jp' ? 'Dragon 9 東京ノード 時間軸シミュレーター' : 'Dragon 9 Tokyo Node Time Scrubbing Portal'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {lang === 'jp'
                      ? '1,440分の1日をスライドして18分間のエイペックス・ポーズや13刻目の光彩変化をシミュレート'
                      : 'Scrub through the 1,440-minute day cycle to trigger the 18-minute Apex Pauses & 13th Hour lighting'}
                  </div>
                </div>
              </div>

              {/* Slider & Presets */}
              <div className="flex-1 w-full max-w-xl flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>-12h</span>
                  <span className="text-amber-300 font-bold">
                    Offset: {simulatedHourOffset > 0 ? `+${simulatedHourOffset}` : simulatedHourOffset} hrs
                  </span>
                  <span>+12h</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.5"
                  value={simulatedHourOffset}
                  onChange={(e) => onSimulatedHourOffsetChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
                />

                {/* Quick Jump Buttons */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      // Calculate offset to hit 12:00 PM JST
                      const currentJstHour = new Date().getUTCHours() + 9;
                      const targetOffset = 12 - (currentJstHour % 24);
                      onSimulatedHourOffsetChange(targetOffset);
                    }}
                    className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-[10px] flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5" />
                    <span>{lang === 'jp' ? '昼のエイペックス (12:00 Midday)' : 'Midday Apex (12:00)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const currentJstHour = new Date().getUTCHours() + 9;
                      const targetOffset = 0 - (currentJstHour % 24);
                      onSimulatedHourOffsetChange(targetOffset);
                    }}
                    className="px-2.5 py-1 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900 text-[10px] flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5" />
                    <span>{lang === 'jp' ? '夜のエイペックス (00:00 Midnight)' : 'Midnight Apex (00:00)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const currentJstHour = new Date().getUTCHours() + 9;
                      const targetOffset = 11.8 - (currentJstHour % 24);
                      onSimulatedHourOffsetChange(targetOffset);
                    }}
                    className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 hover:bg-amber-900 text-[10px] flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5" />
                    <span>{lang === 'jp' ? '第13刻ウェッジ (13th Hour)' : '13th Hour Wedge'}</span>
                  </button>

                  {simulatedHourOffset !== 0 && (
                    <button
                      onClick={() => onSimulatedHourOffsetChange(0)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-[10px] flex items-center gap-1 ml-auto"
                    >
                      <RotateCcw className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{lang === 'jp' ? '現在時刻リセット' : 'Reset Real Time'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
