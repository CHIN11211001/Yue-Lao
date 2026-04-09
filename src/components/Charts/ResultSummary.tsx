import React from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import {
  probabilityToDescription,
  probabilityToRatio,
} from '../../engine/probability';

export const ResultSummary: React.FC = () => {
  const result = useFilterStore((s) => s.result);

  const pct = result.finalPercentage * 100;
  let pctStr = '0';
  if (pct >= 1) {
    pctStr = pct.toFixed(1);
  } else if (pct >= 0.01) {
    pctStr = pct.toFixed(3);
  } else if (pct > 0) {
    pctStr = pct.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
    if (pctStr === '0') pctStr = '< 0.000001';
  }

  const popStr = result.estimatedPopulation.toLocaleString('zh-TW');
  const desc = probabilityToDescription(result.physicalPercentage);
  const ratio = probabilityToRatio(result.physicalPercentage);

  const isMatchDiverged = Math.abs(result.finalPercentage - result.physicalPercentage) > 0.0000001;
  const labelText = isMatchDiverged ? '婚配契合機率' : '符合條件比例';

  return (
    <div className="result-summary-wrap" id="result-summary">
      <div className="result-summary">
        <div className="glass-card result-card" id="result-card-percentage">
          <div className="result-card__label">{labelText}</div>
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
          <div className="result-card__subtitle">人（全台預估人數）</div>
        </div>

        <div className="glass-card result-card" id="result-card-ratio">
          <div className="result-card__label">稀有度</div>
          <div className="result-card__value result-card__value--red">
            {ratio}
          </div>
          <div className="result-card__subtitle">機率指標</div>
        </div>
      </div>

      <div className="result-summary-note">
        體重條件已納入身高相關性，現以 `P(體重 | 身高, 年齡, 性別)` 估算，不再把身高與體重視為獨立條件。
      </div>
    </div>
  );
};
