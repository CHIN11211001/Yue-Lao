import React from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import {
  probabilityToDescription,
  probabilityToRatio,
} from '../../engine/probability';

export const ResultSummary: React.FC = () => {
  const result = useFilterStore((s) => s.result);

  const pct = result.finalPercentage * 100;
  const pctStr =
    pct >= 1 ? pct.toFixed(1) : pct >= 0.01 ? pct.toFixed(3) : pct.toExponential(2);

  const popStr = result.estimatedPopulation.toLocaleString('zh-TW');
  const desc = probabilityToDescription(result.finalPercentage);
  const ratio = probabilityToRatio(result.finalPercentage);

  return (
    <div className="result-summary" id="result-summary">
      <div className="glass-card result-card" id="result-card-percentage">
        <div className="result-card__label">符合條件比例</div>
        <div className="result-card__value result-card__value--gradient">
          {pctStr}%
        </div>
        <div className="result-card__subtitle">{desc}</div>
      </div>

      <div className="glass-card result-card" id="result-card-population">
        <div className="result-card__label">預估符合人數</div>
        <div className="result-card__value result-card__value--gold">
          {popStr}
        </div>
        <div className="result-card__subtitle">人（全台成年人口）</div>
      </div>

      <div className="glass-card result-card" id="result-card-ratio">
        <div className="result-card__label">稀有度</div>
        <div className="result-card__value result-card__value--red">
          {ratio}
        </div>
        <div className="result-card__subtitle">機率指標</div>
      </div>
    </div>
  );
};
