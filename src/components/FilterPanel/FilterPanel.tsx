import React from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import type {
  AgeRange,
  HeightRange,
  WeightRange,
  Education,
  IncomeRange,
  MarriageStatus,
  Region,
  Zodiac,
  MBTIType,
  Industry,
} from '../../engine/types';
import {
  AGE_LABELS,
  HEIGHT_LABELS,
  WEIGHT_LABELS,
  EDUCATION_LABELS,
  INCOME_LABELS,
  MARRIAGE_LABELS,
  REGION_LABELS,
  ZODIAC_LABELS,
  MBTI_LABELS,
  INDUSTRY_LABELS,
} from '../../engine/types';

/* ---- 小型子元件 ---- */

const GenderSection: React.FC = () => {
  const gender = useFilterStore((s) => s.gender);
  const setGender = useFilterStore((s) => s.setGender);

  return (
    <div className="filter-section" id="filter-gender">
      <div className="filter-section__header">
        <span className="filter-section__icon">👤</span>
        <span className="filter-section__title">尋找對象性別</span>
      </div>
      <div className="gender-toggle">
        <button
          className={`gender-btn ${gender === 'male' ? 'gender-btn--active' : ''}`}
          onClick={() => setGender('male')}
          id="gender-male"
        >
          <span>♂</span> 男性
        </button>
        <button
          className={`gender-btn ${gender === 'female' ? 'gender-btn--active' : ''}`}
          onClick={() => setGender('female')}
          id="gender-female"
        >
          <span>♀</span> 女性
        </button>
      </div>
    </div>
  );
};

interface ChipGroupProps<T extends string> {
  title: string;
  icon: string;
  labels: Record<T, string>;
  selected: T[];
  onToggle: (value: T) => void;
  percentage: number;
  sectionId: string;
}

function ChipGroup<T extends string>({
  title,
  icon,
  labels,
  selected,
  onToggle,
  percentage,
  sectionId,
}: ChipGroupProps<T>) {
  const keys = Object.keys(labels) as T[];
  const showPercent = selected.length > 0;

  return (
    <div className="filter-section" id={sectionId}>
      <div className="filter-section__header">
        <span className="filter-section__icon">{icon}</span>
        <span className="filter-section__title">{title}</span>
        {showPercent && (
          <span className="filter-section__percentage">
            {(percentage * 100).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="chip-group">
        {keys.map((key) => (
          <button
            key={key}
            className={`chip ${selected.includes(key) ? 'chip--active' : ''}`}
            onClick={() => onToggle(key)}
            id={`chip-${sectionId}-${key}`}
          >
            {labels[key]}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- 主面板 ---- */

export const FilterPanel: React.FC = () => {
  const store = useFilterStore();

  return (
    <aside className="filter-panel" id="filter-panel">
      <GenderSection />

      <ChipGroup<AgeRange>
        title="年齡區間"
        icon="🎂"
        labels={AGE_LABELS}
        selected={store.ageRanges}
        onToggle={store.toggleAgeRange}
        percentage={store.result.dimensionPercentages.age}
        sectionId="filter-age"
      />

      <ChipGroup<HeightRange>
        title="身高條件"
        icon="📏"
        labels={HEIGHT_LABELS}
        selected={store.heightRanges}
        onToggle={store.toggleHeightRange}
        percentage={store.result.dimensionPercentages.height}
        sectionId="filter-height"
      />

      <ChipGroup<WeightRange>
        title="體重條件"
        icon="⚖️"
        labels={WEIGHT_LABELS}
        selected={store.weightRanges}
        onToggle={store.toggleWeightRange}
        percentage={store.result.dimensionPercentages.weight}
        sectionId="filter-weight"
      />

      <ChipGroup<Education>
        title="教育程度"
        icon="🎓"
        labels={EDUCATION_LABELS}
        selected={store.educations}
        onToggle={store.toggleEducation}
        percentage={store.result.dimensionPercentages.education}
        sectionId="filter-education"
      />

      <ChipGroup<IncomeRange>
        title="月收入"
        icon="💰"
        labels={INCOME_LABELS}
        selected={store.incomeRanges}
        onToggle={store.toggleIncomeRange}
        percentage={store.result.dimensionPercentages.income}
        sectionId="filter-income"
      />

      <ChipGroup<Industry>
        title="產業 / 職業"
        icon="💼"
        labels={INDUSTRY_LABELS}
        selected={store.industries}
        onToggle={store.toggleIndustry}
        percentage={store.result.dimensionPercentages.industry}
        sectionId="filter-industry"
      />

      <ChipGroup<MarriageStatus>
        title="婚姻狀態"
        icon="💍"
        labels={MARRIAGE_LABELS}
        selected={store.marriageStatuses}
        onToggle={store.toggleMarriageStatus}
        percentage={store.result.dimensionPercentages.marriage}
        sectionId="filter-marriage"
      />

      <ChipGroup<Region>
        title="居住區域"
        icon="📍"
        labels={REGION_LABELS}
        selected={store.regions}
        onToggle={store.toggleRegion}
        percentage={store.result.dimensionPercentages.region}
        sectionId="filter-region"
      />

      <ChipGroup<Zodiac>
        title="星座"
        icon="🌟"
        labels={ZODIAC_LABELS}
        selected={store.zodiacs}
        onToggle={store.toggleZodiac}
        percentage={store.result.dimensionPercentages.zodiac}
        sectionId="filter-zodiac"
      />

      <ChipGroup<MBTIType>
        title="MBTI 人格"
        icon="🧠"
        labels={MBTI_LABELS}
        selected={store.mbtis}
        onToggle={store.toggleMbti}
        percentage={store.result.dimensionPercentages.mbti}
        sectionId="filter-mbti"
      />
    </aside>
  );
};
