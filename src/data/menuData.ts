import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // ================= SUMMER PROTOCOL: Kakigori Shaved Ice & Sundaes =================
  {
    id: 'summer-1',
    nameJp: '宇治抹茶金時かき氷',
    nameEn: 'Uji Matcha Kintoki Shaved Ice',
    descriptionJp: '京都宇治の特選一番茶抹茶シロップ、北海道産大納言小豆、もちもち手作り白玉、練乳を層状に重ねた至高の生氷。',
    descriptionEn: 'Premium first-harvest Uji matcha syrup layered over micro-feather snow ice, served with Hokkaido Tokachi red beans, soft house-made shiratama dango & condensed milk.',
    priceJpy: 1380,
    category: 'kakigori',
    season: 'summer',
    imageUrl: '/src/assets/images/misaki_matcha_ice_1785937250364.jpg',
    isSignature: true,
    calories: 340,
    tags: ['Signature', 'Uji Matcha', 'House Favorite', 'Bilingual Classic'],
    customizeOptions: [
      {
        nameJp: '氷の質 (Ice Density)',
        nameEn: 'Ice Texture',
        choices: [
          { labelJp: '極細ふわふわスノー (Feather Snow)', labelEn: 'Feather Snow (Ultra Fluffy)', default: true },
          { labelJp: 'クラシック削り (Classic Shave)', labelEn: 'Classic Shave (Crisp)' },
        ],
      },
      {
        nameJp: '甘さ (Sweetness Level)',
        nameEn: 'Sweetness Level',
        choices: [
          { labelJp: '100% 標準 (Standard)', labelEn: '100% Standard', default: true },
          { labelJp: '70% ひかえめ (Less Sweet)', labelEn: '70% Less Sweet' },
          { labelJp: '50% 抹茶濃厚 (Extra Bittersweet)', labelEn: '50% Extra Bittersweet' },
        ],
      },
      {
        nameJp: 'トッピング追加 (Extra Toppings)',
        nameEn: 'Toppings',
        choices: [
          { labelJp: '白玉3個追加 (+3 Shiratama)', labelEn: '+3 Shiratama Dango', priceDeltaJpy: 150 },
          { labelJp: '自家製練乳 (+Condensed Milk)', labelEn: '+Extra Condensed Milk', priceDeltaJpy: 100 },
          { labelJp: 'バニラアイス乗せ (+Vanilla Gelato)', labelEn: '+Vanilla Gelato Scoop', priceDeltaJpy: 220 },
        ],
      },
    ],
  },
  {
    id: 'summer-2',
    nameJp: 'あまおう苺エスプーマ氷',
    nameEn: 'Amaou Strawberry Espuma Cloud Ice',
    descriptionJp: '福岡県産あまおう苺を贅沢に使用した自家製コンフィチュールと、軽やかな練乳エスプーマフォームの二重奏。',
    descriptionEn: 'Fresh Fukuoka Amaou strawberry jam made in-house, topped with light condensed milk espuma foam, freeze-dried strawberry dust & vanilla bean essence.',
    priceJpy: 1450,
    category: 'kakigori',
    season: 'summer',
    imageUrl: '/src/assets/images/misaki_strawberry_kakigori_1785937283910.jpg',
    isSignature: true,
    calories: 310,
    tags: ['Amaou Strawberry', 'Espuma Cloud', 'Summer Best Seller'],
    customizeOptions: [
      {
        nameJp: '練乳エスプーマ (Espuma Foam)',
        nameEn: 'Espuma Foam',
        choices: [
          { labelJp: '標準たっぷり (Standard Cloud)', labelEn: 'Standard Cloud', default: true },
          { labelJp: 'Wダブルフォーム (+Double Foam)', labelEn: '+Double Foam Cream', priceDeltaJpy: 180 },
        ],
      },
      {
        nameJp: '甘さ (Sweetness Level)',
        nameEn: 'Sweetness Level',
        choices: [
          { labelJp: '100% 標準', labelEn: '100% Standard', default: true },
          { labelJp: '70% 苺本来の酸味', labelEn: '70% Fruity Tart' },
        ],
      },
    ],
  },
  {
    id: 'summer-3',
    nameJp: '宮崎マンゴーココナッツサンデー',
    nameEn: 'Miyazaki Mango & Coconut Sundae',
    descriptionJp: '完熟マンゴーの果肉と果汁、有機ココナッツアイス、アロエベラゼリーと特製クラッシュ氷のアジアンサンデー。',
    descriptionEn: 'Ripe Miyazaki mango chunks & syrup served with organic coconut gelato, aloe vera jelly pearls, and delicate crushed crystalline snow.',
    priceJpy: 1280,
    category: 'sundae',
    season: 'summer',
    imageUrl: '/src/assets/images/misaki_shirokuma_bear_1785937667644.jpg',
    calories: 280,
    tags: ['Miyazaki Mango', 'Tropical Sundae', 'Refreshing'],
    customizeOptions: [
      {
        nameJp: 'ジェラート変更 (Gelato Option)',
        nameEn: 'Gelato Flavor',
        choices: [
          { labelJp: '有機ココナッツ (Organic Coconut)', labelEn: 'Organic Coconut Gelato', default: true },
          { labelJp: '宇治抹茶アイス (+Uji Matcha Gelato)', labelEn: 'Uji Matcha Gelato', priceDeltaJpy: 80 },
        ],
      },
      {
        nameJp: 'シロップ・トッピング (Syrup & Topping)',
        nameEn: 'Syrup & Toppings',
        choices: [
          { labelJp: '標準マンゴーシロップ (Standard Syrup)', labelEn: 'Standard Mango Syrup', default: true },
          { labelJp: 'マンゴーシロップ多め (+Extra Mango Syrup)', labelEn: '+Extra Mango Syrup', priceDeltaJpy: 100 },
          { labelJp: 'トッピング全抜き (No Toppings / Plain)', labelEn: 'No Toppings (Plain Gelato & Ice)' },
        ],
      },
    ],
  },
  {
    id: 'summer-4',
    nameJp: 'ブルーハワイ塩ラムネ氷',
    nameEn: 'Blue Hawaii Sea-Salt Ramune Ice',
    descriptionJp: '谷中名物のラムネ味シロップに沖縄産ぬちまーす海塩を隠し味に効かせた、爽快感溢れる青い夏のグラデーション氷。',
    descriptionEn: 'Fruity Yanaka-style Ramune soda syrup balanced with Okinawan sea salt, popping candy pearls, and a slice of dried candied lime.',
    priceJpy: 1100,
    category: 'kakigori',
    season: 'summer',
    imageUrl: '/src/assets/images/misaki_tokyo_vanilla_1785937613201.jpg',
    calories: 210,
    tags: ['Retro Ramune', 'Sea Salt', 'Yanaka Special'],
    customizeOptions: [
      {
        nameJp: 'パチパチキャンディ (Popping Candy)',
        nameEn: 'Popping Candy',
        choices: [
          { labelJp: '標準乗せ (Standard Popping Candy)', labelEn: 'Standard Popping Candy', default: true },
          { labelJp: 'パチパチW増量 (+Extra Popping Candy)', labelEn: '+Extra Popping Candy', priceDeltaJpy: 80 },
          { labelJp: 'キャンディ抜き (No Popping Candy)', labelEn: 'No Popping Candy' },
        ],
      },
      {
        nameJp: 'シロップ量 (Syrup Volume)',
        nameEn: 'Syrup Adjust',
        choices: [
          { labelJp: '標準 (Standard Ramune Syrup)', labelEn: 'Standard Ramune Syrup', default: true },
          { labelJp: '追いラムネシロップ (+Extra Syrup)', labelEn: '+Extra Ramune Syrup', priceDeltaJpy: 100 },
          { labelJp: 'シロップ控えめ (Less Syrup)', labelEn: 'Less Syrup' },
        ],
      },
    ],
  },
  {
    id: 'summer-5',
    nameJp: '焙じ茶ラテ & 冷やし黒蜜だんご',
    nameEn: 'Cold Roasted Hojicha Latte & Kuromitsu Dango',
    descriptionJp: '香ばしい炭火焙煎ほうじ茶の冷製ラテと、沖縄黒糖密を絡めたひんやり焼き団子のセット。',
    descriptionEn: 'Charcoal-roasted Kyoto hojicha cold brew latte served alongside chilled grilled rice dango skewers glazed in rich Okinawan black sugar syrup.',
    priceJpy: 950,
    category: 'drink',
    season: 'summer',
    imageUrl: '/src/assets/images/misaki_zen_parfait_1785937649974.jpg',
    calories: 250,
    tags: ['Kyoto Tea', 'Cold Brew', 'Yanaka Snack'],
    customizeOptions: [
      {
        nameJp: 'ミルクの種類 (Milk Base)',
        nameEn: 'Milk Base',
        choices: [
          { labelJp: '濃厚北海道牛乳 (Hokkaido Whole Milk)', labelEn: 'Hokkaido Whole Milk', default: true },
          { labelJp: '有機オーツミルク (+Oat Milk)', labelEn: 'Organic Oat Milk', priceDeltaJpy: 100 },
        ],
      },
      {
        nameJp: '団子の黒蜜 (Kuromitsu Syrup)',
        nameEn: 'Kuromitsu Glaze',
        choices: [
          { labelJp: '標準黒蜜 (Standard Kuromitsu)', labelEn: 'Standard Kuromitsu', default: true },
          { labelJp: '追い黒蜜 (+Extra Black Sugar Syrup)', labelEn: '+Extra Black Sugar Syrup', priceDeltaJpy: 80 },
          { labelJp: '蜜なし (No Syrup / Plain Dango)', labelEn: 'No Syrup (Plain Dango)' },
        ],
      },
    ],
  },

  // ================= WINTER PROTOCOL: Hot Simmered Oden & Dashi Comfort =================
  {
    id: 'winter-1',
    nameJp: '黄金出汁しみしみ大根',
    nameEn: '12-Hour Dashi-Soaked Daikon Radish',
    descriptionJp: '利尻昆布と焼津産鰹節から取った12時間仕込みの黄金出汁。芯まで味が染み渡った厚切り大根。',
    descriptionEn: 'Thickly sliced Japanese Daikon radish simmered for 12 hours in clear golden dashi brewed from Rishiri kelp and Yaizu skipjack tuna flakes.',
    priceJpy: 380,
    category: 'oden',
    season: 'winter',
    imageUrl: '/src/assets/images/misaki_oden_pot_1785937633762.jpg',
    isSignature: true,
    calories: 65,
    tags: ['Oden Star', '12-Hr Dashi', 'Gluten Free', 'Misaki Recipe'],
    customizeOptions: [
      {
        nameJp: '出汁の温かさ (Broth Temp)',
        nameEn: 'Broth Temp',
        choices: [
          { labelJp: '熱々 (Atsu-atsu Hot)', labelEn: 'Steaming Hot', default: true },
          { labelJp: '適温 (Medium Warm)', labelEn: 'Comfort Warm' },
        ],
      },
      {
        nameJp: '薬味・トッピング (Condiments)',
        nameEn: 'Condiments',
        choices: [
          { labelJp: '京都産和からし (Kyoto Karashi)', labelEn: 'Kyoto Yellow Mustard', default: true },
          { labelJp: '柚子胡椒 (Yuzu Kosho Pepper)', labelEn: 'Green Yuzu Kosho' },
          { labelJp: '自家製甘味噌 (House Sweet Miso)', labelEn: 'House Sweet Miso Paste' },
          { labelJp: '薬味なし (No Condiments)', labelEn: 'No Condiments' },
        ],
      },
      {
        nameJp: '出汁スープ量 (Extra Dashi)',
        nameEn: 'Extra Broth',
        choices: [
          { labelJp: '標準カップ (Standard Broth)', labelEn: 'Standard Broth', default: true },
          { labelJp: '追い出汁増量 (+Extra Dashi Broth)', labelEn: '+Extra Dashi Broth', priceDeltaJpy: 80 },
        ],
      },
    ],
  },
  {
    id: 'winter-2',
    nameJp: '黒豚バラ肉と餅巾着のおでん',
    nameEn: 'Kurobuta Pork Belly & Mochi Kinchaku Pouch',
    descriptionJp: '鹿児島県産黒豚バラ肉の柔らか煮と、ふっくら油揚げの中に魚沼産コシヒカリ餅を詰めた満足感の高い一品。',
    descriptionEn: 'Tender Kagoshima Kurobuta pork belly paired with a fried tofu pouch tied with dried gourd string and stuffed with chewy Uonuma koshihikari mochi.',
    priceJpy: 580,
    category: 'oden',
    season: 'winter',
    imageUrl: '/src/assets/images/misaki_oden_pot_1785937633762.jpg',
    isSignature: true,
    calories: 290,
    tags: ['Kurobuta Pork', 'Mochi Pouch', 'Comfort Dish'],
    customizeOptions: [
      {
        nameJp: '追加トッピング (Extra Toppings)',
        nameEn: 'Extra Toppings',
        choices: [
          { labelJp: '標準セット (Standard)', labelEn: 'Standard Portion', default: true },
          { labelJp: '黒豚肉1個追加 (+Extra Kurobuta Pork)', labelEn: '+Extra Pork Piece', priceDeltaJpy: 220 },
          { labelJp: '餅巾着1個追加 (+Extra Mochi Pouch)', labelEn: '+Extra Mochi Pouch', priceDeltaJpy: 180 },
          { labelJp: '薬味なし (No Condiments)', labelEn: 'No Condiments' },
        ],
      },
    ],
  },
  {
    id: 'winter-3',
    nameJp: '手押しはんぺん & 半熟味付け玉子',
    nameEn: 'Hand-Pressed Hanpen Cloud & Soft-Boiled Soy Egg',
    descriptionJp: 'ふわふわ極上の口溶け手押しはんぺんと、黄金出汁に一晩漬け込んだとろり半熟味玉。',
    descriptionEn: 'Cloud-soft white fish cake hanpen made by hand, alongside a soft-boiled egg marinated overnight in savory soy dashi broth.',
    priceJpy: 450,
    category: 'oden',
    season: 'winter',
    imageUrl: '/src/assets/images/misaki_oden_pot_1785937633762.jpg',
    calories: 180,
    tags: ['Hanpen Cloud', 'Soft Soy Egg', 'Traditional'],
    customizeOptions: [
      {
        nameJp: '味玉の固さ (Soy Egg Style)',
        nameEn: 'Egg Style',
        choices: [
          { labelJp: 'とろり半熟 (Soft-Boiled Runny Yolk)', labelEn: 'Soft-Boiled Runny', default: true },
          { labelJp: '固ゆで (Hard-Boiled)', labelEn: 'Hard-Boiled' },
        ],
      },
      {
        nameJp: '九条ネギ (Green Onion)',
        nameEn: 'Kyoto Green Onion',
        choices: [
          { labelJp: '標準乗せ (Standard Green Onion)', labelEn: 'Standard Green Onion', default: true },
          { labelJp: 'ネギ増量 (+Extra Green Onion)', labelEn: '+Extra Green Onion', priceDeltaJpy: 50 },
          { labelJp: 'ネギ抜き (No Green Onion)', labelEn: 'No Green Onion' },
        ],
      },
    ],
  },
  {
    id: 'winter-4',
    nameJp: '氷植物 おでん5種盛り合わせ',
    nameEn: 'Ice Plant 5-Piece Master Oden Sampler',
    descriptionJp: '大根、黒豚角煮、餅巾着、はんぺん、結びこんにゃくの人気5種を特製九条ネギと出汁スープで。',
    descriptionEn: 'Curated tasting plate featuring Daikon, Kurobuta Pork, Mochi Pouch, Fluffy Hanpen & Konjac knot, topped with fresh Kyoto Kujo green onions & extra broth.',
    priceJpy: 1680,
    category: 'oden',
    season: 'winter',
    imageUrl: '/src/assets/images/misaki_oden_pot_1785937633762.jpg',
    isSignature: true,
    calories: 520,
    tags: ['5-Piece Sampler', 'Best Value', 'Chef Recommendation'],
    customizeOptions: [
      {
        nameJp: '薬味盛り合わせ (Condiments Platter)',
        nameEn: 'Condiment Trio',
        choices: [
          { labelJp: '和からし & 柚子胡椒 (Mustard & Yuzu Kosho)', labelEn: 'Mustard & Yuzu Kosho', default: true },
          { labelJp: '甘味噌追加 (+Sweet Miso)', labelEn: '+Sweet Miso', priceDeltaJpy: 60 },
          { labelJp: '薬味一切なし (No Mustard/Pepper)', labelEn: 'No Mustard/Pepper' },
        ],
      },
      {
        nameJp: '九条ネギ (Green Onion)',
        nameEn: 'Green Onion',
        choices: [
          { labelJp: 'たっぷり乗せ (Generous Green Onion)', labelEn: 'Generous Green Onion', default: true },
          { labelJp: 'ネギ抜き (No Green Onion)', labelEn: 'No Green Onion' },
        ],
      },
    ],
  },
  {
    id: 'winter-5',
    nameJp: '特製出汁茶漬け (紀州南高梅/鮭)',
    nameEn: 'Artisanal Dashi Chazuke (Kishu Ume or Salmon)',
    descriptionJp: '熱々の特製おでん出汁を炊き立てコシヒカリに注ぎ、紀州南高梅または炙り鮭と刻み海苔を添えた〆の一杯。',
    descriptionEn: 'Steaming hot oden dashi poured over freshly cooked rice, crowned with Kishu Nanko Ume plum or seared wild salmon, shredded nori & toasted sesame.',
    priceJpy: 880,
    category: 'side',
    season: 'winter',
    imageUrl: '/src/assets/images/misaki_zen_parfait_1785937649974.jpg',
    calories: 310,
    tags: ['Dashi Rice', 'Warm Soul Food', 'Late Night'],
    customizeOptions: [
      {
        nameJp: 'メイン具材 (Main Protein)',
        nameEn: 'Main Flavor',
        choices: [
          { labelJp: '紀州南高梅 (Kishu Ume Plum)', labelEn: 'Kishu Nanko Ume Plum', default: true },
          { labelJp: '炙り銀鮭 (Seared Salmon)', labelEn: 'Seared Wild Salmon', priceDeltaJpy: 100 },
        ],
      },
    ],
  },
];
