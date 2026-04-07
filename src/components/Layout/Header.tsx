import React from 'react';
import { useFilterStore } from '../../store/useFilterStore';

export const Header: React.FC = () => {
  const resetAll = useFilterStore((s) => s.resetAll);

  return (
    <header className="app-header" id="app-header">
      <div className="app-header__brand">
        <span className="app-header__icon">🏮</span>
        <h1 className="app-header__title">
          <span className="gradient-text">月老</span>
          <span className="app-header__subtitle">Yue Lao — 台灣人口統計視覺化分析</span>
        </h1>
      </div>
      <div className="app-header__actions">
        <button className="btn-reset" onClick={resetAll} id="btn-reset-all">
          <span>↻</span>
          <span>重設條件</span>
        </button>
      </div>
    </header>
  );
};
