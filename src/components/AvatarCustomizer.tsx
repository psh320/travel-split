import { useState } from "react";
import { isKorean } from "../i18n";
import type { AvatarConfig } from "../types";
import {
  AVATAR_OPTIONS,
  AVATAR_PRESETS,
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

type EditableAvatarKey = "hairStyle" | "eyeStyle" | "mouthStyle" | "accessory";
type Category = "preset" | EditableAvatarKey;

const categories: Array<{ id: Category; ko: string; en: string }> = [
  { id: "preset", ko: "프리셋", en: "Presets" },
  { id: "hairStyle", ko: "머리", en: "Hair" },
  { id: "eyeStyle", ko: "눈", en: "Eyes" },
  { id: "mouthStyle", ko: "입", en: "Mouth" },
  { id: "accessory", ko: "꾸미기", en: "Extras" },
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
      {category === "hairStyle" && <><path {...common} d="M5 13V9a7 7 0 0 1 14 0v4M6 10c3 0 5-1.6 6.2-4 1.5 2.1 3.4 3.4 5.8 4" /><path {...common} d="M7 14c.6 4 2.3 6 5 6s4.4-2 5-6" /></>}
      {category === "eyeStyle" && <><path {...common} d="M2.8 12s3.3-5 9.2-5 9.2 5 9.2 5-3.3 5-9.2 5-9.2-5-9.2-5Z" /><circle {...common} cx="12" cy="12" r="2.4" /></>}
      {category === "mouthStyle" && <><path {...common} d="M4 10c2.8.1 4.8-.8 8-3 3.2 2.2 5.2 3.1 8 3-1.8 4.7-4.5 7-8 7s-6.2-2.3-8-7Z" /><path {...common} d="M6 11h12" /></>}
      {category === "accessory" && <><path {...common} d="M3 11h3M18 11h3M10 11h4" /><rect {...common} x="6" y="7" width="4" height="7" rx="2" /><rect {...common} x="14" y="7" width="4" height="7" rx="2" /><path {...common} d="m18.5 17 .7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2Z" /></>}
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
    selected: boolean
  ) => (
    <button
      key={id}
      type="button"
      role="radio"
      aria-checked={selected}
      className={`avatar-customizer-option${selected ? " is-selected" : ""}`}
      onClick={() => onChange(previewConfig)}
    >
      <span className={`avatar-customizer-feature is-${activeCategory}`}>
        <AvatarIllustration config={previewConfig} decorative />
      </span>
      <span className="avatar-customizer-option-label">{optionLabel}</span>
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
    }>;

    return options.map((option) => {
      const nextConfig = { ...value, [activeCategory]: option.id } as AvatarConfig;
      return renderOption(
        option.id,
        option[localeKey],
        nextConfig,
        value[activeCategory] === option.id
      );
    });
  };

  return (
    <fieldset className={`avatar-customizer${compact ? " is-compact" : ""}${editor ? " is-editor" : ""}`}>
      <legend className="avatar-customizer-legend">{label}</legend>

      <div className="avatar-customizer-stage">
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
