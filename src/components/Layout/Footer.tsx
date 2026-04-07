import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer" id="app-footer">
      <p>
        📊 數據來源：內政部戶政司、衛福部國健署、行政院主計總處（2023-2024）
      </p>
      <p>
        ⚠️ 交叉分析結果為統計推估值，各條件假設為獨立分布。實際數據可能因相關性而有差異。
      </p>
      <p>
        🏮 月老 Yue Lao — 用數據看見緣分的機率
      </p>
    </footer>
  );
};
