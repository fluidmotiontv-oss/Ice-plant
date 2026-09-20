import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotMood, Season, Language } from '../types';
import { Sparkles, MessageCircle, Volume2, Bot } from 'lucide-react';

interface Props {
  mood?: MascotMood;
  season: Season;
  lang: Language;
  onAskRecommendation?: () => void;
  customMessage?: string;
  isFloatingOverlay?: boolean;
}

export const AoiBearMascot: React.FC<Props> = ({
  mood = 'happy',
  season,
  lang,
  onAskRecommendation,
  customMessage,
  isFloatingOverlay = false,
}) => {
  const [currentMood, setCurrentMood] = useState<MascotMood>(mood);
  const [showSpeech, setShowSpeech] = useState<boolean>(true);

  // Synchronize when mood prop changes
  React.useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  const getMascotSpeech = () => {
    if (customMessage) return customMessage;

    if (lang === 'jp') {
      switch (currentMood) {
        case 'shaving':
          return '「扇子で涼みながらパチパチ…🍧 極細スノー氷を丁寧に削り中クマ！」';
        case 'warm_oden':
          return '「ふーふー…🍢 赤いマフラーであたたかクマ！12時間出汁が染み染みクマ！」';
        case 'zen':
          return '「ぷかぷか…✨ Dragon 9 エイペックス・ポーズ。18分間の静寂をお楽しみくださいクマ。」';
        case 'thank_you':
          return '「ありがとうございますクマ！心を込めて準備するクマ✨」';
        case 'excited':
          return '「わーい！どれも美味しくて迷っちゃうクマね！」';
        case 'happy':
        default:
          return season === 'summer'
            ? '「いらっしゃいクマ！扇子で涼みながら宇治抹茶かき氷はいかがクマ？🍧」'
            : '「いらっしゃいクマ！温かいマフラー巻いてあつあつおでん食べるクマ？🍢」';
      }
    } else {
      switch (currentMood) {
        case 'shaving':
          return '"Cooling off with my paper fan...🍧 Shaving delicate micro-feather snow ice for you!"';
        case 'warm_oden':
          return '"Foo-foo...🍢 Snug in my red winter scarf! 12-hour golden dashi oden is hot & ready!"';
        case 'zen':
          return '"Puka-puka...✨ Dragon 9 Apex Pause is active. Enjoy 18 minutes of mindfulness."';
        case 'thank_you':
          return '"Arigato gozaimasu! Preparing your order with lots of love! ✨"';
        case 'excited':
          return '"Yay! Everything looks so delicious, it is hard to choose!"';
        case 'happy':
        default:
          return season === 'summer'
            ? '"Welcome to Ice Plant! Cool off with a fan and enjoy Uji Matcha Kakigori! 🍧"'
            : '"Welcome! Wrap up in cozy warmth and taste 12-hour simmered oden! 🍢"';
      }
    }
  };

  const handleMascotClick = () => {
    const moods: MascotMood[] = season === 'summer'
      ? ['happy', 'shaving', 'excited', 'zen']
      : ['happy', 'warm_oden', 'excited', 'zen'];
    const nextIndex = (moods.indexOf(currentMood) + 1) % moods.length;
    setCurrentMood(moods[nextIndex]);
    setShowSpeech(true);
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center group cursor-pointer select-none transition-all ${
        isFloatingOverlay ? 'z-40' : ''
      }`}
      onClick={handleMascotClick}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className={`absolute z-20 p-3 rounded-2xl bg-slate-900/95 border border-cyan-500/30 text-cyan-100 shadow-2xl backdrop-blur-md text-xs text-center leading-relaxed ${
              isFloatingOverlay ? '-top-28 right-0 w-56 md:w-64' : '-top-24 left-1/2 -translate-x-1/2 w-64 md:w-72'
            }`}
          >
            <div className="font-semibold text-amber-300 mb-1 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{lang === 'jp' ? 'しろくま葵ちゃん (Aoi Bear)' : 'Aoi Bear (Shiro-kuma)'}</span>
            </div>
            <p className="text-slate-200">{getMascotSpeech()}</p>
            {/* Bubble Tail */}
            <div
              className={`absolute -bottom-2 w-4 h-4 bg-slate-900 border-r border-b border-cyan-500/30 rotate-45 ${
                isFloatingOverlay ? 'right-8' : 'left-1/2 -translate-x-1/2'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Japanese Style Floating Physics Bear Body */}
      <motion.div
        animate={
          currentMood === 'zen'
            ? { y: [0, -12, 0], rotate: [-2, 2, -2] }
            : { y: [0, -8, 0], rotate: [-1.5, 1.5, -1.5] }
        }
        transition={{
          repeat: Infinity,
          duration: currentMood === 'zen' ? 3.5 : 2.8,
          ease: 'easeInOut',
        }}
        className={`relative flex items-center justify-center ${
          isFloatingOverlay ? 'w-24 h-24 md:w-28 md:h-28' : 'w-36 h-36 md:w-44 md:h-44'
        }`}
      >
        {/* Shadow Ground Blob */}
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          className="absolute -bottom-2 w-32 h-6 rounded-full bg-slate-950/80 blur-md pointer-events-none"
        />

        {/* Floating Seasonal Ambient Aura */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className={`absolute inset-0 rounded-full blur-xl pointer-events-none ${
            season === 'summer'
              ? 'bg-gradient-to-r from-cyan-500/30 via-teal-400/30 to-sky-500/20'
              : 'bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-red-500/20'
          }`}
        />

        {/* SVG Bear Graphic */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
          {/* Bear Ears */}
          <circle cx="60" cy="55" r="24" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="4" />
          <circle cx="60" cy="55" r="14" fill="#F472B6" opacity="0.6" />

          <circle cx="140" cy="55" r="24" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="4" />
          <circle cx="140" cy="55" r="14" fill="#F472B6" opacity="0.6" />

          {/* Winter Scarf or Summer Bandana */}
          {season === 'winter' ? (
            /* Wrapped Winter Scarf */
            <g>
              <path d="M 45 118 Q 100 145 155 118 Q 165 145 100 158 Q 35 145 45 118 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="3.5" />
              <path d="M 125 135 L 145 175 L 120 170 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2.5" />
            </g>
          ) : (
            /* Summer Cool Indigo Bandana */
            <path d="M 55 125 Q 100 135 145 125 L 100 145 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
          )}

          {/* Head & Body */}
          <ellipse cx="100" cy="100" rx="58" ry="52" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="4" />

          {/* Cheek Blush */}
          <circle cx="65" cy="110" r="10" fill="#FDA4AF" opacity="0.75" />
          <circle cx="135" cy="110" r="10" fill="#FDA4AF" opacity="0.75" />

          {/* Muzzle */}
          <ellipse cx="100" cy="112" rx="22" ry="17" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="2" />
          {/* Nose */}
          <polygon points="93,103 107,103 100,113" fill="#1E293B" />
          {/* Mouth */}
          <path d="M 94 118 Q 100 125 106 118" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

          {/* Eyes with Wink / Blink */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.93, 0.96, 1] }}
          >
            {currentMood === 'excited' ? (
              <>
                <path d="M 68 95 Q 75 85 82 95" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
                <path d="M 118 95 Q 125 85 132 95" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="75" cy="92" r="6" fill="#0F172A" />
                <circle cx="77" cy="90" r="2" fill="#FFFFFF" />
                <circle cx="125" cy="92" r="6" fill="#0F172A" />
                <circle cx="127" cy="90" r="2" fill="#FFFFFF" />
              </>
            )}
          </motion.g>

          {/* Seasonal Animated Props */}
          {season === 'summer' ? (
            <g transform="translate(100, 142)">
              {/* Summer Paper Fan (Sensu 扇子) waving */}
              <motion.g
                animate={{ rotate: [-8, 12, -8] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                style={{ transformOrigin: '15px 10px' }}
              >
                <path d="M -20 -10 Q 0 -30 20 -10 L 0 10 Z" fill="#06B6D4" stroke="#0891B2" strokeWidth="2" />
                <line x1="0" y1="10" x2="-15" y2="-12" stroke="#FEF08A" strokeWidth="1.5" />
                <line x1="0" y1="10" x2="0" y2="-22" stroke="#FEF08A" strokeWidth="1.5" />
                <line x1="0" y1="10" x2="15" y2="-12" stroke="#FEF08A" strokeWidth="1.5" />
              </motion.g>
            </g>
          ) : (
            <g transform="translate(100, 142)">
              {/* Wooden Oden Bowl */}
              <path d="M -25 0 Q 0 30 25 0 Z" fill="#78350F" stroke="#451A03" strokeWidth="3" />
              {/* Steam Particles */}
              <motion.path
                animate={{ y: [-2, -8, -2], opacity: [0.2, 0.8, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                d="M -10 -5 Q -5 -15 -10 -25 M 0 -5 Q 5 -15 0 -25 M 10 -5 Q 15 -15 10 -25"
                fill="none"
                stroke="#F8FAFC"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Daikon & Egg Inside */}
              <circle cx="-8" cy="2" r="7" fill="#FEF08A" />
              <rect x="2" y="-2" width="12" height="10" rx="3" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
            </g>
          )}

          {/* Bear Paws */}
          <circle cx="50" cy="142" r="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
          <circle cx="150" cy="142" r="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
        </svg>

        {/* AI Assist Sparkle Button badge */}
        {onAskRecommendation && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onAskRecommendation();
            }}
            className="absolute -bottom-2 right-0 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-lg border border-amber-300"
          >
            <Bot className="w-3 h-3 text-slate-950" />
            <span>{lang === 'jp' ? 'AI提案' : 'AI Recommend'}</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

