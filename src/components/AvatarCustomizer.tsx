import { useState } from "react";
import type { CSSProperties } from "react";
import { isKorean } from "../i18n";
import type { AvatarConfig } from "../types";
import {
  AVATAR_OPTIONS,
  AVATAR_PRESETS,
  getOptionColor,
  type AvatarId,
} from "../utils/avatars";
import { AvatarIllustration } from "./AvatarIllustration";

type AvatarCustomizerProps = {
  value: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
  label: string;
  compact?: boolean;
  editor?: boolean;
};

type EditableAvatarKey = Exclude<keyof AvatarConfig, "version">;
type Category = "preset" | EditableAvatarKey;

const categories: Array<{ id: Category; ko: string; en: string }> = [
  { id: "preset", ko: "프리셋", en: "Presets" },
  { id: "skinTone", ko: "피부", en: "Skin" },
  { id: "hairStyle", ko: "머리", en: "Hair" },
  { id: "hairColor", ko: "머리색", en: "Hair color" },
  { id: "eyeStyle", ko: "눈", en: "Eyes" },
  { id: "noseStyle", ko: "코", en: "Nose" },
  { id: "mouthStyle", ko: "입", en: "Mouth" },
  { id: "accessory", ko: "꾸미기", en: "Extras" },
  { id: "background", ko: "배경", en: "Background" },
  { id: "outfit", ko: "옷", en: "Outfit" },
];

const presetNames: Record<AvatarId, { ko: string; en: string }> = {
  momo: { ko: "모모", en: "Momo" },
  bori: { ko: "보리", en: "Bori" },
  duri: { ko: "두리", en: "Duri" },
  navi: { ko: "나비", en: "Navi" },
  toto: { ko: "토토", en: "Toto" },
};

const configsEqual = (left: AvatarConfig, right: AvatarConfig) =>
  categories
    .filter((category) => category.id !== "preset")
    .every((category) => left[category.id as EditableAvatarKey] === right[category.id as EditableAvatarKey]);

function CategoryGlyph({ category }: { category: Category }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {category === "preset" && <><path {...common} d="m12 3 1.7 4.8 5.1.2-4 3.1 1.4 4.9-4.2-2.8L7.8 16l1.4-4.9-4-3.1 5.1-.2Z" /><path {...common} d="M18.5 16.5v4M16.5 18.5h4" /></>}
      {category === "skinTone" && <><circle {...common} cx="12" cy="12" r="8" /><path {...common} d="M8.5 10h.01M15.5 10h.01M9 15c2 1.4 4 1.4 6 0" /></>}
      {category === "hairStyle" && <><path {...common} d="M5 13V9a7 7 0 0 1 14 0v4M6 10c3 0 5-1.6 6.2-4 1.5 2.1 3.4 3.4 5.8 4" /><path {...common} d="M7 14c.6 4 2.3 6 5 6s4.4-2 5-6" /></>}
      {category === "hairColor" && <><path {...common} d="M12 3c-2.7 4.3-5 7.1-5 10a5 5 0 0 0 10 0c0-2.9-2.3-5.7-5-10Z" /><path {...common} d="M9.5 14.5c.5 1.2 1.3 1.8 2.5 1.8" /></>}
      {category === "eyeStyle" && <><path {...common} d="M2.8 12s3.3-5 9.2-5 9.2 5 9.2 5-3.3 5-9.2 5-9.2-5-9.2-5Z" /><circle {...common} cx="12" cy="12" r="2.4" /></>}
      {category === "noseStyle" && <><path {...common} d="M13 4c-.4 4.2-1.6 7.8-3 10.8-.7 1.6.4 3.2 2.2 3.2H15" /><path {...common} d="M9 20h6" /></>}
      {category === "mouthStyle" && <><path {...common} d="M4 10c2.8.1 4.8-.8 8-3 3.2 2.2 5.2 3.1 8 3-1.8 4.7-4.5 7-8 7s-6.2-2.3-8-7Z" /><path {...common} d="M6 11h12" /></>}
      {category === "accessory" && <><path {...common} d="M3 11h3M18 11h3M10 11h4" /><rect {...common} x="6" y="7" width="4" height="7" rx="2" /><rect {...common} x="14" y="7" width="4" height="7" rx="2" /><path {...common} d="m18.5 17 .7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2Z" /></>}
      {category === "background" && <><rect {...common} x="4" y="4" width="16" height="16" rx="3" /><circle {...common} cx="9" cy="9" r="1.5" /><path {...common} d="m5.5 17 4-4 2.5 2 2.5-3 4 5" /></>}
      {category === "outfit" && <path {...common} d="m8 5-5 4 2.5 4L8 11v9h8v-9l2.5 2L21 9l-5-4c-.8 1.3-2.1 2-4 2S8.8 6.3 8 5Z" />}
    </svg>
  );
}

export function AvatarCustomizer({
  value,
  onChange,
  label,
  compact = false,
  editor = false,
}: AvatarCustomizerProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("preset");
  const localeKey = isKorean ? "ko" : "en";
  const activeMeta = categories.find((category) => category.id === activeCategory) ?? categories[0];

  const renderOption = (
    id: string,
    optionLabel: string,
    previewConfig: AvatarConfig,
    selected: boolean,
    color?: string
  ) => (
    <button
      key={id}
      type="button"
      role="radio"
      aria-checked={selected}
      className={`avatar-customizer-option${selected ? " is-selected" : ""}`}
      onClick={() => onChange(previewConfig)}
    >
      {color ? (
        <span className="avatar-customizer-swatch" style={{ background: color }} />
      ) : (
        <span className={`avatar-customizer-feature is-${activeCategory}`}>
          <AvatarIllustration config={previewConfig} decorative />
        </span>
      )}
      <span className="sr-only">{optionLabel}</span>
      <span className="avatar-customizer-check" aria-hidden="true">✓</span>
    </button>
  );

  const renderOptions = () => {
    if (activeCategory === "preset") {
      return (Object.entries(AVATAR_PRESETS) as Array<[AvatarId, AvatarConfig]>).map(
        ([id, config]) =>
          renderOption(
            id,
            presetNames[id][localeKey],
            config,
            configsEqual(value, config)
          )
      );
    }

    const options = AVATAR_OPTIONS[activeCategory] as ReadonlyArray<{
      id: string;
      ko: string;
      en: string;
      color?: string;
    }>;

    return options.map((option) => {
      const nextConfig = { ...value, [activeCategory]: option.id } as AvatarConfig;
      const useSwatch = ["skinTone", "hairColor", "background", "outfit"].includes(
        activeCategory
      );
      return renderOption(
        option.id,
        option[localeKey],
        nextConfig,
        value[activeCategory] === option.id,
        useSwatch ? option.color : undefined
      );
    });
  };

  return (
    <fieldset className={`avatar-customizer${compact ? " is-compact" : ""}${editor ? " is-editor" : ""}`}>
      <legend className="avatar-customizer-legend">{label}</legend>

      <div
        className="avatar-customizer-stage"
        style={{ "--avatar-stage-color": getOptionColor("background", value.background) } as CSSProperties}
      >
        <AvatarIllustration
          config={value}
          title={isKorean ? "내 캐릭터 미리보기" : "My character preview"}
        />
      </div>

      <div className="avatar-customizer-tabs" role="tablist" aria-label={label}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === category.id}
            className={activeCategory === category.id ? "is-active" : ""}
            onClick={() => setActiveCategory(category.id)}
          >
            <CategoryGlyph category={category.id} />
            <span className="sr-only">{category[localeKey]}</span>
          </button>
        ))}
      </div>

      <div className="avatar-customizer-palette">
        <div className="avatar-customizer-category-heading">
          <strong>{activeMeta[localeKey]}</strong>
        </div>
        <div
          className="avatar-customizer-options"
          role="radiogroup"
          aria-label={activeMeta[localeKey]}
        >
          {renderOptions()}
        </div>
      </div>
    </fieldset>
  );
}
