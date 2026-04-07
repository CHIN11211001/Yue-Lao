import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useFilterStore } from '../../store/useFilterStore';

export const BarChart: React.FC = () => {
  const result = useFilterStore((s) => s.result);
  const dims = result.dimensionPercentages;

  const categories = ['性別', '年齡', '身高', '體重', '學歷', '收入', '產業', '婚姻', '區域', '星座', 'MBTI'];
  const values = [
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
  ];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const },
      formatter: (params: Array<{ name: string; value: number }>) => {
        const p = params[0];
        return `${p.name}：${p.value.toFixed(1)}%`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%', // 增加底部空間以容納旋轉的標籤
      top: '8%',
      containLabel: true,
    },
    xAxis: {
      type: 'category' as const,
      data: categories,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: {
        color: 'rgba(240,240,245,0.6)',
        fontSize: 11,
        fontFamily: 'Noto Sans TC, Inter, sans-serif',
        interval: 0,
        rotate: 30, // 旋轉標籤避免重疊
      },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value' as const,
      max: 100,
      axisLine: { show: false },
      axisLabel: {
        color: 'rgba(240,240,245,0.4)',
        fontSize: 11,
        formatter: '{value}%',
      },
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.05)' },
      },
    },
    series: [
      {
        name: '覆蓋比例',
        type: 'bar',
        barWidth: '60%',
        data: values.map((v, i) => ({
          value: +v.toFixed(2),
          itemStyle: {
            color: {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `hsl(${0 + i * 5}, 75%, 60%)` },
                { offset: 1, color: `hsl(${20 + i * 5}, 80%, 35%)` },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
        })),
        animationDuration: 800,
        animationEasing: 'cubicOut' as const,
      },
    ],
  };

  return (
    <div className="glass-card chart-card" id="chart-bar">
      <div className="chart-card__title">
        <span>📊</span> 各維度覆蓋比例
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
