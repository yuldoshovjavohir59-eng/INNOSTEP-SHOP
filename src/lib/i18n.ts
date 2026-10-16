import { useSyncExternalStore } from 'react';

export type Lang = 'uz' | 'ru' | 'en';
export const LANGS: { code: Lang; label: string }[] = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

const KEY = 'lm_lang';
let current: Lang = 'uz';
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === 'uz' || v === 'ru' || v === 'en') current = v;
  } catch (e) {}
  try { document.documentElement.lang = current; } catch (e) {}
}

export function setLang(l: Lang) {
  current = l;
  try { window.localStorage.setItem(KEY, l); } catch (e) {}
  try { document.documentElement.lang = l; } catch (e) {}
  listeners.forEach((f) => f());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function getSnapshot(): Lang {
  load();
  return current;
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'uz' as Lang);
}

const D: Record<string, [string, string, string]> = {
  "nav.home": ["Bosh sahifa","Главная","Home"],
  "nav.lots": ["Barcha lotlar","Все лоты","All lots"],
  "all": ["Barchasi","Все","All"],
  "cur": ["so'm","сум","UZS"],
  "site": ["sayt","сайт","site"],
  "hero.badge": ["Premium Mahsulotlar Katalogi","Каталог премиальных товаров","Premium Product Catalog"],
  "hero.h1a": ["Sifatli","Качественные","Quality"],
  "hero.h1b": ["mahsulotlar","товары","products"],
  "hero.h1c": ["eng qulay narxda","по самым выгодным ценам","at the best prices"],
  "hero.p": ["Maishiy kimyo, gigiena mahsulotlari va ofis buyumlari — sifatli, qulay va hamyonbop narxlarda. Toshkent shahri ichida bepul yetkazib berish xizmati mavjud.","Бытовая химия, средства гигиены и офисные товары — качественно, удобно и по доступным ценам. По Ташкенту действует бесплатная доставка.","Household chemicals, hygiene products and office supplies — quality, convenient and affordably priced. Free delivery within Tashkent."],
  "btn.lots": ["Barcha lotlar","Все лоты","All lots"],
  "btn.cats": ["Kategoriyalar","Категории","Categories"],
  "stat.lots": ["Aktiv lot","Активных лотов","Active lots"],
  "stat.cats": ["Kategoriya","Категорий","Categories"],
  "stat.guar": ["Kafolat","Гарантия","Guarantee"],
  "f1.t": ["To'liq ma'lumot","Полная информация","Full details"],
  "f1.d": ["Har bir lot uchun batafsil xarakteristikalar va rasmlar","Подробные характеристики и фото для каждого лота","Detailed specifications and photos for every lot"],
  "f2.t": ["Narx sinxronizatsiyasi","Синхронизация цен","Price sync"],
  "f2.d": ["Cooperation sayitidagi narxlar avtomatik yangilanib turadi","Цены с сайта Cooperation обновляются автоматически","Prices from the Cooperation site update automatically"],
  "f3.t": ["Tezkor buyurtma","Быстрый заказ","Fast ordering"],
  "f3.d": ["Bir bosish bilan Cooperation ga o'tib buyurtma bering","Перейдите на Cooperation одним нажатием и оформите заказ","Go to Cooperation in one click and place your order"],
  "f4.t": ["Ishonchli","Надёжно","Reliable"],
  "f4.d": ["Tasdiqlangan mahsulotlar, kafolatlangan sifat","Проверенные товары, гарантированное качество","Verified products, guaranteed quality"],
  "f5.t": ["Bepul yetkazib berish","Бесплатная доставка","Free delivery"],
  "f5.d": ["Toshkent shahri ichida bepul yetkazib berish xizmati mavjud","Бесплатная доставка по городу Ташкенту","Free delivery within Tashkent"],
  "lots.loading": ["Yuklanmoqda...","Загрузка...","Loading..."],
  "lots.showing": ["{n} ta mahsulot ko'rsatilmoqda","Показано товаров: {n}","Showing {n} products"],
  "lots.count": ["{n} ta mahsulot","Товаров: {n}","{n} products"],
  "lots.viewall": ["Hammasini ko'rish","Смотреть все","View all"],
  "lots.h1a": ["Barcha","Все","All"],
  "lots.h1b": ["lotlar","лоты","lots"],
  "lots.nomatch": ["Filtrlarga mos mahsulot topilmadi","Товары по фильтрам не найдены","No products match the filters"],
  "lots.empty": ["Hozircha lotlar yo'q","Пока лотов нет","No lots yet"],
  "filters": ["Filtrlar","Фильтры","Filters"],
  "clear": ["Tozalash","Сбросить","Clear"],
  "category": ["Kategoriya","Категория","Category"],
  "price.range": ["Narx oralig'i","Диапазон цены","Price range"],
  "price.from": ["Narx dan","Цена от","Price from"],
  "price.to": ["Narx gacha","Цена до","Price to"],
  "search.ph": ["Mahsulot qidirish...","Поиск товаров...","Search products..."],
  "sort.new": ["Yangi birinchi","Сначала новые","Newest first"],
  "sort.asc": ["Arzondan qimmatga","От дешёвых к дорогим","Price: low to high"],
  "sort.desc": ["Qimmatdan arzonga","От дорогих к дешёвым","Price: high to low"],
  "details": ["Batafsil","Подробнее","Details"],
  "footer.desc": ["Maishiy kimyo, gigiena mahsulotlari va ofis buyumlari — sifatli, qulay va hamyonbop narxlarda ulgurji yetkazib berish. Toshkent shahri ichida bepul yetkazib berish xizmati mavjud.","Бытовая химия, средства гигиены и офисные товары — оптовые поставки качественных товаров по доступным ценам. По Ташкенту действует бесплатная доставка.","Household chemicals, hygiene products and office supplies — wholesale delivery of quality goods at affordable prices. Free delivery within Tashkent."],
  "footer.links": ["Tezkor havolalar","Быстрые ссылки","Quick links"],
  "footer.contact": ["Aloqa","Контакты","Contact"],
  "footer.h1": ["Dush–Juma 9:00–18:00","Пн–Пт 9:00–18:00","Mon–Fri 9:00–18:00"],
  "footer.h2": ["Shan/Yak dam olish","Сб/Вс — выходной","Sat/Sun closed"],
  "footer.rights": ["© 2026 LUXURY MARKET. Barcha huquqlar himoyalangan.","© 2026 LUXURY MARKET. Все права защищены.","© 2026 LUXURY MARKET. All rights reserved."],
  "notfound": ["Lot topilmadi","Лот не найден","Lot not found"],
  "back": ["Orqaga","Назад","Back"],
  "crumb.lots": ["Lotlar","Лоты","Lots"],
  "per": ["1 ta uchun","за 1 шт.","per unit"],
  "site.price": ["{name} saytidagi narx:","Цена на сайте {name}:","Price on {name}:"],
  "qty.title": ["MIQDOR TANLASH","ВЫБОР КОЛИЧЕСТВА","SELECT QUANTITY"],
  "qty.min": ["min","мин","min"],
  "qty.max": ["max","макс","max"],
  "qty.warnRange": ["Miqdor {min} dan {max} gacha bo'lishi kerak. Hisob {qty} ta bo'yicha.","Количество должно быть от {min} до {max}. Расчёт на {qty} шт.","Quantity must be between {min} and {max}. Calculated for {qty} pcs."],
  "qty.warnMin": ["Miqdor {min} dan yuqori bo'lishi kerak. Hisob {qty} ta bo'yicha.","Количество должно быть не менее {min}. Расчёт на {qty} шт.","Quantity must be at least {min}. Calculated for {qty} pcs."],
  "total": ["Jami ({qty} ta):","Итого ({qty} шт.):","Total ({qty} pcs):"],
  "order.via": ["{name} orqali","Через {name}","Order via {name}"],
  "order.site": ["Saytda buyurtma berish","Заказать на сайте","Order on the site"],
  "tg.btn": ["Telegram orqali bog'lanish","Связаться через Telegram","Contact via Telegram"],
  "note.site": ["Buyurtma {name} saytida rasmiylashtiriladi.","Заказ оформляется на сайте {name}.","The order is completed on {name}."],
  "note.tg": ["Telegram orqali — to'g'ridan-to'g'ri biz bilan bog'lanasiz.","Через Telegram вы связываетесь напрямую с нами.","Via Telegram you contact us directly."],
  "tg.hello": ["Assalomu alaykum\u0021 Buyurtma bermoqchiman:","Здравствуйте\u0021 Хочу сделать заказ:","Hello\u0021 I would like to place an order:"],
  "tg.product": ["Mahsulot: ","Товар: ","Product: "],
  "tg.exchange": ["Birja: ","Биржа: ","Exchange: "],
  "tg.qty": ["Miqdor: {n} ta","Количество: {n} шт.","Quantity: {n} pcs"],
  "tg.price": ["Narx (1 ta): ","Цена (за 1 шт.): ","Price (per unit): "],
  "tg.total": ["Jami: ","Итого: ","Total: "],
  "char.title": ["Xarakteristikalar","Характеристики","Specifications"],
};

const IDX: Record<Lang, number> = { uz: 0, ru: 1, en: 2 };

export function useT() {
  const lang = useLang();
  return (key: string, vars?: Record<string, string | number>): string => {
    const e = D[key];
    let s = e ? (e[IDX[lang]] || e[0]) : key;
    if (vars) {
      for (const k of Object.keys(vars)) s = s.split('{' + k + '}').join(String(vars[k]));
    }
    return s;
  };
}
