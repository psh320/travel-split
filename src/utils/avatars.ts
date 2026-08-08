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
  { id: "momo", src: "/avatars/momo.webp", color: "#f7e39b" },
  { id: "bori", src: "/avatars/bori.webp", color: "#bfe2f3" },
  { id: "duri", src: "/avatars/duri.webp", color: "#cde8c8" },
  { id: "navi", src: "/avatars/navi.webp", color: "#f5c8ae" },
  { id: "toto", src: "/avatars/toto.webp", color: "#d8c9ee" },
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
    { id: "bob", ko: "단발", en: "Bob" },
    { id: "crop", ko: "숏컷", en: "Crop" },
    { id: "curls", ko: "곱슬", en: "Curls" },
    { id: "waves", ko: "웨이브", en: "Waves" },
    { id: "long", ko: "긴 머리", en: "Long" },
    { id: "bun", ko: "묶은 머리", en: "Bun" },
    { id: "pixie", ko: "픽시컷", en: "Pixie" },
    { id: "ponytail", ko: "포니테일", en: "Ponytail" },
    { id: "braids", ko: "양갈래 땋기", en: "Braids" },
    { id: "afro", ko: "아프로", en: "Afro" },
    { id: "shag", ko: "레이어드컷", en: "Shag" },
    { id: "locs", ko: "록스", en: "Locs" },
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
    { id: "happy", ko: "웃는 눈", en: "Happy" },
    { id: "sparkle", ko: "반짝", en: "Sparkle" },
    { id: "sleepy", ko: "나른", en: "Sleepy" },
  ] satisfies Array<{ id: AvatarEyeStyle; ko: string; en: string }>,
  noseStyle: [
    { id: "dot", ko: "콩", en: "Dot" },
    { id: "button", ko: "단추", en: "Button" },
    { id: "soft", ko: "말랑", en: "Soft" },
    { id: "triangle", ko: "오뚝", en: "Tiny" },
  ] satisfies Array<{ id: AvatarNoseStyle; ko: string; en: string }>,
  mouthStyle: [
    { id: "smile", ko: "미소", en: "Smile" },
    { id: "grin", ko: "활짝", en: "Grin" },
    { id: "open", ko: "신남", en: "Excited" },
    { id: "pout", ko: "새침", en: "Pout" },
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
  hairStyle: "bob",
  hairColor: "chestnut",
  eyeStyle: "round",
  noseStyle: "button",
  mouthStyle: "smile",
  accessory: "blush",
  background: "butter",
  outfit: "coral",
};

export const AVATAR_PRESETS: Record<AvatarId, AvatarConfig> = {
  momo: DEFAULT_AVATAR_CONFIG,
  bori: { version: 1, skinTone: "tan", hairStyle: "curls", hairColor: "ink", eyeStyle: "sparkle", noseStyle: "dot", mouthStyle: "smile", accessory: "earrings", background: "sky", outfit: "mint" },
  duri: { version: 1, skinTone: "porcelain", hairStyle: "long", hairColor: "ink", eyeStyle: "round", noseStyle: "soft", mouthStyle: "smile", accessory: "glasses", background: "mint", outfit: "lilac" },
  navi: { version: 1, skinTone: "golden", hairStyle: "crop", hairColor: "auburn", eyeStyle: "round", noseStyle: "triangle", mouthStyle: "grin", accessory: "freckles", background: "peach", outfit: "blue" },
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

export const getAvatar = (
  user: Pick<User, "id" | "name" | "avatarId">
) => AVATARS.find((avatar) => avatar.id === getAvatarId(user)) ?? AVATARS[0];

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

export const getOptionColor = (
  category: "skinTone" | "hairColor" | "background" | "outfit",
  id: string
) => AVATAR_OPTIONS[category].find((option) => option.id === id)?.color ?? "#cccccc";
