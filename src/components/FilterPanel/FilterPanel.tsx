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

/* ---- 我的條件 ---- */

const MyConditionsSection: React.FC = () => {
  const myAgeRange = useFilterStore((s) => s.myAgeRange);
  const myEducation = useFilterStore((s) => s.myEducation);
  const setMyAgeRange = useFilterStore((s) => s.setMyAgeRange);
  const setMyEducation = useFilterStore((s) => s.setMyEducation);

  const ageKeys = Object.keys(AGE_LABELS) as AgeRange[];
  const eduKeys = Object.keys(EDUCATION_LABELS) as Education[];

  return (
    <div className="filter-section filter-section--my-info" id="filter-my-conditions">
      <div className="filter-section__header">
        <span className="filter-section__icon">💡</span>
        <span className="filter-section__title">我的條件</span>
        <span className="filter-section__hint">（可選，啟用婚配分析）</span>
      </div>
      <div className="my-conditions-grid">
        <div className="my-conditions-field">
          <label htmlFor="my-age-select">我的年齡層</label>
          <select
            id="my-age-select"
            value={myAgeRange || ''}
            onChange={(e) =>
              setMyAgeRange(e.target.value ? (e.target.value as AgeRange) : undefined)
            }
          >
            <option value="">不指定</option>
            {ageKeys.map((key) => (
              <option key={key} value={key}>
                {AGE_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
        <div className="my-conditions-field">
          <label htmlFor="my-edu-select">我的學歷</label>
          <select
            id="my-edu-select"
            value={myEducation || ''}
            onChange={(e) =>
              setMyEducation(e.target.value ? (e.target.value as Education) : undefined)
            }
          >
            <option value="">不指定</option>
            {eduKeys.map((key) => (
              <option key={key} value={key}>
                {EDUCATION_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

/* ---- ChipGroup ---- */

interface ChipGroupProps<T extends string> {
  title: string;
  icon: string;
  labels: Record<T, string>;
  selected: T[];
  onToggle: (value: T) => void;
  onSetAll?: (values: T[]) => void;
  percentage: number;
  sectionId: string;
  hint?: string;
}

function ChipGroup<T extends string>({
  title,
  icon,
  labels,
  selected,
  onToggle,
  onSetAll,
  percentage,
  sectionId,
  hint,
}: ChipGroupProps<T>) {
  const keys = Object.keys(labels) as T[];
  const showPercent = selected.length > 0;

  const handleSelectAll = () => onSetAll && onSetAll(keys);
  const handleInvert = () => {
    if (!onSetAll) return;
    const newSelected = keys.filter((k) => !selected.includes(k));
    onSetAll(newSelected);
  };
  const handleClear = () => onSetAll && onSetAll([]);

  return (
    <div className="filter-section" id={sectionId}>
      <div className="filter-section__header">
        <span className="filter-section__icon">{icon}</span>
        <div className="filter-section__title-container">
          <span className="filter-section__title">{title}</span>
          {hint && <span className="filter-section__hint filter-section__hint--inline">{hint}</span>}
        </div>
        
        {onSetAll && (
          <div className="filter-section__quick-actions">
            <button onClick={handleSelectAll} title="全選所有選項">全選</button>
            <button onClick={handleInvert} title="反向選取">反選</button>
            <button onClick={handleClear} title="清除選取">清除</button>
          </div>
        )}

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

      <MyConditionsSection />

      <div className="filter-panel__global-hint">
        *不選表示包含全部條件
      </div>

      <ChipGroup<AgeRange>
        title="年齡區間"
        icon="🎂"
        labels={AGE_LABELS}
        selected={store.ageRanges}
        onToggle={store.toggleAgeRange}
        onSetAll={(vals) => store.setField('ageRanges', vals)}
        percentage={store.result.dimensionPercentages.age}
        sectionId="filter-age"
      />

      <ChipGroup<HeightRange>
        title="身高條件"
        icon="📏"
        labels={HEIGHT_LABELS}
        selected={store.heightRanges}
        onToggle={store.toggleHeightRange}
        onSetAll={(vals) => store.setField('heightRanges', vals)}
        percentage={store.result.dimensionPercentages.height}
        sectionId="filter-height"
      />

      <ChipGroup<WeightRange>
        title="體重條件"
        icon="⚖️"
        labels={WEIGHT_LABELS}
        selected={store.weightRanges}
        onToggle={store.toggleWeightRange}
        onSetAll={(vals) => store.setField('weightRanges', vals)}
        percentage={store.result.dimensionPercentages.weight}
        sectionId="filter-weight"
      />

      <ChipGroup<Education>
        title="教育程度"
        icon="🎓"
        labels={EDUCATION_LABELS}
        selected={store.educations}
        onToggle={store.toggleEducation}
        onSetAll={(vals) => store.setField('educations', vals)}
        percentage={store.result.dimensionPercentages.education}
        sectionId="filter-education"
      />

      <ChipGroup<IncomeRange>
        title="月收入"
        icon="💰"
        labels={INCOME_LABELS}
        selected={store.incomeRanges}
        onToggle={store.toggleIncomeRange}
        onSetAll={(vals) => store.setField('incomeRanges', vals)}
        percentage={store.result.dimensionPercentages.income}
        sectionId="filter-income"
      />

      <ChipGroup<Industry>
        title="產業 / 職業"
        icon="💼"
        labels={INDUSTRY_LABELS}
        selected={store.industries}
        onToggle={store.toggleIndustry}
        onSetAll={(vals) => store.setField('industries', vals)}
        percentage={store.result.dimensionPercentages.industry}
        sectionId="filter-industry"
      />

      <ChipGroup<MarriageStatus>
        title="婚姻狀態"
        icon="💍"
        labels={MARRIAGE_LABELS}
        selected={store.marriageStatuses}
        onToggle={store.toggleMarriageStatus}
        onSetAll={(vals) => store.setField('marriageStatuses', vals)}
        percentage={store.result.dimensionPercentages.marriage}
        sectionId="filter-marriage"
      />

      <ChipGroup<Region>
        title="居住區域"
        icon="📍"
        labels={REGION_LABELS}
        selected={store.regions}
        onToggle={store.toggleRegion}
        onSetAll={(vals) => store.setField('regions', vals)}
        percentage={store.result.dimensionPercentages.region}
        sectionId="filter-region"
      />

      <ChipGroup<Zodiac>
        title="星座"
        icon="🌟"
        labels={ZODIAC_LABELS}
        selected={store.zodiacs}
        onToggle={store.toggleZodiac}
        onSetAll={(vals) => store.setField('zodiacs', vals)}
        percentage={store.result.dimensionPercentages.zodiac}
        sectionId="filter-zodiac"
      />

      <ChipGroup<MBTIType>
        title="MBTI 人格"
        icon="🧠"
        labels={MBTI_LABELS}
        selected={store.mbtis}
        onToggle={store.toggleMbti}
        onSetAll={(vals) => store.setField('mbtis', vals)}
        percentage={store.result.dimensionPercentages.mbti}
        sectionId="filter-mbti"
      />
    </aside>
  );
};
