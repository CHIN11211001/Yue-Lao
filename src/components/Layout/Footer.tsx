import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer" id="app-footer">
      <p>
        📊 數據來源：內政部戶政司、衛福部國健署、行政院主計總處（2023-2024）<br />
        📚 人口普查來源：<a href="https://www.stat.gov.tw/News_Content.aspx?Create=1&n=2752&state=1327FD6AD8DCDA52&s=230649&ccms_cs=1&sms=11064" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-primary)', textDecoration: 'underline' }}>109年人口及住宅普查總報告提要分析</a><br />
        🔗 婚配分析來源：<a href="https://www.moi.gov.tw/News_Content.aspx?n=2905&s=328924" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-primary)', textDecoration: 'underline' }}>114年第25週內政統計通報（婚姻階梯）</a>
      </p>
      <p>
        ⚠️ 交叉分析結果為統計推估值。目前已對年齡、學歷、婚姻、收入、產業做部分條件化，其餘維度仍可能因相關性而有誤差。
      </p>
      <p>
        🏮 月老 Yue Lao — 用數據看見緣分的機率
      </p>
      <p style={{ marginTop: '0.8rem' }}>
        <a 
          href="https://github.com/CHIN11211001/Yue-Lao" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <svg style={{ width: '1em', height: '1em', verticalAlign: '-0.125em', marginRight: '0.3em' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub Repository
        </a>
      </p>
    </footer>
  );
};
