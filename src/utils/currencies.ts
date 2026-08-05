import { isKorean } from "../i18n";

const CURRENCY_NAMES = {
  USD: { en: "US Dollar", ko: "미국 달러" },
  KRW: { en: "Korean Won", ko: "대한민국 원" },
  JPY: { en: "Japanese Yen", ko: "일본 엔" },
  EUR: { en: "Euro", ko: "유로" },
  GBP: { en: "Pound Sterling", ko: "영국 파운드" },
  CNY: { en: "Chinese Yuan", ko: "중국 위안" },
  HKD: { en: "Hong Kong Dollar", ko: "홍콩 달러" },
  TWD: { en: "Taiwan Dollar", ko: "대만 달러" },
  SGD: { en: "Singapore Dollar", ko: "싱가포르 달러" },
  AUD: { en: "Australian Dollar", ko: "호주 달러" },
  CAD: { en: "Canadian Dollar", ko: "캐나다 달러" },
} as const;

export const CURRENCY_OPTIONS = Object.entries(CURRENCY_NAMES).map(
  ([code, names]) => ({
    code,
    label: `${code} — ${names[isKorean ? "ko" : "en"]}`,
  })
);
