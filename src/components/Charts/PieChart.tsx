import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useFilterStore } from '../../store/useFilterStore';
import { GENDER_LABELS } from '../../engine/types';

export const PieChart: React.FC = () => {
  const result = useFilterStore((s) => s.result);
  const gender = useFilterStore((s) => s.gender);

  const matchPct = result.finalPercentage * 100;
  const otherPct = 100 - matchPct;
  const genderLabel = GENDER_LABELS[gender];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item' as const,
      formatter: '{b}: {d}%',
    },
    legend: {
      bottom: 10,
      textStyle: {
        color: 'rgba(240,240,245,0.6)',
        fontFamily: 'Noto Sans TC, Inter, sans-serif',
        fontSize: 12,
      },
    },
    series: [
      {
        name: '人口佔比',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: 'rgba(15, 15, 26, 0.8)',
          borderWidth: 3,
        },
        label: {
          show: true,
          color: '#f0f0f5',
          fontSize: 13,
          fontFamily: 'Noto Sans TC, Inter, sans-serif',
          formatter: (params: { name: string; percent: number }) => {
            return `${params.name}\n${params.percent}%`;
          },
        },
        emphasis: {
          label: { fontSize: 16, fontWeight: 'bold' as const },
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(231, 76, 60, 0.4)',
          },
        },
        data: [
          {
            value: +matchPct.toFixed(6),
            name: `符合條件的${genderLabel}`,
            itemStyle: {
              color: {
                type: 'linear' as const,
                x: 0, y: 0, x2: 1, y2: 1,
                colorStops: [
                  { offset: 0, color: '#e74c3c' },
                  { offset: 1, color: '#f39c12' },
                ],
              },
            },
          },
          {
            value: +otherPct.toFixed(6),
            name: '其他成年人口',
            itemStyle: {
              color: 'rgba(255,255,255,0.08)',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="glass-card chart-card" id="chart-pie">
      <div className="chart-card__title">
        <span>🥧</span> 全台成年人口佔比
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
