import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InstagramPost, Language } from '../types';
import { Instagram, Heart, MessageCircle, Share2, Sparkles, Languages, ExternalLink, MapPin, X, Plus, Link, RefreshCw, Search } from 'lucide-react';

interface Props {
  lang: Language;
}

export const InstagramFeed: React.FC<Props> = ({ lang }) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [targetInput, setTargetInput] = useState<string>('@ice_plant_aoi');
  const [scraping, setScraping] = useState<boolean>(false);
  const [scrapeSuccess, setScrapeSuccess] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [translatingPostId, setTranslatingPostId] = useState<string | null>(null);
  const [translatedCaptions, setTranslatedCaptions] = useState<{ [postId: string]: string }>({});

  // Add post modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [customCaption, setCustomCaption] = useState<string>('');
  const [customHandle, setCustomHandle] = useState<string>('ice_plant_aoi');

  const fetchPosts = async (townName = 'Aoi') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/iceplant?town=${encodeURIComponent(townName)}`);
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch scraped town posts:', err);
    } finally {
      setLoading(false);
      setScraping(false);
    }
  };

  useEffect(() => {
    fetchPosts('Aoi');
  }, []);

  const handleScrapeTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInput.trim()) return;

    setScraping(true);
    setScrapeSuccess(null);

    try {
      const res = await fetch('/api/iceplant/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: targetInput,
        }),
      });

      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
        setScrapeSuccess(`Scraped new media from ${targetInput}!`);
        setTimeout(() => setScrapeSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Failed to scrape target:', err);
    } finally {
      setScraping(false);
    }
  };

  const handleAddCustomPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) return;

    setScraping(true);
    try {
      const res = await fetch('/api/iceplant/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: customHandle || 'ice_plant_aoi',
          mediaUrl: customPhotoUrl,
          caption: customCaption,
        }),
      });

      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
        setShowAddModal(false);
        setCustomPhotoUrl('');
        setCustomCaption('');
        setScrapeSuccess('Added new Instagram photo!');
        setTimeout(() => setScrapeSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Failed to add custom post:', err);
    } finally {
      setScraping(false);
    }
  };

  const handleTranslateWithGemini = async (post: InstagramPost) => {
    setTranslatingPostId(post.id);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: post.captionJp }),
      });
      const data = await res.json();
      if (data.translatedText) {
        setTranslatedCaptions((prev) => ({
          ...prev,
          [post.id]: data.translatedText,
        }));
      }
    } catch (err) {
      console.error('Gemini translate error:', err);
    } finally {
      setTranslatingPostId(null);
    }
  };

  return (
    <section id="instagram-feed-section" className="relative w-full max-w-7xl mx-auto my-12 px-4 scroll-mt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
              <Instagram className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-100 font-sans">@ice_plant_aoi</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 text-[11px] font-bold border border-rose-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Official Store Feed
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'jp' ? 'Misaki(美咲)の氷植物 季節のお便り & 最新投稿' : "Misaki's Ice Plant Seasonal News & Daily Instagram Posts"}
            </p>
          </div>
        </div>

        {/* Official Instagram Action & Subtle Admin Trigger */}
        <div className="flex items-center gap-2">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-rose-500 via-amber-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            <span>{lang === 'jp' ? 'Instagramでフォロー' : 'Follow @ice_plant_aoi'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Subtle Add Photo Button for Store Management */}
          <button
            onClick={() => setShowAddModal(true)}
            title="Store Admin: Add Photo"
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-300 text-xs rounded-2xl transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrape Toast Notification */}
      <AnimatePresence>
        {scrapeSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-semibold">{scrapeSuccess}</span>
            </div>
            <button onClick={() => setScrapeSuccess(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs font-mono animate-pulse flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-rose-400 animate-spin" />
          <span>Fetching Misaki's @ice_plant_aoi Instagram photos pipeline...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {posts.map((post) => {
            const translated = translatedCaptions[post.id];
            return (
              <motion.div
                key={post.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedPost(post)}
                className="group bg-slate-900/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl hover:border-rose-500/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative w-full h-60 overflow-hidden bg-slate-950">
                  <img
                    src={post.mediaUrl}
                    alt={post.id}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-bold text-rose-300 flex items-center gap-1">
                    <Instagram className="w-3 h-3 text-rose-400" />
                    <span>@{post.username || 'ice_plant_aoi'}</span>
                  </div>

                  {/* Overlay Stats */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-cyan-400" />
                      {post.commentsCount}
                    </span>
                  </div>
                </div>

                {/* Caption Snippet & Translation */}
                <div className="p-4 space-y-2.5 text-xs flex-1 flex flex-col justify-between bg-slate-900/60">
                  <div className="space-y-1.5">
                    <p className="text-slate-200 line-clamp-2 font-sans leading-relaxed">{post.captionJp}</p>

                    {/* Dual Lang English */}
                    <p className="text-slate-400 line-clamp-2 text-[11px] font-sans border-l-2 border-rose-500/50 pl-2 italic">
                      {translated || post.captionEn}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {post.location ? post.location.split(',')[0] : 'Ice Plant, Aoi'}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTranslateWithGemini(post);
                      }}
                      className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>
                        {translatingPostId === post.id
                          ? 'Translating...'
                          : lang === 'jp' ? 'AI 英訳' : 'AI Translate'}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal: Add / Scrape Custom Instagram Photo */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-slate-100">Add Instagram Scraped Photo</h3>
              </div>

              <form onSubmit={handleAddCustomPhoto} className="space-y-3">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Instagram Handle</label>
                  <input
                    type="text"
                    value={customHandle}
                    onChange={(e) => setCustomHandle(e.target.value)}
                    placeholder="ice_plant_aoi"
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Photo Image URL</label>
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    required
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                {/* Quick Preset Photos */}
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Quick Select Photo Sample:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomPhotoUrl('/src/assets/images/misaki_matcha_ice_1785937250364.jpg')}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 text-[10px] text-slate-300 text-center truncate"
                    >
                      Matcha Ice
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomPhotoUrl('/src/assets/images/misaki_cafe_owner_1785937267797.jpg')}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 text-[10px] text-slate-300 text-center truncate"
                    >
                      Misaki Shop
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomPhotoUrl('/src/assets/images/misaki_strawberry_kakigori_1785937283910.jpg')}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 text-[10px] text-slate-300 text-center truncate"
                    >
                      Strawberry Ice
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Caption / Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={customCaption}
                    onChange={(e) => setCustomCaption(e.target.value)}
                    placeholder="【季節の特製かき氷 🍧】..."
                    className="w-full bg-slate-950 text-slate-100 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-rose-500/50"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-950 text-slate-400 rounded-xl hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-bold text-white rounded-xl shadow-md"
                  >
                    Add Post
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Expanded Post Full View Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 max-h-[85vh]"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-64 md:h-full bg-slate-950">
                <img
                  src={selectedPost.mediaUrl}
                  alt={selectedPost.id}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4 text-xs overflow-y-auto">
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-[2px]">
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-rose-400">
                      IP
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-sm">@{selectedPost.username || 'ice_plant_aoi'}</div>
                    <div className="text-[10px] text-slate-400">{selectedPost.location}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-200">
                    <div className="font-bold text-amber-300 text-[10px] mb-1">【日本語原文】</div>
                    <p className="leading-relaxed font-sans">{selectedPost.captionJp}</p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300">
                    <div className="font-bold text-cyan-300 text-[10px] mb-1">【English Translation】</div>
                    <p className="leading-relaxed font-sans">{translatedCaptions[selectedPost.id] || selectedPost.captionEn}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <Heart className="w-4 h-4 fill-rose-500" />
                    {selectedPost.likes} likes
                  </span>
                  <span>{new Date(selectedPost.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
