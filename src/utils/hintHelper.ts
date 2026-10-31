import { WordItem, Language } from '../types/game';

// Custom curated short punchy hints (2-4 words) for key concepts
const SHORT_HINTS_BN: Record<string, string> = {
  'কাচ্চি বিরিয়ানি': 'উৎসবের খাসির খাবার',
  'ফুচকা': 'টক-ঝাল পথখাবার',
  'ইলিশ পোলাও': 'মাছ ও চালের রান্না',
  'মিষ্টি দই': 'বগুড়ার মিষ্টি ডেজার্ট',
  'বাকরখানি': 'মুচমুচে লালচে রুটি',
  'রসগোল্লা': 'রসে ডোবানো মিষ্টি',
  'পিৎজা': 'চিজি ইতালীয় স্লাইস',
  'বার্গার': 'বান ও মাংসের প্যাটি',
  'ঝালমুড়ি': 'সরিষার তেলের নাশতা',
  'হালিম': 'ঘন ডাল ও মাংসের স্যুপ',
  'সিঙাড়া': 'ত্রিকোণ আলুর পুরভাজা',
  'চটপটি': 'তেঁতুলের টক ও ডিম',
  'কালা ভুনা': 'চট্টগ্রামের কড়া মাংস',
  'বোরহানি': 'দই ও পুদিনার পানীয়',
  'রসমালাই': 'ঘন ক্ষীরের মিষ্টি',
  'বঙ্গবন্ধু শেখ মুজিবুর রহমান': 'স্বাধীনতার মহান নেতা',
  'কাজী নজরুল ইসলাম': 'বিদ্রোহী জাতীয় কবি',
  'রবীন্দ্রনাথ ঠাকুর': 'গীতাঞ্জলির বিশ্বকবি',
  'হুমায়ূন আহমেদ': 'হিমুর নন্দিত লেখক',
  'ড. মুহাম্মদ ইউনূস': 'নোবেলজয়ী ক্ষুদ্রঋণ জনক',
  'মাশরাফি বিন মর্তুজা': 'নড়াইল এক্সপ্রেস অধিনায়ক',
  'সাকিব আল হাসান': 'বিশ্বসেরা অলরাউন্ডার',
  'লিওনেল মেসি': '১০ নম্বর বিশ্বকাপজয়ী জাদুকর',
  'ক্রিশ্চিয়ানো রোনালদো': 'CR7 পর্তুগিজ গোলমেশিন',
  'স্টিভ জবস': 'আইফোনের স্বপ্নদ্রষ্টা',
  'অ্যালবার্ট আইনস্টাইন': 'আপেক্ষিকতার বিজ্ঞানী',
  'স্মার্টফোন': 'পকেটের টাচস্ক্রিন ফোন',
  'রিকশা': 'তিন চাকার রঙিন যান',
  'লুঙ্গি': 'কোমরে বাঁধা সুতি পোশাক',
  'হারিকেন': 'কাঁচের চিমনি বাতি',
  'ছাতা': 'বৃষ্টি ও রোদের ছাদ',
  'ল্যাপটপ': 'বহনযোগ্য কম্পিউটার',
  'চশমা': 'দৃষ্টিশক্তির কাঁচের ফ্রেম',
  'হাতঘড়ি': 'কবজির সময় দেখার কাঁটা',
  'কলম': 'কাগজে লেখার কালি কাঠি',
  'ক্যামেরা': 'ছবি তোলার লেন্স',
  'পদ্মা সেতু (মডেল/স্মারক)': 'প্রমত্তা নদীর মেগা সেতু',
  'রয়েল বেঙ্গল টাইগার': 'সুন্দরবনের ডোরাকাটা বাঘ',
  'দোয়েল': 'জাতীয় মিষ্টি সুরের পাখি',
  'ইলিশ মাছ': 'রূপালী জাতীয় মাছ',
  'হাতি': 'লম্বা শুঁড়ওয়ালা বিশালাকার প্রাণী',
  'সিংহ': 'কেশরওয়ালা বনের রাজা',
  'চিত্রা হরিণ': 'সাদা ফোঁটা সুন্দর হরিণ',
  'কুমির': 'নদীর শক্ত সরীসৃপ',
  'ডলফিন': 'নদীর বুদ্ধিমান জলচর',
  'ময়ূর': 'পেখম মেলা সুন্দর পাখি',
  'ক্যাঙ্গারু': 'পেটের থলিতে লাফানো প্রাণী',
};

const SHORT_HINTS_EN: Record<string, string> = {
  'কাচ্চি বিরিয়ানি': 'Festive Meat Rice',
  'ফুচকা': 'Spicy Street Snack',
  'ইলিশ পোলাও': 'Fish & Fragrant Rice',
  'মিষ্টি দই': 'Baked Sweet Yogurt',
  'বাকরখানি': 'Crispy Flatbread',
  'রসগোল্লা': 'Syrupy Sweet Ball',
  'পিৎজা': 'Cheesy Baked Crust',
  'বার্গার': 'Bun & Patty Snack',
  'ঝালমুড়ি': 'Spiced Puffed Rice',
  'হালিম': 'Slow-Cooked Lentil Stew',
  'সিঙাড়া': 'Fried Potato Pastry',
  'চটপটি': 'Tangy Tamarind Peas',
  'কালা ভুনা': 'Dark Roasted Beef',
  'বোরহানি': 'Spiced Mint Yogurt Drink',
  'রসমালাই': 'Clotted Cream Sweet',
  'বঙ্গবন্ধু শেখ মুজিবুর রহমান': 'Founding Father Leader',
  'কাজী নজরুল ইসলাম': 'Rebel National Poet',
  'রবীন্দ্রনাথ ঠাকুর': 'Nobel Laureate Poet',
  'হুমায়ূন আহমেদ': 'Celebrated Novelist Creator',
  'ড. মুহাম্মদ ইউনূস': 'Microcredit Nobel Winner',
  'মাশরাফি বিন মর্তুজা': 'Express Cricket Captain',
  'সাকিব আল হাসান': 'World Premier All-Rounder',
  'লিওনেল মেসি': 'Number 10 Football Magician',
  'ক্রিশ্চিয়ানো রোনালদো': 'CR7 Scoring Machine',
  'স্টিভ জবস': 'iPhone Tech Visionary',
  'অ্যালবার্ট আইনস্টাইন': 'Relativity Physicist',
  'স্মার্টফোন': 'Pocket Touchscreen Device',
  'রিকশা': 'Three-Wheeled Cycle Ride',
  'লুঙ্গি': 'Waist-Wrapped Cloth',
  'হারিকেন': 'Vintage Kerosene Lamp',
  'ছাতা': 'Rain & Sun Canopy',
  'ল্যাপটপ': 'Portable Folding Computer',
  'চশমা': 'Eye Vision Lenses',
  'হাতঘড়ি': 'Wrist Timepiece',
  'কলম': 'Ink Writing Pen',
  'ক্যামেরা': 'Photo Capturing Lens',
  'পদ্মা সেতু (মডেল/স্মারক)': 'Mega River Bridge',
  'রয়েল বেঙ্গল টাইগার': 'Sundarbans Striped Tiger',
  'দোয়েল': 'National Songbird',
  'ইলিশ মাছ': 'National Silvery Fish',
  'হাতি': 'Giant Trunked Herbivore',
  'সিংহ': 'King of the Jungle',
  'চিত্রা হরিণ': 'White Spotted Deer',
  'কুমির': 'Armored River Reptile',
  'ডলফিন': 'River Mammal Swimmer',
  'ময়ূর': 'Eye-Spotted Peacock',
  'ক্যাঙ্গারু': 'Hopping Marsupial',
};

// Generates short 2-3 words hint
export function getShortHint(word: WordItem, lang: Language): string {
  if (lang === 'en') {
    if (word.shortHintEn) return word.shortHintEn;
    if (SHORT_HINTS_EN[word.wordBn]) return SHORT_HINTS_EN[word.wordBn];
    const words = word.hintEn.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').split(/\s+/);
    return words.slice(0, 3).join(' ');
  }

  if (word.shortHintBn) return word.shortHintBn;
  if (SHORT_HINTS_BN[word.wordBn]) return SHORT_HINTS_BN[word.wordBn];

  // Derive punchy 2-3 words from hintBn
  const cleaned = word.hintBn.replace(/[।,!]/g, ' ').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.slice(0, 3).join(' ');
}

// Generates short English explanation for secret word
export function getShortExplanation(word: WordItem): string {
  if (word.explanationEn) return word.explanationEn;
  // If wordEn has translation or parentheses
  if (word.wordEn.includes('(')) {
    return word.wordEn;
  }
  return word.wordEn;
}
