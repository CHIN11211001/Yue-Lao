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

interface InfoTooltipProps {
  label: string;
  content: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ label, content }) => {
  return (
    <span className="info-tooltip">
      <button
        type="button"
        className="info-tooltip__trigger"
        aria-label={label}
      >
        i
      </button>
      <span className="info-tooltip__bubble" role="tooltip">
        {content}
      </span>
    </span>
  );
};

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
        <div className="filter-section__title-container">
          <div className="filter-section__title-row">
            <span className="filter-section__title">我的條件</span>
            <InfoTooltip
              label="我的條件說明"
              content="這兩個欄位會作為條件機率表的上游條件，影響年齡配對、學歷配對，以及收入和產業的 CPT 計算。"
            />
          </div>
          <span className="filter-section__hint filter-section__hint--inline">（可選，啟用婚配分析）</span>
        </div>
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
  tooltip?: string;
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
  tooltip,
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
          <div className="filter-section__title-row">
            <span className="filter-section__title">{title}</span>
            {tooltip && (
              <InfoTooltip
                label={`${title} 說明`}
                content={tooltip}
              />
            )}
          </div>
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
        tooltip="若有設定「我的年齡層」，這裡會使用年齡配對 CPT 來估算對方年齡分布，而不是直接用全體年齡平均。"
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
        tooltip="使用 P(身高 | 年齡, 性別) 的條件機率表。第一版依 2013-2016 國民營養調查的年齡別身高常模估算，所以不同年齡層會對應不同的身高分布。"
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
        tooltip="使用 P(體重 | 身高, 年齡, 性別) 的條件機率表。也就是會先看年齡對身高的影響，再看該身高下的體重分布；體重不再和身高當成彼此獨立。第一版以 BMI 表為中介，再用年齡別體重常模校準整體分布。"
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
        tooltip="若有設定「我的學歷」，這裡會使用學歷配對 CPT 估算對方學歷分布。"
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
        tooltip="使用 P(收入 | 年齡, 學歷, 性別) 的條件機率表。現階段以官方收入分布為基底，再按年齡與學歷趨勢做 heuristic 校準。"
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
        tooltip="使用 P(產業 | 年齡, 學歷, 性別) 的條件機率表。現階段以行業別統計為基底，再按年齡與學歷趨勢做 heuristic 校準。"
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
        tooltip="使用 P(婚姻狀態 | 年齡, 性別) 的條件機率表加權。若你有先選年齡區間，婚姻比例會跟著那組年齡條件變動。"
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
