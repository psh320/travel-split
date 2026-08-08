import type {
  AvatarAccessory,
  AvatarBackground,
  AvatarConfig,
  AvatarEyeStyle,
  AvatarHairColor,
  AvatarHairStyle,
  AvatarMouthStyle,
  AvatarNoseStyle,
  AvatarOutfit,
  AvatarSkinTone,
  User,
} from "../types";

export const AVATARS = [
  { id: "momo" },
  { id: "bori" },
  { id: "duri" },
  { id: "navi" },
  { id: "toto" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export const AVATAR_OPTIONS = {
  skinTone: [
    { id: "porcelain", color: "#f7d7c4", ko: "포슬린", en: "Porcelain" },
    { id: "peach", color: "#f5bf98", ko: "피치", en: "Peach" },
    { id: "golden", color: "#dda06a", ko: "골든", en: "Golden" },
    { id: "tan", color: "#bd7b4f", ko: "탠", en: "Tan" },
    { id: "brown", color: "#8a5238", ko: "브라운", en: "Brown" },
    { id: "deep", color: "#633b2d", ko: "딥", en: "Deep" },
  ] satisfies Array<{ id: AvatarSkinTone; color: string; ko: string; en: string }>,
  hairStyle: [
    { id: "buzz", ko: "버즈컷", en: "Buzz" },
    { id: "crop", ko: "텍스처 크롭", en: "Textured crop" },
    { id: "sidepart", ko: "사이드 스윕", en: "Side sweep" },
    { id: "quiff", ko: "퀴프", en: "Quiff" },
    { id: "bowl", ko: "투블럭", en: "Two-block" },
    { id: "curls", ko: "짧은 곱슬", en: "Short curls" },
    { id: "afro", ko: "아프로", en: "Afro" },
    { id: "locs", ko: "트위스트", en: "Twists" },
    { id: "bob", ko: "단발", en: "Bob" },
    { id: "waves", ko: "웨이브", en: "Waves" },
    { id: "long", ko: "긴 머리", en: "Long" },
    { id: "bun", ko: "번", en: "Bun" },
    { id: "pixie", ko: "픽시", en: "Pixie" },
    { id: "ponytail", ko: "포니테일", en: "Ponytail" },
    { id: "braids", ko: "양갈래", en: "Braids" },
    { id: "shag", ko: "레이어드", en: "Shag" },
  ] satisfies Array<{ id: AvatarHairStyle; ko: string; en: string }>,
  hairColor: [
    { id: "ink", color: "#2f292b", ko: "잉크", en: "Ink" },
    { id: "chestnut", color: "#6f4032", ko: "밤색", en: "Chestnut" },
    { id: "auburn", color: "#8d3f3f", ko: "적갈색", en: "Auburn" },
    { id: "honey", color: "#bd8a45", ko: "허니", en: "Honey" },
    { id: "rose", color: "#a85f72", ko: "로즈", en: "Rose" },
  ] satisfies Array<{ id: AvatarHairColor; color: string; ko: string; en: string }>,
  eyeStyle: [
    { id: "round", ko: "동글", en: "Round" },
    { id: "dot", ko: "콩눈", en: "Dots" },
    { id: "happy", ko: "실눈", en: "Narrow" },
    { id: "sparkle", ko: "큰눈", en: "Big" },
    { id: "sleepy", ko: "반달", en: "Crescent" },
    { id: "almond", ko: "가로", en: "Wide" },
    { id: "wink", ko: "세로", en: "Tall" },
    { id: "curious", ko: "아치", en: "Arch" },
  ] satisfies Array<{ id: AvatarEyeStyle; ko: string; en: string }>,
  noseStyle: [
    { id: "dot", ko: "콩", en: "Dot" },
    { id: "button", ko: "단추", en: "Button" },
    { id: "soft", ko: "말랑", en: "Soft" },
    { id: "triangle", ko: "오뚝", en: "Tiny" },
    { id: "bridge", ko: "콧대", en: "Bridge" },
    { id: "snub", ko: "들창", en: "Snub" },
  ] satisfies Array<{ id: AvatarNoseStyle; ko: string; en: string }>,
  mouthStyle: [
    { id: "smile", ko: "미소", en: "Smile" },
    { id: "grin", ko: "이빨", en: "Teeth" },
    { id: "open", ko: "동그라미", en: "O mouth" },
    { id: "pout", ko: "새침", en: "Pout" },
    { id: "laugh", ko: "활짝", en: "Laugh" },
    { id: "smirk", ko: "씨익", en: "Smirk" },
    { id: "tiny", ko: "작은 미소", en: "Tiny" },
    { id: "flat", ko: "덤덤", en: "Straight" },
  ] satisfies Array<{ id: AvatarMouthStyle; ko: string; en: string }>,
  accessory: [
    { id: "none", ko: "없음", en: "None" },
    { id: "glasses", ko: "안경", en: "Glasses" },
    { id: "freckles", ko: "주근깨", en: "Freckles" },
    { id: "blush", ko: "볼터치", en: "Blush" },
    { id: "earrings", ko: "귀걸이", en: "Earrings" },
    { id: "star", ko: "별핀", en: "Star clip" },
  ] satisfies Array<{ id: AvatarAccessory; ko: string; en: string }>,
  background: [
    { id: "butter", color: "#f7e39b", ko: "버터", en: "Butter" },
    { id: "sky", color: "#bfe2f3", ko: "하늘", en: "Sky" },
    { id: "mint", color: "#cde8c8", ko: "민트", en: "Mint" },
    { id: "peach", color: "#f5c8ae", ko: "복숭아", en: "Peach" },
    { id: "lilac", color: "#d8c9ee", ko: "라일락", en: "Lilac" },
    { id: "rose", color: "#efc8d5", ko: "로즈", en: "Rose" },
  ] satisfies Array<{ id: AvatarBackground; color: string; ko: string; en: string }>,
  outfit: [
    { id: "coral", color: "#ed725f", ko: "코랄", en: "Coral" },
    { id: "mint", color: "#79bba4", ko: "민트", en: "Mint" },
    { id: "blue", color: "#4aa3dc", ko: "블루", en: "Blue" },
    { id: "lilac", color: "#9b82c4", ko: "라일락", en: "Lilac" },
    { id: "sunny", color: "#f2ba38", ko: "옐로", en: "Sunny" },
    { id: "navy", color: "#465b78", ko: "네이비", en: "Navy" },
  ] satisfies Array<{ id: AvatarOutfit; color: string; ko: string; en: string }>,
} as const;

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  version: 1,
  skinTone: "peach",
  hairStyle: "crop",
  hairColor: "chestnut",
  eyeStyle: "round",
  noseStyle: "dot",
  mouthStyle: "smile",
  accessory: "none",
  background: "butter",
  outfit: "coral",
};

export const AVATAR_PRESETS: Record<AvatarId, AvatarConfig> = {
  momo: DEFAULT_AVATAR_CONFIG,
  bori: { version: 1, skinTone: "tan", hairStyle: "sidepart", hairColor: "ink", eyeStyle: "dot", noseStyle: "dot", mouthStyle: "smirk", accessory: "glasses", background: "sky", outfit: "mint" },
  duri: { version: 1, skinTone: "porcelain", hairStyle: "bob", hairColor: "ink", eyeStyle: "curious", noseStyle: "soft", mouthStyle: "tiny", accessory: "none", background: "mint", outfit: "lilac" },
  navi: { version: 1, skinTone: "golden", hairStyle: "quiff", hairColor: "auburn", eyeStyle: "round", noseStyle: "triangle", mouthStyle: "grin", accessory: "freckles", background: "peach", outfit: "blue" },
  toto: { version: 1, skinTone: "golden", hairStyle: "bun", hairColor: "ink", eyeStyle: "happy", noseStyle: "button", mouthStyle: "smile", accessory: "star", background: "lilac", outfit: "sunny" },
};

const avatarIds = new Set<string>(AVATARS.map((avatar) => avatar.id));

export const isAvatarId = (value: unknown): value is AvatarId =>
  typeof value === "string" && avatarIds.has(value);

const stableHash = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const getAvatarId = (
  user: Pick<User, "id" | "name" | "avatarId">
): AvatarId => {
  if (isAvatarId(user.avatarId)) return user.avatarId;
  return AVATARS[stableHash(`${user.id}:${user.name}`) % AVATARS.length].id;
};

const hasOption = <T extends string>(
  options: ReadonlyArray<{ id: T }>,
  value: unknown
): value is T => typeof value === "string" && options.some((option) => option.id === value);

export const normalizeAvatarConfig = (value: unknown): AvatarConfig | undefined => {
  if (!value || typeof value !== "object") return undefined;
  const config = value as Partial<AvatarConfig>;

  if (
    config.version !== 1 ||
    !hasOption(AVATAR_OPTIONS.skinTone, config.skinTone) ||
    !hasOption(AVATAR_OPTIONS.hairStyle, config.hairStyle) ||
    !hasOption(AVATAR_OPTIONS.hairColor, config.hairColor) ||
    !hasOption(AVATAR_OPTIONS.eyeStyle, config.eyeStyle) ||
    !hasOption(AVATAR_OPTIONS.noseStyle, config.noseStyle) ||
    !hasOption(AVATAR_OPTIONS.mouthStyle, config.mouthStyle) ||
    !hasOption(AVATAR_OPTIONS.accessory, config.accessory) ||
    !hasOption(AVATAR_OPTIONS.background, config.background) ||
    !hasOption(AVATAR_OPTIONS.outfit, config.outfit)
  ) {
    return undefined;
  }

  return config as AvatarConfig;
};

export const getAvatarConfig = (
  user: Pick<User, "id" | "name" | "avatarId" | "avatarConfig">
): AvatarConfig =>
  normalizeAvatarConfig(user.avatarConfig) ?? AVATAR_PRESETS[getAvatarId(user)];
