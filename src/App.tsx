import React from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { FilterPanel } from './components/FilterPanel/FilterPanel';
import { ResultSummary } from './components/Charts/ResultSummary';
import { FunnelChart } from './components/Charts/FunnelChart';
import { PieChart } from './components/Charts/PieChart';
import { BarChart } from './components/Charts/BarChart';
import { RadarChart } from './components/Charts/RadarChart';

const App: React.FC = () => {
  return (
    <div className="app-layout" id="app-root">
      <Header />
      <main className="app-main" id="app-main">
        <FilterPanel />
        <section className="charts-area" id="charts-area">
          <ResultSummary />
          <FunnelChart />
          <div className="chart-grid">
            <PieChart />
            <RadarChart />
            <BarChart />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
