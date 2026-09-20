import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { MenuItem, OrderItem, Season, Language, OrderCustomization } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import { AoiBearMascot } from './AoiBearMascot';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  CreditCard,
  CheckCircle2,
  DollarSign,
  Utensils,
  Maximize2,
  Minimize2,
  Flame,
  Snowflake,
  ChevronRight,
  Printer,
  Tablet,
  X,
  Volume2,
  VolumeX,
  Zap,
  QrCode,
  Copy,
  Check
} from 'lucide-react';

interface Props {
  season: Season;
  lang: Language;
  onAskAiRecommendation: () => void;
  aiRecommendation?: any;
}

// Utility for Web Audio API click feedback
const playAudioFeedback = (type: 'tap' | 'add' | 'success' = 'tap') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'tap') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'add') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    // ignore audio restrictions
  }
};

// Utility for device vibration haptic feedback
const triggerHaptic = (type: 'light' | 'medium' | 'success' = 'light') => {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      if (type === 'light') navigator.vibrate(10);
      else if (type === 'medium') navigator.vibrate(22);
      else if (type === 'success') navigator.vibrate([15, 30, 20]);
    } catch (e) {
      // ignore
    }
  }
};

export const TabletOrderKiosk: React.FC<Props> = ({
  season,
  lang,
  onAskAiRecommendation,
  aiRecommendation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<OrderCustomization>({});
  const [orderType, setOrderType] = useState<'dine-in' | 'take-out'>('dine-in');
  const [tableNumber, setTableNumber] = useState<string>('03');
  const [currency, setCurrency] = useState<'JPY' | 'USD' | 'EUR'>('JPY');
  const [isTabletFrame, setIsTabletFrame] = useState<boolean>(true);
  const [checkoutStep, setCheckoutStep] = useState<'kiosk' | 'payment' | 'receipt'>('kiosk');
  const [orderTicketNumber, setOrderTicketNumber] = useState<string>('');
  const [activePaymentMethod, setActivePaymentMethod] = useState<'suica' | 'credit' | 'qr'>('suica');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copiedQr, setCopiedQr] = useState<boolean>(false);

  // Haptic & Sound State
  const [isHapticEnabled, setIsHapticEnabled] = useState<boolean>(true);
  const [tappedItemId, setTappedItemId] = useState<string | null>(null);
  const [cartBump, setCartBump] = useState<boolean>(false);
  const [floatingPopText, setFloatingPopText] = useState<{ id: string; text: string } | null>(null);

  // Exchange Rates (approximate)
  const usdRate = 0.0067; // 1 JPY = 0.0067 USD
  const eurRate = 0.0062; // 1 JPY = 0.0062 EUR

  const handleFeedback = (soundType: 'tap' | 'add' | 'success' = 'tap', hapticType: 'light' | 'medium' | 'success' = 'light') => {
    if (isHapticEnabled) {
      triggerHaptic(hapticType);
      playAudioFeedback(soundType);
    }
  };

  // Filter menu items by season or all
  const visibleMenuItems = MENU_ITEMS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const categories = [
    { id: 'all', labelJp: 'すべて (All)', labelEn: 'All Items' },
    { id: 'kakigori', labelJp: '🍧 かき氷 (Shaved Ice)', labelEn: '🍧 Shaved Ice' },
    { id: 'oden', labelJp: '🍢 熱々おでん (Oden)', labelEn: '🍢 Hot Oden' },
    { id: 'sundae', labelJp: '🍨 サンデー・パフェ', labelEn: '🍨 Sundaes & Parfaits' },
    { id: 'drink', labelJp: '🍵 お茶・抹茶ドリンク', labelEn: '🍵 Teas & Drinks' },
    { id: 'side', labelJp: '🍚 締め出汁茶漬け', labelEn: '🍚 Comfort Dashi Rice' },
  ];

  const handleOpenCustomize = (item: MenuItem) => {
    handleFeedback('tap', 'light');
    setTappedItemId(item.id);
    setTimeout(() => setTappedItemId(null), 300);

    const defaultCustoms: OrderCustomization = {};
    item.customizeOptions?.forEach((opt) => {
      const defaultChoice = opt.choices.find((c) => c.default) || opt.choices[0];
      if (defaultChoice) {
        defaultCustoms[opt.nameEn] = defaultChoice.labelEn;
      }
    });
    setSelectedCustomizations(defaultCustoms);
    setCustomizingItem(item);
  };

  const handleAddToCart = (item: MenuItem, customs: OrderCustomization = {}) => {
    handleFeedback('add', 'medium');

    // Trigger visual pop animation
    setFloatingPopText({ id: item.id, text: '+1' });
    setTimeout(() => setFloatingPopText(null), 800);

    // Bump cart icon
    setCartBump(true);
    setTimeout(() => setCartBump(false), 400);

    // Calculate extra cost from options
    let extraJpy = 0;
    item.customizeOptions?.forEach((opt) => {
      const selectedChoiceLabel = customs[opt.nameEn];
      const choiceObj = opt.choices.find((c) => c.labelEn === selectedChoiceLabel);
      if (choiceObj && choiceObj.priceDeltaJpy) {
        extraJpy += choiceObj.priceDeltaJpy;
      }
    });

    const unitPriceJpy = item.priceJpy + extraJpy;
    const cartId = `${item.id}-${JSON.stringify(customs)}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) =>
          i.cartId === cartId
            ? {
                ...i,
                quantity: i.quantity + 1,
                totalPriceJpy: (i.quantity + 1) * unitPriceJpy,
              }
            : i
        );
      }
      return [
        ...prev,
        {
          cartId,
          item,
          quantity: 1,
          customizations: customs,
          unitPriceJpy,
          totalPriceJpy: unitPriceJpy,
        },
      ];
    });

    setCustomizingItem(null);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    handleFeedback('tap', 'light');
    setCartBump(true);
    setTimeout(() => setCartBump(false), 300);

    setCart((prev) =>
      prev
        .map((i) => {
          if (i.cartId === cartId) {
            const newQty = i.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...i,
              quantity: newQty,
              totalPriceJpy: newQty * i.unitPriceJpy,
            };
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const totalJpy = cart.reduce((sum, item) => sum + item.totalPriceJpy, 0);

  const formatPrice = (jpy: number) => {
    if (currency === 'USD') {
      return `$${(jpy * usdRate).toFixed(2)}`;
    }
    if (currency === 'EUR') {
      return `€${(jpy * eurRate).toFixed(2)}`;
    }
    return `¥${jpy.toLocaleString()}`;
  };

  const handleProcessPayment = () => {
    handleFeedback('success', 'success');
    const randomTicket = `IP-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderTicketNumber(randomTicket);
    setCheckoutStep('payment');

    setTimeout(() => {
      handleFeedback('success', 'success');
      setCheckoutStep('receipt');
    }, 2200);
  };

  const handleNewOrder = () => {
    handleFeedback('tap', 'light');
    setCart([]);
    setCheckoutStep('kiosk');
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto my-8 px-2 sm:px-4">
      {/* Kiosk Mode Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-t-2xl px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Tablet className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{lang === 'jp' ? 'Yanaka 店内タブレット注文端末 (Tablet Touch Screen)' : 'Yanaka Store Tablet Order Touch Screen'}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Haptic & Audio Feedback Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const next = !isHapticEnabled;
              setIsHapticEnabled(next);
              if (next) triggerHaptic('medium');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all border ${
              isHapticEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
            title="Toggle Visual & Audio Haptic Feedback"
          >
            {isHapticEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isHapticEnabled ? 'HAPTICS ON' : 'HAPTICS OFF'}</span>
          </motion.button>

          {/* Currency Selector */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
            {(['JPY', 'USD', 'EUR'] as const).map((curr) => (
              <motion.button
                key={curr}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  handleFeedback('tap', 'light');
                  setCurrency(curr);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                  currency === curr ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {curr}
              </motion.button>
            ))}
          </div>

          {/* Toggle iPad Frame Container */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              handleFeedback('tap', 'light');
              setIsTabletFrame(!isTabletFrame);
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
            title="Toggle iPad Device Border"
          >
            {isTabletFrame ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </motion.button>
        </div>
      </div>

      {/* Main Kiosk Layout Outer Frame */}
      <div
        className={`transition-all duration-300 ${
          isTabletFrame
            ? 'p-3 md:p-6 bg-slate-900/90 border-4 border-slate-800 rounded-b-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
            : 'p-2 bg-slate-950/60 border border-slate-800 rounded-b-2xl'
        }`}
      >
        {checkoutStep === 'receipt' ? (
          /* ================= ORDER SUCCESSFUL DIGITAL RECEIPT ================= */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto my-6 p-6 bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl text-center space-y-5"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10 animate-pulse" />
            </div>

            <div>
              <div className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-widest">
                {lang === 'jp' ? '注文完了 / Digital Receipt Ready' : 'Order Successfully Placed'}
              </div>
              <h2 className="text-3xl font-extrabold font-mono text-slate-100 mt-1">{orderTicketNumber}</h2>
              <p className="text-xs text-slate-400 mt-1">
                {orderType === 'dine-in'
                  ? lang === 'jp' ? `お席 Table #${tableNumber} にお届けします` : `Delivering to Table #${tableNumber}`
                  : lang === 'jp' ? 'お呼び出しまでカウンター前でお待ちください' : 'Please wait near counter for takeout pick-up'}
              </p>
            </div>

            {/* Aoi Bear Mascot Thank You */}
            <AoiBearMascot mood="thank_you" season={season} lang={lang} />

            {/* Digital Receipt QR Code Generator Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 text-center space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-300 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'jp' ? 'カウンター受取用 QRコード' : 'Pickup Express QR Code'}</span>
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800">
                  {lang === 'jp' ? '即時受取' : 'Express Pickup'}
                </span>
              </div>

              {/* QR Code Canvas Frame */}
              <div className="flex flex-col items-center justify-center gap-3 pt-1">
                <div
                  onClick={() => {
                    handleFeedback('tap', 'light');
                    setShowQrModal(true);
                  }}
                  className="p-3 bg-white rounded-2xl shadow-xl border-2 border-cyan-400/80 cursor-pointer hover:scale-105 transition-transform group relative"
                  title="Click to Enlarge QR Code"
                >
                  <QRCodeSVG
                    value={`https://iceplant.kyoto/pickup?ticket=${orderTicketNumber}&type=${orderType}&amount=${totalJpy}&items=${cart.length}`}
                    size={140}
                    bgColor="#FFFFFF"
                    fgColor="#0F172A"
                    level="H"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] rounded-2xl flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                    {lang === 'jp' ? 'タップで拡大' : 'Tap to Enlarge'}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                  {lang === 'jp'
                    ? '受取カウンターのリーダーにかざすか、スマホでスキャンしてデジタル伝票を取得できます。'
                    : 'Scan at counter reader for express pickup or scan with smartphone to save digital receipt.'}
                </p>

                {/* QR Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      handleFeedback('tap', 'light');
                      setShowQrModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'jp' ? 'QRコードを拡大' : 'Enlarge QR'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      handleFeedback('tap', 'light');
                      const receiptSummary = `ICE PLANT YANAKA TICKET: ${orderTicketNumber}\nTotal: ¥${totalJpy}\nType: ${orderType}\nItems: ${cart.map(i => i.item.nameEn).join(', ')}`;
                      navigator.clipboard.writeText(receiptSummary);
                      setCopiedQr(true);
                      setTimeout(() => setCopiedQr(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copiedQr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedQr ? (lang === 'jp' ? 'コピー完了' : 'Copied!') : (lang === 'jp' ? '伝票情報コピー' : 'Copy Ticket Data')}</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-300 border-b border-slate-800 pb-2">
                <span>{lang === 'jp' ? '注文内容 (Items)' : 'Ordered Items'}</span>
                <span>{formatPrice(totalJpy)}</span>
              </div>
              {cart.map((item) => (
                <div key={item.cartId} className="flex justify-between text-slate-400">
                  <span>
                    {item.quantity}x {lang === 'jp' ? item.item.nameJp : item.item.nameEn}
                  </span>
                  <span>{formatPrice(item.totalPriceJpy)}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewOrder}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'jp' ? '新しい注文を開始する' : 'Start New Order'}</span>
            </motion.button>

            {/* Enlarged QR Modal */}
            <AnimatePresence>
              {showQrModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="relative bg-slate-900 border border-cyan-500/50 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
                  >
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setShowQrModal(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>

                    <h3 className="text-lg font-bold text-slate-100 flex items-center justify-center gap-2">
                      <QrCode className="w-5 h-5 text-cyan-400" />
                      <span>{lang === 'jp' ? 'カウンター受取用 QR' : 'Express Pickup QR Code'}</span>
                    </h3>
                    <p className="text-xs font-mono text-cyan-400 font-bold">{orderTicketNumber}</p>

                    <div className="p-4 bg-white rounded-2xl shadow-2xl border-4 border-cyan-400 inline-block mx-auto">
                      <QRCodeSVG
                        value={`https://iceplant.kyoto/pickup?ticket=${orderTicketNumber}&type=${orderType}&amount=${totalJpy}&items=${cart.length}`}
                        size={220}
                        bgColor="#FFFFFF"
                        fgColor="#0F172A"
                        level="H"
                      />
                    </div>

                    <p className="text-xs text-slate-400">
                      {lang === 'jp'
                        ? 'Yanaka受取カウンター端末またはスタッフにお見せください。'
                        : 'Present this QR code at Yanaka pickup counter or scanner.'}
                    </p>

                    <button
                      onClick={() => setShowQrModal(false)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                    >
                      {lang === 'jp' ? '閉じる' : 'Close'}
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : checkoutStep === 'payment' ? (
          /* ================= PAYMENT PROCESSING SCREEN ================= */
          <div className="py-20 text-center space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="w-20 h-20 mx-auto rounded-full border-4 border-cyan-500 border-t-transparent flex items-center justify-center text-cyan-400"
            />
            <div>
              <h3 className="text-xl font-bold text-slate-100">
                {lang === 'jp' ? 'Suica / 端末で決済処理中...' : 'Processing Payment...'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'jp' ? 'ICカード / 端末をにかざしてください' : 'Please tap your IC Card or Mobile Wallet'}
              </p>
            </div>
          </div>
        ) : (
          /* ================= TABLET ORDER KIOSK MAIN INTERFACE ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
            {/* Left Column: Menu Items & Category Filter (8 cols) */}
            <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
              <div>
                {/* Category Bar with Spring Tap Animation */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      onClick={() => {
                        handleFeedback('tap', 'light');
                        setSelectedCategory(cat.id);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/40'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {lang === 'jp' ? cat.labelJp : cat.labelEn}
                    </motion.button>
                  ))}
                </div>

                {/* AI Mascot Assistant Strip */}
                {aiRecommendation && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/30 flex items-center justify-between gap-3 text-xs shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                      <div>
                        <span className="font-bold text-amber-300">
                          {lang === 'jp' ? 'Shiro-kumaの本日のおすすめ: ' : 'Shiro-kuma Recommendation: '}
                        </span>
                        <span className="text-slate-200">{aiRecommendation.title}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        const recItem = MENU_ITEMS.find((m) => m.id === aiRecommendation.recommendedItemId) || MENU_ITEMS[0];
                        handleOpenCustomize(recItem);
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] whitespace-nowrap hover:bg-amber-400 shadow-sm"
                    >
                      {lang === 'jp' ? '注文する' : 'Select'}
                    </motion.button>
                  </motion.div>
                )}

                {/* Touch Grid of Menu Items with Tactile Haptic Feedback */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 mt-4">
                  {visibleMenuItems.map((item) => {
                    const isJustTapped = tappedItemId === item.id;
                    const showPop = floatingPopText?.id === item.id;

                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.025, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        onClick={() => handleOpenCustomize(item)}
                        className={`group relative bg-slate-900/90 border rounded-2xl p-3 flex flex-col justify-between hover:border-cyan-400 transition-all cursor-pointer shadow-lg overflow-hidden select-none active:bg-cyan-950/20 ${
                          isJustTapped
                            ? 'border-cyan-400 ring-2 ring-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                            : 'border-slate-800/90'
                        }`}
                      >
                        {/* Floating "+1" Visual Haptic Pop */}
                        <AnimatePresence>
                          {showPop && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.5 }}
                              animate={{ opacity: 1, y: -20, scale: 1.2 }}
                              exit={{ opacity: 0, scale: 1.5 }}
                              transition={{ duration: 0.6 }}
                              className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-xl pointer-events-none flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3 fill-slate-950" />
                              <span>{floatingPopText.text}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Ripple Overlay Effect on Tap */}
                        {isJustTapped && (
                          <motion.div
                            initial={{ opacity: 0.5, scale: 0 }}
                            animate={{ opacity: 0, scale: 2 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 bg-cyan-400/20 rounded-2xl pointer-events-none"
                          />
                        )}

                        <div>
                          {/* Image & Signature Tag */}
                          <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2.5 bg-slate-950">
                            <img
                              src={item.imageUrl}
                              alt={item.nameEn}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {item.isSignature && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] shadow-md">
                                {lang === 'jp' ? '名物 Signature' : 'Signature'}
                              </span>
                            )}
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-cyan-300 font-mono font-bold text-xs border border-slate-700 shadow-md">
                              {formatPrice(item.priceJpy)}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <h4 className="font-bold text-slate-100 text-sm leading-snug group-hover:text-cyan-300 transition-colors">
                            {lang === 'jp' ? item.nameJp : item.nameEn}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-normal">
                            {lang === 'jp' ? item.descriptionJp : item.descriptionEn}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {item.calories ? `${item.calories} kcal` : ''}
                          </span>
                          <motion.div
                            whileHover={{ x: 3 }}
                            className="flex items-center gap-1 text-cyan-400 font-bold"
                          >
                            <span>{lang === 'jp' ? '追加する' : 'Add'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Mascot Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AoiBearMascot season={season} lang={lang} onAskRecommendation={onAskAiRecommendation} />
                  <div className="hidden sm:block text-xs text-slate-400">
                    <p className="font-bold text-slate-200">
                      {lang === 'jp' ? '【あおい熊のメモ】' : '[Shiro-kuma Note]'}
                    </p>
                    <p className="text-[11px]">
                      {season === 'summer'
                        ? lang === 'jp' ? '当店の氷は毎朝純水をじっくり削ったスノー氷です！' : 'Our snow ice is shaved fresh daily from pure crystal ice!'
                        : lang === 'jp' ? 'おでん出汁は12時間かけて昆布と鰹を煮込んでいます！' : 'Our oden dashi is slow-cooked for 12 hours with kelp and bonito!'}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    handleFeedback('tap', 'light');
                    onAskAiRecommendation();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg hover:brightness-110"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'jp' ? 'AIおすすめを聞く' : 'Ask AI Recommendation'}</span>
                </motion.button>
              </div>
            </div>

            {/* Right Column: Order Ticket Cart Drawer (4 cols) */}
            <div className="lg:col-span-4 bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-2xl">
              <div>
                {/* Header Ticket with Animated Cart Bump */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={cartBump ? { scale: [1, 1.35, 1], rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <ShoppingBag className="w-4 h-4 text-cyan-400" />
                    </motion.div>
                    <span className="font-bold text-slate-100 text-sm">
                      {lang === 'jp' ? 'ご注文伝票 (Ticket Cart)' : 'Order Ticket'}
                    </span>
                  </div>
                  <motion.span
                    animate={cartBump ? { scale: [1, 1.25, 1] } : {}}
                    className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono font-bold shadow-sm"
                  >
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} items
                  </motion.span>
                </div>

                {/* Dine-In / Take-Out Selector */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      handleFeedback('tap', 'light');
                      setOrderType('dine-in');
                    }}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                      orderType === 'dine-in'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-sm ring-1 ring-cyan-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>{lang === 'jp' ? '店内 (Dine-In)' : 'Dine-In'}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => {
                      handleFeedback('tap', 'light');
                      setOrderType('take-out');
                    }}
                    className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                      orderType === 'take-out'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-sm ring-1 ring-cyan-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{lang === 'jp' ? 'テイクアウト' : 'Take-Out'}</span>
                  </motion.button>
                </div>

                {/* Table Number */}
                {orderType === 'dine-in' && (
                  <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 mb-3 font-mono">
                    <span>{lang === 'jp' ? '卓番号 (Table No.):' : 'Table Assignment:'}</span>
                    <select
                      value={tableNumber}
                      onChange={(e) => {
                        handleFeedback('tap', 'light');
                        setTableNumber(e.target.value);
                      }}
                      className="bg-slate-950 border border-slate-700 text-cyan-300 rounded px-2 py-0.5 font-bold cursor-pointer"
                    >
                      <option value="01">Table #01</option>
                      <option value="02">Table #02</option>
                      <option value="03">Table #03 (Window)</option>
                      <option value="04">Table #04 (Garden)</option>
                    </select>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                      <ShoppingBag className="w-8 h-8 mx-auto text-slate-700 stroke-[1.5]" />
                      <p>{lang === 'jp' ? '伝票は空です。メニューを選択してください。' : 'Your order ticket is empty. Select items to add.'}</p>
                    </div>
                  ) : (
                    cart.map((cartItem) => (
                      <motion.div
                        key={cartItem.cartId}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1 text-xs"
                      >
                        <div className="flex justify-between items-start font-bold text-slate-200">
                          <span>{lang === 'jp' ? cartItem.item.nameJp : cartItem.item.nameEn}</span>
                          <span className="font-mono text-cyan-300">{formatPrice(cartItem.totalPriceJpy)}</span>
                        </div>

                        {/* Customization Details */}
                        {Object.entries(cartItem.customizations).map(([k, v]) => (
                          <div key={k} className="text-[10px] text-slate-400">
                            • {v}
                          </div>
                        ))}

                        {/* Quantity Adjust Controls */}
                        <div className="flex items-center justify-between pt-1 mt-1 border-t border-slate-800/60">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => handleUpdateQuantity(cartItem.cartId, -1)}
                              className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 font-bold active:bg-cyan-500 active:text-slate-950 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="font-mono font-bold text-slate-200 text-xs px-1">{cartItem.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => handleUpdateQuantity(cartItem.cartId, 1)}
                              className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 font-bold active:bg-cyan-500 active:text-slate-950 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => handleUpdateQuantity(cartItem.cartId, -cartItem.quantity)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Cart Footer Total & Checkout */}
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalJpy)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Consumption Tax (8% included):</span>
                    <span>¥0 (Inc)</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-slate-100 pt-1 border-t border-slate-800">
                    <span>Total Amount:</span>
                    <span className="text-cyan-400 font-extrabold">{formatPrice(totalJpy)}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  disabled={cart.length === 0}
                  onClick={handleProcessPayment}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{lang === 'jp' ? '注文を確定して会計' : 'Place Order & Pay'}</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= ITEM CUSTOMIZER MODAL ================= */}
      <AnimatePresence>
        {customizingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => {
                  handleFeedback('tap', 'light');
                  setCustomizingItem(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Header */}
              <div className="flex items-center gap-3">
                <img
                  src={customizingItem.imageUrl}
                  alt={customizingItem.nameEn}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    {lang === 'jp' ? customizingItem.nameJp : customizingItem.nameEn}
                  </h3>
                  <p className="text-sm font-mono text-cyan-400 font-bold">{formatPrice(customizingItem.priceJpy)}</p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1 text-xs">
                {/* Standard Item Specific Customization Options */}
                {customizingItem.customizeOptions?.map((opt) => (
                  <div key={opt.nameEn} className="space-y-2">
                    <label className="font-bold text-slate-300 block">
                      {lang === 'jp' ? opt.nameJp : opt.nameEn}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {opt.choices.map((choice) => {
                        const isSelected = selectedCustomizations[opt.nameEn] === choice.labelEn;
                        return (
                          <motion.button
                            key={choice.labelEn}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => {
                              handleFeedback('tap', 'light');
                              setSelectedCustomizations((prev) => ({
                                ...prev,
                                [opt.nameEn]: choice.labelEn,
                              }));
                            }}
                            className={`p-2.5 rounded-xl text-left transition-all border ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold ring-1 ring-cyan-400/50 shadow-md'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-[11px]">{lang === 'jp' ? choice.labelJp : choice.labelEn}</div>
                            {choice.priceDeltaJpy && (
                              <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                                +{formatPrice(choice.priceDeltaJpy)}
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Quick Universal Customization Toggles */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <label className="font-bold text-cyan-300 block text-[11px] flex items-center justify-between">
                    <span>{lang === 'jp' ? 'クイックカスタマイズ (Quick Adjustments)' : 'Quick Customization'}</span>
                    <span className="text-[10px] text-slate-500">{lang === 'jp' ? 'ワンタップ調整' : 'Single Tap'}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        key: 'Extra Syrup / Broth',
                        labelJp: '自家製シロップ・出汁多め (+Extra Syrup/Broth)',
                        labelEn: 'Extra Syrup / Broth (+¥80)',
                        priceDelta: 80,
                      },
                      {
                        key: 'No Toppings',
                        labelJp: 'トッピングなし (No Toppings)',
                        labelEn: 'No Toppings (Plain)',
                        priceDelta: 0,
                      },
                      {
                        key: 'Less Ice / Gentle Temp',
                        labelJp: '氷少なめ・ひかえめ (Less Ice / Soft Temp)',
                        labelEn: 'Less Ice / Soft Temp',
                        priceDelta: 0,
                      },
                      {
                        key: 'Extra Dango / Mochi',
                        labelJp: '手作り白玉・餅追加 (+Extra Dango/Mochi)',
                        labelEn: '+Extra Dango/Mochi (+¥120)',
                        priceDelta: 120,
                      },
                    ].map((quickOpt) => {
                      const isSelected = selectedCustomizations['Quick Note'] === quickOpt.labelEn;
                      return (
                        <motion.button
                          key={quickOpt.key}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => {
                            handleFeedback('tap', 'light');
                            setSelectedCustomizations((prev) => ({
                              ...prev,
                              'Quick Note': isSelected ? 'Standard' : quickOpt.labelEn,
                            }));
                          }}
                          className={`p-2.5 rounded-xl text-left transition-all border ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold ring-1 ring-amber-400/50 shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-[11px]">
                            {lang === 'jp' ? quickOpt.labelJp : quickOpt.labelEn}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => handleAddToCart(customizingItem, selectedCustomizations)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'jp' ? 'カスタマイズを確定して伝票に追加' : 'Confirm & Add to Order Ticket'}</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Japanese Mascot Overlay Companion */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block pointer-events-auto">
        <AoiBearMascot
          season={season}
          lang={lang}
          onAskRecommendation={onAskAiRecommendation}
          isFloatingOverlay={true}
        />
      </div>
    </div>
  );
};

