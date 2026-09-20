import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client lazily / securely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", node: "Dragon 9 - Tokyo Node", time: new Date().toISOString() });
});

// Translation API endpoint (Japanese to English)
app.post("/api/translate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Missing text to translate" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback translation if API key is not present
      return res.json({
        translatedText: `[En Translation] ${text.replace(/【.*?】/g, '').trim()} (Translated by Ice Plant AI)`,
        source: "fallback",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Translate the following Japanese text from Ice Plant's (@ice_plant_aoi) Instagram post into fluent, atmospheric English. Keep Japanese culinary terms like 'Kakigori', 'Oden', 'Dashi', 'Hanpen', 'Matcha', 'Uji' when appropriate, with a brief explanation if needed.

Japanese Text:
${text}`,
      config: {
        systemInstruction: "You are a professional bilingual translator for Ice Plant, Misaki's family artisanal shaved ice & oden shop in Tokyo. Provide a clean, engaging English translation.",
        temperature: 0.3,
      },
    });

    res.json({
      translatedText: response.text ? response.text.trim() : text,
      source: "gemini",
    });
  } catch (err: any) {
    console.error("Translation error:", err);
    res.status(500).json({ error: err.message || "Failed to translate" });
  }
});

// AI Menu & Pairing Recommendation API from Aoi Bear Mascot
app.post("/api/recommend", async (req, res) => {
  try {
    const { season, timeOfDay, mood, preferences } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      const fallbackRec = season === 'summer' ? {
        title: "Uji Matcha Kintoki & Cold Roasted Hojicha",
        japaneseTitle: "宇治抹茶金時 & 冷煎茶",
        message: "Hello! Shiro-kuma here! On a sunny Tokyo afternoon, my absolute favorite is our fluffy Uji Matcha shaved ice with handmade Hokkaido red bean paste and chewy shiratama dango!",
        pairing: "Cold Brewed Kyoto Hojicha Tea",
        recommendedItemId: "summer-1",
        mascotMood: "happy_shaving"
      } : {
        title: "Slow-Simmered Daikon & Hanpen with Hot Dashi",
        japaneseTitle: "特製出汁しみ大根 & はんぺん",
        message: "Konbanwa! Shiro-kuma bear greeting you warmly. The 12-hour dashi broth has soaked deep into the thick-cut Daikon. Pair it with fluffy hanpen and hot karashi mustard!",
        pairing: "Hot Genmaicha with Roasted Rice",
        recommendedItemId: "winter-1",
        mascotMood: "warm_oden"
      };
      return res.json(fallbackRec);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are Aoi Bear ("Shiro-kuma"), the cute animated polar bear mascot of Ice Plant (Misaki's family shop in Tokyo).
The customer is browsing during ${season.toUpperCase()} season at Dragon 9 time: ${timeOfDay || 'Midday'}.
User Mood: ${mood || 'Relaxing'}, Preferences: ${JSON.stringify(preferences || [])}.

Provide a personalized recommendation in JSON format with fields:
- title (string: English dish name)
- japaneseTitle (string: Japanese kanji/hiragana name)
- message (string: 2-3 sentences cute mascot recommendation in character)
- pairing (string: drink or side pairing)
- recommendedItemId (string: e.g. "summer-1" or "winter-1")
- mascotMood (string: "happy_shaving", "warm_oden", "zen_pause", "excited")`,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: err.message || "Failed to generate recommendation" });
  }
});

// ─── PRODUCTS (static menu) ───
app.get('/api/products', (_req, res) => {
  const products = [
    { id: '1', name: 'Tokyo Vanilla', nameJa: '東京バニラ', price: 6.50, category: 'scoop', available: true, imageUrl: '/src/assets/images/misaki_tokyo_vanilla_1785937613201.jpg', description: 'Madagascar bourbon, local cream' },
    { id: '2', name: 'Dragon Matcha', nameJa: 'ドラゴン抹茶', price: 7.00, category: 'scoop', available: true, imageUrl: '/src/assets/images/misaki_matcha_ice_1785937250364.jpg', description: 'Uji matcha, ceremonial grade' },
    { id: '3', name: 'Shavings Special', nameJa: 'シェービングスペシャル', price: 9.00, category: 'sundae', available: true, imageUrl: '/src/assets/images/misaki_strawberry_kakigori_1785937283910.jpg', description: '90/9/1 split, sovereign topping' },
    { id: '4', name: 'Aoi Blossom', nameJa: '葵ブロッサム', price: 7.50, category: 'seasonal', available: true, imageUrl: '/src/assets/images/misaki_shirokuma_bear_1785937667644.jpg', description: 'Cherry blossom & Shirokuma special' }
  ];
  res.json({ products, success: true });
});

// Serve static images directory
app.use('/src/assets', express.static(path.join(process.cwd(), 'src', 'assets')));

// Helper to generate town scraper posts for Ice Plant Aoi
function getIcePlantPosts(townName = 'Aoi') {
  return [
    {
      id: "ig-1",
      username: "ice_plant_aoi",
      mediaType: "IMAGE",
      mediaUrl: "/src/assets/images/misaki_matcha_ice_1785937250364.jpg",
      captionJp: "【極上宇治抹茶かき氷 🍧】Misaki特製の濃厚宇治抹茶シロップに、できたてモチモチの白玉と北海道産小豆を添えて。Dragon 9 12:00 Apex Pauseのクールダウンにぜひ！ #IcePlant #かき氷 #宇治抹茶 #美咲の店",
      captionEn: "【Ultimate Uji Matcha Kakigori 🍧】Misaki's signature rich Uji matcha syrup served with freshly handmade chewy shiratama dango and Hokkaido adzuki beans. Perfect cooldown during the Dragon 9 Midday Pause!",
      likes: 3420,
      commentsCount: 98,
      timestamp: new Date().toISOString(),
      location: `Ice Plant (Misaki's Shop), ${townName}, Tokyo`,
      tags: ["#SummerMenu", "#UjiMatcha", "#Dragon9Apex", "#TokyoEats"]
    },
    {
      id: "ig-2",
      username: "ice_plant_aoi",
      mediaType: "IMAGE",
      mediaUrl: "/src/assets/images/misaki_cafe_owner_1785937267797.jpg",
      captionJp: "【店主 Misaki より皆様へ 🌸】本日も葵(Aoi)町の氷植物(Ice Plant)へお越しいただきありがとうございます！特製マイクロスノー氷で皆様を心よりお待ちしております✨ #IcePlant #Misaki #葵町 #かき氷専門店",
      captionEn: "【Message from Owner Misaki 🌸】Thank you all for visiting Ice Plant in Aoi Town today! We're crafting micro-feather shaved ice with love. Can't wait to welcome you!",
      likes: 4210,
      commentsCount: 134,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      location: `Ice Plant Counter, ${townName}, Tokyo`,
      tags: ["#IcePlantMisaki", "#AoiTown", "#TokyoCrafts", "#KakigoriLove"]
    },
    {
      id: "ig-3",
      username: "ice_plant_aoi",
      mediaType: "IMAGE",
      mediaUrl: "/src/assets/images/misaki_strawberry_kakigori_1785937283910.jpg",
      captionJp: "【あまおう苺ミルフィーユかき氷 🍓】とちおとめ＆あまおうを贅沢につぶした自家製コンフィチュールと練乳ダブルがけ！中にサクサクのパイ生地が隠れています。 #IcePlant #苺かき氷 #あまおう #東京スイーツ",
      captionEn: "【Amaou Strawberry Mille-Feuille Kakigori 🍓】House-made confiture from ripe Amaou strawberries with double condensed milk drizzle! Crispy pastry layers hidden inside.",
      likes: 5180,
      commentsCount: 210,
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      location: `Ice Plant Studio, ${townName}, Tokyo`,
      tags: ["#StrawberryKakigori", "#AmaouBerry", "#IcePlantSpecial", "#TokyoNode"]
    },
    {
      id: "ig-4",
      username: "ice_plant_aoi",
      mediaType: "IMAGE",
      mediaUrl: "/src/assets/images/misaki_oden_pot_1785937633762.jpg",
      captionJp: "【冬の暖簾 🍢】12時間じっくり煮込んだ特製出汁のおでん。味が染み込んだ大根と、ふわふわのはんぺんが自慢です。寒い夜は熱々の出汁で温まりませんか？ #IcePlant #おでん #出汁大根 #Dragon9冬プロトコル",
      captionEn: "【Winter Noren 🍢】Oden simmered in 12-hour golden dashi broth. Featuring deeply seasoned Daikon radish and cloud-soft Hanpen. Warm up your winter evening with our steaming broth!",
      likes: 1892,
      commentsCount: 67,
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      location: `Ice Plant, ${townName} Tokyo Node`,
      tags: ["#WinterProtocol", "#Oden", "#DashiComfort", `#${townName}Tokyo`]
    },
    {
      id: "ig-5",
      username: "ice_plant_aoi",
      mediaType: "IMAGE",
      mediaUrl: "/src/assets/images/misaki_zen_parfait_1785937649974.jpg",
      captionJp: "【Dragon 9 Apex Pause ✨】本日12:00の18分間マインドフルネス・エイペックス・ポーズ。店内は静寂の照明に切り替わり、限定の「禅抹茶パフェ」をご提供中。 #Dragon9 #エイペックスポーズ #禅パフェ #東京ノード13時間目",
      captionEn: "【Dragon 9 Apex Pause ✨】Today's 18-minute midday Zen Pause at 12:00. Ambient lighting softens, and our limited 'Zen Matcha Parfait' is currently served.",
      likes: 2105,
      commentsCount: 89,
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
      location: `Ice Plant Tokyo Node Engine (${townName})`,
      tags: ["#ZenPause", "#Dragon9Time", "#AtmosphericTokyo", "#13thHourWedge"]
    },
    {
      id: "ig-6",
      username: "ice_plant_aoi",
      mediaType: "IMAGE",
      mediaUrl: "/src/assets/images/misaki_shirokuma_bear_1785937667644.jpg",
      captionJp: "【あおい熊マスコット 🐻❄️】しろくま葵ちゃんが夏の看板に衣替え！特製の和風シロップと極細マイクロフリース氷で真夏も快適です。タブレットタッチ端末でカスタマイズ注文可能！ #IcePlant #あおい熊 #タブレットオーダー",
      captionEn: "【Aoi Bear Mascot 🐻❄️】Shiro-kuma Aoi-chan is ready with her summer ice shaving outfit! Micro-feather ice shavings with artisanal syrup. Order & customize on our tablet touch kiosk!",
      likes: 1540,
      commentsCount: 51,
      timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
      location: `Ice Plant Counter & Tablet Kiosk (${townName})`,
      tags: ["#AoiBear", "#ShiroKuma", "#TabletOrder", "#CraftIce"]
    }
  ];
}

// In-memory store for custom scraped posts
let userScrapedPosts: any[] = [];

// ─── ICE PLANT TOWN SCRAPER ROUTES ───
app.get('/api/iceplant', (req, res) => {
  const town = (req.query.town as string) || 'Aoi';
  const defaultPosts = getIcePlantPosts(town);
  res.json({ town, posts: [...userScrapedPosts, ...defaultPosts], success: true });
});

app.get('/api/iceplant/:town', (req, res) => {
  const town = req.params.town || 'Aoi';
  const defaultPosts = getIcePlantPosts(town);
  res.json({ town, posts: [...userScrapedPosts, ...defaultPosts], success: true });
});

// Live Scraper / Post Generator API Endpoint
app.post('/api/iceplant/scrape', async (req, res) => {
  try {
    const { target, mediaUrl, caption, location } = req.body;
    const ai = getGeminiClient();

    let newPost: any = null;

    if (ai && target) {
      const prompt = `Generate a realistic Instagram post entry scraped from target "${target}".
Return JSON object:
{
  "captionJp": "Japanese caption with emojis and hashtags related to Ice Plant, Misaki, Kakigori shaved ice or Japanese treats in ${target}",
  "captionEn": "English translation of caption",
  "location": "Location description based on ${target}",
  "tags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}`;

      const aiRes = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const parsed = JSON.parse(aiRes.text || "{}");

      newPost = {
        id: "scraped-" + Date.now(),
        username: target.startsWith("@") ? target.slice(1) : (target.includes("instagram.com") ? "instagram_scraped" : target),
        mediaType: "IMAGE",
        mediaUrl: mediaUrl || "/src/assets/images/misaki_matcha_ice_1785937250364.jpg",
        captionJp: parsed.captionJp || caption || `【Scraped from ${target}】美咲の氷植物 特製メニュー✨`,
        captionEn: parsed.captionEn || `【Scraped from ${target}】Misaki's Ice Plant Seasonal Special ✨`,
        likes: Math.floor(Math.random() * 2000) + 500,
        commentsCount: Math.floor(Math.random() * 80) + 12,
        timestamp: new Date().toISOString(),
        location: parsed.location || location || `Ice Plant Node (${target})`,
        tags: parsed.tags || ["#ScrapedPost", "#IcePlant", "#TokyoKakigori"]
      };
    } else {
      newPost = {
        id: "scraped-" + Date.now(),
        username: target ? target.replace("@", "") : "ice_plant_aoi",
        mediaType: "IMAGE",
        mediaUrl: mediaUrl || "/src/assets/images/misaki_matcha_ice_1785937250364.jpg",
        captionJp: caption || `【Scraped IG Post】${target || 'Ice Plant Aoi'} 葵町の季節限定かき氷 & 和菓子メニュー。`,
        captionEn: `【Scraped IG Post】${target || 'Ice Plant Aoi'} Seasonal shaved ice & Japanese treats in Aoi Town.`,
        likes: 1250,
        commentsCount: 38,
        timestamp: new Date().toISOString(),
        location: location || `Ice Plant, ${target || 'Aoi'}, Tokyo`,
        tags: ["#ScrapedFeed", "#MisakiShop", "#AoiKakigori"]
      };
    }

    userScrapedPosts.unshift(newPost);
    res.json({ success: true, post: newPost, posts: [...userScrapedPosts, ...getIcePlantPosts()] });
  } catch (err: any) {
    console.error("Scrape error:", err);
    res.status(500).json({ error: "Failed to scrape Instagram post" });
  }
});

// ─── ORDER RECEIPT ───
app.post('/api/orders', (req, res) => {
  console.log('🍦 ORDER RECEIVED:', JSON.stringify(req.body, null, 2));
  res.json({ success: true, orderId: 'd9-' + Date.now(), order: req.body });
});

// ─── INSTAGRAM FEED API (@ice_plant_aoi) ───
app.get("/api/instagram", (req, res) => {
  const town = (req.query.town as string) || 'Aoi';
  const posts = [...userScrapedPosts, ...getIcePlantPosts(town)];
  res.json({ posts, handle: "@ice_plant_aoi", town, title: "Ice Plant Official Feed", success: true });
});

// Vite / Static file handling
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Ice Plant × Dragon 9] Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
