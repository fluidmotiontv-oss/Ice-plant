import React, { useState, useEffect } from 'react';
import { Dragon9ClockBar } from './components/Dragon9ClockBar';
import { SeasonalStorefront } from './components/SeasonalStorefront';
import { TabletOrderKiosk } from './components/TabletOrderKiosk';
import { InstagramFeed } from './components/InstagramFeed';
import { ZenApexPauseModal } from './components/ZenApexPauseModal';
import { calculateDragon9Time, getAmbientTheme } from './lib/dragon9Engine';
import { Dragon9TimeState, Season, Language } from './types';
import { Sparkles, Globe, Compass, Heart } from 'lucide-react';

export default function App() {
  const [simulatedHourOffset, setSimulatedHourOffset] = useState<number>(0);
  const [d9Time, setD9Time] = useState<Dragon9TimeState>(calculateDragon9Time(0));
  const [season, setSeason] = useState<Season>('summer');
  const [isAutoSync, setIsAutoSync] = useState<boolean>(true);
  const [lang, setLang] = useState<Language>('jp');
  const [showApexModal, setShowApexModal] = useState<boolean>(false);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);

  // Update Dragon 9 Math every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateDragon9Time(simulatedHourOffset);
      setD9Time(updated);

      // Auto-sync season based on month if enabled
      if (isAutoSync) {
        const jstMonth = new Date().getUTCMonth(); // 0 to 11
        // Summer: May-Oct (4 to 9), Winter: Nov-Apr
        if (jstMonth >= 4 && jstMonth <= 9) {
          setSeason('summer');
        } else {
          setSeason('winter');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [simulatedHourOffset, isAutoSync]);

  // Request AI Recommendation from Gemini API backend
  const handleAskAiRecommendation = async () => {
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          season,
          timeOfDay: d9Time.ambientLighting,
          mood: 'relaxing',
        }),
      });
      const data = await res.json();
      setAiRecommendation(data);
    } catch (err) {
      console.error('Failed to fetch AI recommendation:', err);
    }
  };

  const ambientTheme = getAmbientTheme(d9Time.ambientLighting);

  const scrollToKiosk = () => {
    const el = document.getElementById('tablet-order-kiosk-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeed = () => {
    const el = document.getElementById('instagram-feed-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStorefront = () => {
    const el = document.getElementById('storefront-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${ambientTheme.bg} text-slate-100 font-sans transition-colors duration-1000 relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950`}>
      {/* Dynamic Ambient Background Canvas Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b ${ambientTheme.headerGlow} blur-3xl opacity-60`} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Language & Header Utility Bar */}
        <div className="w-full bg-slate-950/80 border-b border-slate-900 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dragon 9 Tokyo Node Online</span>
            </div>

            {/* Quick Navigation Jump Links */}
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-800 text-[11px]">
              <button
                onClick={scrollToStorefront}
                className="px-2 py-0.5 rounded-md hover:bg-slate-900 text-slate-300 transition-colors"
              >
                {lang === 'jp' ? '季節の店頭' : 'Storefront'}
              </button>
              <button
                onClick={scrollToKiosk}
                className="px-2 py-0.5 rounded-md hover:bg-slate-900 text-slate-300 transition-colors"
              >
                {lang === 'jp' ? '注文キオスク' : 'Order Kiosk'}
              </button>
              <button
                onClick={scrollToFeed}
                className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-600/20 text-rose-300 border border-rose-500/30 hover:border-rose-400 transition-all font-bold flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{lang === 'jp' ? 'インスタグラム投稿' : 'Instagram Feed'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setLang('jp')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                  lang === 'jp' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                日本語 (JP)
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                  lang === 'en' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>
        </div>

        {/* Dragon 9 Tokyo Node Clock Bar & HUD */}
        <Dragon9ClockBar
          d9Time={d9Time}
          lang={lang}
          simulatedHourOffset={simulatedHourOffset}
          onSimulatedHourOffsetChange={setSimulatedHourOffset}
          onTriggerApexModal={() => setShowApexModal(true)}
        />

        {/* Main Content Areas */}
        <main className="flex-1 space-y-8 pb-16">
          {/* Seasonal Storefront Hero */}
          <div id="storefront-section" className="scroll-mt-4">
            <SeasonalStorefront
              season={season}
              onSeasonChange={(s) => {
                setIsAutoSync(false);
                setSeason(s);
              }}
              isAutoSync={isAutoSync}
              onToggleAutoSync={() => setIsAutoSync(!isAutoSync)}
              lang={lang}
              onOpenKiosk={scrollToKiosk}
            />
          </div>

          {/* iPad / Tablet Order Touch Screen Kiosk Section */}
          <div id="tablet-order-kiosk-section">
            <TabletOrderKiosk
              season={season}
              lang={lang}
              onAskAiRecommendation={handleAskAiRecommendation}
              aiRecommendation={aiRecommendation}
            />
          </div>

          {/* Instagram Content Feed @ice_plant_aoi */}
          <InstagramFeed lang={lang} />
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-8 px-4 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">ICE PLANT (氷植物)</span>
              <span>— Misaki's Artisanal Seasonal Shop</span>
            </div>

            <div className="flex items-center gap-4 text-slate-500 text-[11px] font-mono">
              <span>Dragon 9 Tokyo Node Engine v2.4</span>
              <span>•</span>
              <span>1,440-Min Day / 54-Min Hours</span>
              <span>•</span>
              <span>18-Min Apex Pauses</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Zen Apex Pause Modal */}
      {showApexModal && (
        <ZenApexPauseModal
          d9Time={d9Time}
          lang={lang}
          onClose={() => setShowApexModal(false)}
        />
      )}
    </div>
  );
}
