import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useFilterStore } from '../../store/useFilterStore';

export const RadarChart: React.FC = () => {
  const result = useFilterStore((s) => s.result);
  const dims = result.dimensionPercentages;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item' as const,
    },
    radar: {
      indicator: [
        { name: '性別', max: 100 },
        { name: '年齡', max: 100 },
        { name: '身高', max: 100 },
        { name: '體重', max: 100 },
        { name: '學歷', max: 100 },
        { name: '收入', max: 100 },
        { name: '產業', max: 100 },
        { name: '婚姻', max: 100 },
        { name: '區域', max: 100 },
        { name: '星座', max: 100 },
        { name: 'MBTI', max: 100 },
      ],
      shape: 'polygon' as const,
      splitNumber: 4,
      radius: '65%',
      axisName: {
        color: 'rgba(240,240,245,0.7)',
        fontSize: 11,
        fontFamily: 'Noto Sans TC, Inter, sans-serif',
      },
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.08)' },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'],
        },
      },
      axisLine: {
        lineStyle: { color: 'rgba(255,255,255,0.1)' },
      },
    },
    series: [
      {
        name: '條件選擇覆蓋率',
        type: 'radar',
        data: [
          {
            value: [
              dims.gender * 100,
              dims.age * 100,
              dims.height * 100,
              dims.weight * 100,
              dims.education * 100,
              dims.income * 100,
              dims.industry * 100,
              dims.marriage * 100,
              dims.region * 100,
              dims.zodiac * 100,
              dims.mbti * 100,
            ],
            name: '覆蓋率',
            areaStyle: {
              color: {
                type: 'radial' as const,
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  { offset: 0, color: 'rgba(231, 76, 60, 0.4)' },
                  { offset: 1, color: 'rgba(243, 156, 18, 0.1)' },
                ],
              },
            },
            lineStyle: {
              color: '#e74c3c',
              width: 2,
            },
            itemStyle: {
              color: '#f39c12',
              borderColor: '#e74c3c',
              borderWidth: 2,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="glass-card chart-card" id="chart-radar">
      <div className="chart-card__title">
        <span>🎯</span> 條件覆蓋率雷達圖
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
