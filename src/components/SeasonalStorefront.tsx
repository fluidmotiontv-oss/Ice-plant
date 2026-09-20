import React from 'react';
import { motion } from 'motion/react';
import { Season, Language } from '../types';
import { Snowflake, Flame, Sun, Sparkles, Compass, Clock, MapPin, Award } from 'lucide-react';

interface Props {
  season: Season;
  onSeasonChange: (newSeason: Season) => void;
  isAutoSync: boolean;
  onToggleAutoSync: () => void;
  lang: Language;
  onOpenKiosk: () => void;
}

export const SeasonalStorefront: React.FC<Props> = ({
  season,
  onSeasonChange,
  isAutoSync,
  onToggleAutoSync,
  lang,
  onOpenKiosk,
}) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto my-6 px-4">
      {/* Protocol Banner Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 md:p-10 backdrop-blur-xl">
        {/* Background Decorative Ambient Gradient */}
        <div
          className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            season === 'summer'
              ? 'bg-gradient-to-br from-cyan-500/20 via-sky-500/20 to-teal-500/10'
              : 'bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/10'
          }`}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Title & Protocol Status */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 border shadow-sm ${
                  season === 'summer'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-amber-500/20 border-amber-400 text-amber-300'
                }`}
              >
                {season === 'summer' ? (
                  <>
                    <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SUMMER PROTOCOL ACTIVE (氷植物 夏ノ暖簾)</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>WINTER PROTOCOL ACTIVE (氷植物 冬ノ暖簾)</span>
                  </>
                )}
              </span>

              {/* Location Badge */}
              <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-xs flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Yanaka, Tokyo Node</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-100 tracking-tight font-sans">
              {season === 'summer' ? (
                lang === 'jp' ? (
                  <span>極細かき氷 & 宇治抹茶サンデー</span>
                ) : (
                  <span>Artisanal Micro-Feather Snow & Uji Matcha</span>
                )
              ) : (
                lang === 'jp' ? (
                  <span>12時間黄金出汁 おでん & 手押しはんぺん</span>
                ) : (
                  <span>12-Hour Golden Dashi Oden & Comfort Dishes</span>
                )
              )}
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              {season === 'summer'
                ? lang === 'jp'
                  ? '美咲の家系が代々受け継ぐ谷中の甘味処「氷植物」。極上の純水氷と自家製宇治抹茶シロップでひんやり贅沢なひとときを。'
                  : 'Passed down through Misaki’s family in historic Yanaka, Ice Plant transforms pure crystal ice into silky micro-feather snow paired with authentic Kyoto matchas.'
                : lang === 'jp'
                  ? '利尻昆布と焼津鰹節を12時間じっくり煮込んだ特製出汁。味が芯まで染み渡った大根と柔らか黒豚おでんで温まりください。'
                  : 'Slow-simmered for 12 hours with Rishiri kelp and Yaizu skipjack tuna flakes. Comforting hot Daikon, Kurobuta pork, and house-pressed Hanpen.'}
            </p>
          </div>

          {/* Right Protocol Toggle & Kiosk Launch Button */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Auto Sync & Manual Toggle Box */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between gap-4 text-slate-400 font-mono text-[11px]">
                <span>{lang === 'jp' ? '季節プロトコル切り替え' : 'Season Protocol Mode'}</span>
                <button
                  onClick={onToggleAutoSync}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors ${
                    isAutoSync ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAutoSync ? 'AUTO JST SYNC' : 'MANUAL'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onSeasonChange('summer')}
                  className={`px-3 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    season === 'summer'
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>{lang === 'jp' ? '夏 🍧 Shaved Ice' : 'Summer 🍧'}</span>
                </button>

                <button
                  onClick={() => onSeasonChange('winter')}
                  className={`px-3 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                    season === 'winter'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{lang === 'jp' ? '冬 🍢 Oden' : 'Winter 🍢'}</span>
                </button>
              </div>
            </div>

            {/* Jump to Kiosk Button */}
            <button
              onClick={onOpenKiosk}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-extrabold text-sm shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{lang === 'jp' ? 'タブレット注文画面を開く' : 'Open Tablet Touch Kiosk'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
