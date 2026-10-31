export interface TitlePair {
  bn: string;
  en: string;
}

export const FIRST_PLAYER_TITLE: TitlePair = {
  bn: 'প্রধানমন্ত্রী 🏛️',
  en: 'Prime Minister 🏛️',
};

export const FUN_TITLES: TitlePair[] = [
  { bn: 'পুলিশ 👮‍♂️', en: 'Police Officer 👮‍♂️' },
  { bn: 'ডাক্তার 🩺', en: 'Chief Doctor 🩺' },
  { bn: 'চোর 🦹', en: 'Master Thief 🦹' },
  { bn: 'পাতি নেতা 🚩', en: 'Local Politician 🚩' },
  { bn: 'সিআইডি অফিসার 🔍', en: 'CID Detective 🔍' },
  { bn: 'আইনজীবী ⚖️', en: 'Defense Lawyer ⚖️' },
  { bn: 'বিজ্ঞানী 🧪', en: 'Mad Scientist 🧪' },
  { bn: 'কবিরাজ 🌿', en: 'Herbal Healer 🌿' },
  { bn: 'ট্রাফিক সার্জেন্ট 🚦', en: 'Traffic Sergeant 🚦' },
  { bn: 'চা-খোর বেকার ☕', en: 'Tea Stall Thinker ☕' },
  { bn: 'ঘটক 💍', en: 'Royal Matchmaker 💍' },
  { bn: 'পাড়ার বড় ভাই 😎', en: 'Neighborhood Big Bro 😎' },
  { bn: 'পকেটমার 👛', en: 'Slick Pickpocket 👛' },
  { bn: 'বেসরকারি গোয়েন্দা 🕵️‍♂️', en: 'Private Detective 🕵️‍♂️' },
  { bn: 'জ্যোতিষী 🔮', en: 'Mystic Astrologer 🔮' },
  { bn: 'মেম্বার সাহেব 🗳️', en: 'Ward Member 🗳️' },
  { bn: 'ব্যবসায়ী 💼', en: 'Big Tycoon 💼' },
  { bn: 'ভাইরাল ইনফ্লুয়েন্সার 📱', en: 'Viral Influencer 📱' },
  { bn: 'গ্রাম্য মাতব্বর 🪑', en: 'Village Elder 🪑' },
  { bn: 'এলাকার মাস্তান 🥊', en: 'Street Brawler 🥊' },
  { bn: 'চা দোকানি 🍵', en: 'Tea Stall Owner 🍵' },
  { bn: 'অনুসন্ধানী সাংবাদিক 📰', en: 'Investigative Reporter 📰' },
];

export function generatePlayerTitles(count: number): TitlePair[] {
  const titles: TitlePair[] = [FIRST_PLAYER_TITLE];
  const shuffled = [...FUN_TITLES].sort(() => 0.5 - Math.random());
  for (let i = 1; i < count; i++) {
    titles.push(shuffled[(i - 1) % shuffled.length]);
  }
  return titles;
}
