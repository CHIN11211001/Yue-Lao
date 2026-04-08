import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useFilterStore } from '../../store/useFilterStore';

export const FunnelChart: React.FC = () => {
  const result = useFilterStore((s) => s.result);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: { name: string; value: number; data: { population: number; conditionalPercentage?: number } }) => {
        let text = `${params.name}<br/>`;
        text += `實體比例：${params.value.toFixed(4)}%<br/>`;
        text += `預估人數：${params.data.population.toLocaleString()} 人`;
        if (params.data.conditionalPercentage !== undefined && params.data.conditionalPercentage !== params.value / 100) {
           text += `<br/><br/><i>💡 婚配契合機率：${(params.data.conditionalPercentage * 100).toFixed(4)}%</i>`;
        }
        return text;
      },
    },
    series: [
      {
        name: '條件篩選漏斗',
        type: 'funnel',
        left: '10%',
        top: 10,
        bottom: 10,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '2%',
        maxSize: '100%',
        sort: 'descending' as const,
        gap: 4,
        label: {
          show: true,
          position: 'inside' as const,
          color: '#f0f0f5',
          fontSize: 12,
          fontFamily: 'Noto Sans TC, Inter, sans-serif',
          formatter: (params: { name: string; value: number; data: { conditionalPercentage?: number } }) => {
            const hasCondDiff = params.data.conditionalPercentage !== undefined && Math.abs(params.data.conditionalPercentage * 100 - params.value) > 0.001;
            return hasCondDiff 
              ? `${params.name} ${params.value.toFixed(2)}% | 契合 ${(params.data.conditionalPercentage! * 100).toFixed(1)}%`
              : `${params.name} ${params.value.toFixed(2)}%`;
          },
        },
        labelLine: {
          length: 10,
          lineStyle: { width: 1, type: 'solid' as const },
        },
        itemStyle: {
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
        },
        emphasis: {
          label: { fontSize: 14 },
        },
        data: result.funnelSteps.map((step, idx) => ({
          value: +(step.percentage * 100).toFixed(4),
          name: step.label,
          population: step.population,
          conditionalPercentage: step.conditionalPercentage,
          itemStyle: {
            color: {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: `hsl(${0 + idx * 8}, 75%, ${55 - idx * 4}%)` },
                { offset: 1, color: `hsl(${30 + idx * 8}, 80%, ${50 - idx * 3}%)` },
              ],
            },
          },
        })),
      },
    ],
  };

  return (
    <div className="glass-card chart-card chart-card--wide" id="chart-funnel">
      <div className="chart-card__title">
        <span>🔻</span> 條件篩選漏斗圖
      </div>
      <div className="chart-card__body">
        <ReactECharts
          option={option}
          style={{ width: '100%', height: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
};
