const fmt = n => n == null ? '-' : n.toLocaleString('ko-KR');
const fmtM = n => n == null ? '-' : (n / 10000).toFixed(0) + '만';
const fmtPct = (cur, prev) => {
  if (!prev || prev === 0) return '-';
  const pct = ((cur - prev) / prev * 100).toFixed(1);
  return pct > 0 ? `+${pct}%` : `${pct}%`;
};
const isUp = (cur, prev) => prev && cur > prev;
const normalizeSellerName = name => (name || '').toLowerCase().replace(/\s+/g, '');

function findCommissionRule(name) {
  if (typeof overseasCommissionConfig === 'undefined') return null;
  const normalized = normalizeSellerName(name);
  return overseasCommissionConfig.sellers.find(rule => normalizeSellerName(rule.name) === normalized);
}

function getSellerCommissionRate(seller) {
  const rule = findCommissionRule(seller.name);
  if (rule?.subSellerRates && seller.current?.subSellers?.length) {
    const amount = seller.current.subSellers.reduce((sum, row) => sum + (row.amount || 0), 0);
    if (amount > 0) {
      const commission = seller.current.subSellers.reduce((sum, row) => {
        const subRule = rule.subSellerRates.find(r => normalizeSellerName(r.name) === normalizeSellerName(row.name))
          || rule.subSellerRates.find(r => r.name === '*');
        return sum + (row.amount || 0) * ((subRule?.rate || overseasCommissionConfig.defaultRate) / 100);
      }, 0);
      return commission / amount * 100;
    }
  }

  const defaultRate = typeof overseasCommissionConfig === 'undefined' ? 0 : overseasCommissionConfig.defaultRate;
  return rule?.rate ?? rule?.fallbackRate ?? defaultRate ?? 0;
}

function getSellerCommissionAmount(seller) {
  const amount = seller.current?.amount || 0;
  return Math.round(amount * getSellerCommissionRate(seller) / 100);
}

function getOverseasCommissionSummary(overseas) {
  if (!overseas?.sellers?.length) return { amount: 0, commission: 0, net: 0 };
  const amount = overseas.sellers.reduce((sum, seller) => sum + (seller.current?.amount || 0), 0);
  const commission = overseas.sellers.reduce((sum, seller) => sum + getSellerCommissionAmount(seller), 0);
  return { amount, commission, net: amount - commission };
}

let currentChart1 = null;
let currentChart2 = null;
let currentChart3 = null;
const visibleWeeklyReports = () => weeklyReports.filter(w => w.id >= '2026-W18');

function destroyCharts() {
  [currentChart1, currentChart2, currentChart3].forEach(c => { if (c) c.destroy(); });
  currentChart1 = currentChart2 = currentChart3 = null;
}

// 탭 생성
function initTabs() {
  const weeklyDiv = document.getElementById('weeklyTabs');
  // 마감 탭
  const closingDiv = document.getElementById('closingTabs');
  Object.keys(monthlyClosing).sort().reverse().forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.textContent = key.substring(5) + '월 마감';
    btn.onclick = () => showClosing(key);
    closingDiv.appendChild(btn);
  });

  visibleWeeklyReports().slice().reverse().forEach((w, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.textContent = w.label;
    btn.onclick = () => showWeekly(w.id);
    weeklyDiv.appendChild(btn);
  });
}

function setActiveTab(label) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    if (b.textContent === label) b.classList.add('active');
  });
}

// 주차별 보기
function showWeekly(id) {
  destroyCharts();
  const w = weeklyReports.find(r => r.id === id);
  if (!w) return;
  setActiveTab(w.label);
  document.getElementById('headerSubtitle').textContent = w.period;

  const totalWoW = fmtPct(w.total.revenue, w.total.prevWeek);
  const totalYoY = fmtPct(w.total.revenue, w.total.prevYear);
  const coupangGmvText = w.coupangGmv ? ` | 쿠팡 Ads 확인 매출 <strong>${fmt(w.coupangGmv.revenue)}원</strong>` : '';
  const overseasSummary = getOverseasCommissionSummary(w.overseas);

  let html = `
    <div class="summary-banner">
      <div class="label">주간 총매출</div>
      <div class="big-number">${fmt(w.total.revenue)}원</div>
      <div class="sub">전주대비 <strong>${totalWoW}</strong> | 전년대비 <strong>${totalYoY}</strong>${coupangGmvText}</div>
    </div>

    <div class="kpi-grid">
      ${w.channels.map(ch => {
        const wow = fmtPct(ch.revenue, ch.prevWeek);
        const cls = isUp(ch.revenue, ch.prevWeek) ? 'up' : 'down';
        return `<div class="kpi-card">
          <div class="channel">${ch.name}</div>
          <div class="amount">${fmtM(ch.revenue)}원</div>
          <div class="change ${cls}">${wow}</div>
          <div class="ratio">비중 ${ch.ratio}%</div>
        </div>`;
      }).join('')}
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">채널별 매출 비중</div>
        <div class="card-body"><div class="chart-container"><canvas id="pieChart"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header">자사몰 일별 추이</div>
        <div class="card-body"><div class="chart-container"><canvas id="dailyChart"></canvas></div></div>
      </div>
    </div>

    ${w.overseas ? `<div class="card">
      <div class="card-header">해외 수출 현황 <span style="font-size:12px; color:var(--text-light); font-weight:400;">(당월 1일~주차 끝 · 전월/전년 동일 기간 · 이지어드민)</span></div>
      <div class="card-body">
        <table>
          <tr><th>판매처</th><th>당월</th><th>판매금액</th><th>수수료율</th><th>수수료</th><th>차감 후</th><th>전월</th><th>전월대비</th><th>전년</th><th>전년대비</th></tr>
          ${w.overseas.sellers.map(s => `<tr>
            <td>${s.name}</td>
            <td class="num">${fmt(s.current.qty)}개</td>
            <td class="num">${fmt(s.current.amount)}원</td>
            <td class="center">${getSellerCommissionRate(s).toFixed(1)}%</td>
            <td class="num">${fmt(getSellerCommissionAmount(s))}원</td>
            <td class="num">${fmt((s.current.amount || 0) - getSellerCommissionAmount(s))}원</td>
            <td class="num">${s.prevMonth ? fmt(s.prevMonth.qty) + '개' : '-'}</td>
            <td class="center">${s.prevMonth ? `<span class="badge ${isUp(s.current.qty, s.prevMonth.qty) ? 'badge-up' : 'badge-down'}">${fmtPct(s.current.qty, s.prevMonth.qty)}</span>` : '-'}</td>
            <td class="num">${s.prevYear ? fmt(s.prevYear.qty) + '개' : '-'}</td>
            <td class="center">${s.prevYear ? `<span class="badge ${isUp(s.current.qty, s.prevYear.qty) ? 'badge-up' : 'badge-down'}">${fmtPct(s.current.qty, s.prevYear.qty)}</span>` : '<span style="color:var(--text-light)">N/A</span>'}</td>
          </tr>`).join('')}
          <tr class="total-row">
            <td>합계</td>
            <td class="num">${fmt(w.overseas.total.qty)}개</td>
            <td class="num">${fmt(overseasSummary.amount)}원</td>
            <td class="center">${overseasSummary.amount ? (overseasSummary.commission / overseasSummary.amount * 100).toFixed(1) + '%' : '-'}</td>
            <td class="num">${fmt(overseasSummary.commission)}원</td>
            <td class="num">${fmt(overseasSummary.net)}원</td>
            <td class="num">${fmt(w.overseas.total.prevMonth.qty)}개</td>
            <td class="center"><span class="badge ${isUp(w.overseas.total.qty, w.overseas.total.prevMonth.qty) ? 'badge-up' : 'badge-down'}">${fmtPct(w.overseas.total.qty, w.overseas.total.prevMonth.qty)}</span></td>
            <td class="num">${w.overseas.total.prevYear ? fmt(w.overseas.total.prevYear.qty) + '개' : '-'}</td>
            <td class="center">${w.overseas.total.prevYear ? `<span class="badge ${isUp(w.overseas.total.qty, w.overseas.total.prevYear.qty) ? 'badge-up' : 'badge-down'}">${fmtPct(w.overseas.total.qty, w.overseas.total.prevYear.qty)}</span>` : '-'}</td>
          </tr>
        </table>
      </div>
    </div>` : ''}

    <div class="card">
      <div class="card-header">자사몰 판매 TOP 10 (Cafe24 API)</div>
      <div class="card-body">
        <table>
          <tr><th style="width:40px">#</th><th>상품</th><th>수량</th><th>금액</th></tr>
          ${w.cafe24Top10.map(p => `<tr><td class="center">${p.rank}</td><td>${p.name}</td><td class="num">${p.qty}개</td><td class="num">${fmt(p.amount)}원</td></tr>`).join('')}
        </table>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">주요 인사이트</div>
        <div class="card-body">
          <ul class="insight-list">
            ${w.insights.good.map(t => `<li class="good">${t}</li>`).join('')}
            ${w.insights.check.map(t => `<li class="check">${t}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="card">
        <div class="card-header">확인 / 판단</div>
        <div class="card-body">
          ${w.status.map(s => `<div class="status-row">
            <span class="status-tag ${s.type === 'confirmed' ? 'status-confirmed' : 'status-judgment'}">${s.type === 'confirmed' ? '확인됨' : '판단'}</span>
            <span>${s.text}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">차주 계획</div>
      <div class="card-body">
        <div class="plan-highlight">우선 진행: ${w.nextWeek.products}</div>
        ${w.nextWeek.issues.map(i => `<div class="plan-item">${i}</div>`).join('')}
      </div>
    </div>
  `;

  document.getElementById('content').innerHTML = html;

  // 파이 차트
  currentChart1 = new Chart(document.getElementById('pieChart'), {
    type: 'doughnut',
    data: {
      labels: w.channels.map(c => c.name),
      datasets: [{ data: w.channels.map(c => c.revenue), backgroundColor: ['#E74C3C','#2F5496','#27AE60','#9B59B6','#F39C12'], borderWidth: 2 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 12 } } } } }
  });

  // 일별 차트
  currentChart2 = new Chart(document.getElementById('dailyChart'), {
    type: 'bar',
    data: {
      labels: w.cafe24Daily.map(d => d.day + '\n' + d.date),
      datasets: [{ label: '자사몰 매출', data: w.cafe24Daily.map(d => d.revenue), backgroundColor: '#4472C4', borderRadius: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => (v/10000).toFixed(0) + '만' } } },
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => fmt(ctx.raw) + '원' } } }
    }
  });
}

// 월별 보기
function showMonthly(monthLabel) {
  destroyCharts();
  setActiveTab(monthLabel);
  const months = getMonthlyData();
  const m = months.find(x => x.label === monthLabel);
  if (!m) return;
  document.getElementById('headerSubtitle').textContent = monthLabel + ' 월간 종합';

  let html = `
    <div class="summary-banner">
      <div class="label">${monthLabel} 월간 총매출</div>
      <div class="big-number">${fmt(m.totalRevenue)}원</div>
      <div class="sub">${m.weeks.length}주간 누적</div>
    </div>
    <div class="card">
      <div class="card-header">채널별 월간 매출</div>
      <div class="card-body">
        <table>
          <tr><th>채널</th><th>매출</th><th>비중</th></tr>
          ${Object.entries(m.channels).sort((a,b) => b[1]-a[1]).map(([name, rev]) =>
            `<tr><td>${name}</td><td class="num">${fmt(rev)}원</td><td class="center">${(rev/m.totalRevenue*100).toFixed(1)}%</td></tr>`
          ).join('')}
          <tr class="total-row"><td>합계</td><td class="num">${fmt(m.totalRevenue)}원</td><td class="center">100%</td></tr>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header">주차별 매출 추이</div>
      <div class="card-body"><div class="chart-container"><canvas id="monthlyChart"></canvas></div></div>
    </div>
    <div class="card">
      <div class="card-header">주차별 상세</div>
      <div class="card-body">
        <table>
          <tr><th>주차</th><th>쿠팡</th><th>자사몰</th><th>스마트스토어</th><th>롯데온</th><th>합계</th><th>전주대비</th></tr>
          ${m.weeks.map(w => `<tr>
            <td>${w.label}</td>
            ${w.channels.map(c => `<td class="num">${fmtM(c.revenue)}</td>`).join('')}
            <td class="num" style="font-weight:700">${fmtM(w.total.revenue)}</td>
            <td class="center"><span class="badge ${isUp(w.total.revenue, w.total.prevWeek) ? 'badge-up' : 'badge-down'}">${fmtPct(w.total.revenue, w.total.prevWeek)}</span></td>
          </tr>`).join('')}
        </table>
      </div>
    </div>
  `;
  document.getElementById('content').innerHTML = html;

  currentChart1 = new Chart(document.getElementById('monthlyChart'), {
    type: 'bar',
    data: {
      labels: m.weeks.map(w => w.label),
      datasets: m.weeks[0].channels.map((ch, i) => ({
        label: ch.name,
        data: m.weeks.map(w => w.channels[i]?.revenue || 0),
        backgroundColor: ['#E74C3C','#2F5496','#27AE60','#9B59B6','#F39C12'][i],
        borderRadius: 4
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => (v/10000).toFixed(0)+'만' } } },
      plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + fmt(ctx.raw) + '원' } } }
    }
  });
}

// 월별 추이
function showTrend() {
  destroyCharts();
  setActiveTab('월별 추이');
  document.getElementById('headerSubtitle').textContent = '2026년 월별 매출 추이';

  const colors = ['#E74C3C','#2F5496','#27AE60','#9B59B6','#F39C12'];
  const channelNames = monthlyTrend[0].channels.map(c => c.name);

  let html = `
    <div class="card">
      <div class="card-header">월별 총매출 추이</div>
      <div class="card-body"><div class="trend-chart-container"><canvas id="trendChart"></canvas></div></div>
    </div>
    <div class="card">
      <div class="card-header">채널별 월매출 추이</div>
      <div class="card-body"><div class="trend-chart-container"><canvas id="channelTrendChart"></canvas></div></div>
    </div>
    <div class="card">
      <div class="card-header">월별 상세</div>
      <div class="card-body">
        <table>
          <tr><th>월</th><th>쿠팡</th><th>자사몰</th><th>스마트스토어</th><th>카카오</th><th>롯데온</th><th>합계</th><th>전월대비</th></tr>
          ${monthlyTrend.map((m, i) => {
            const prev = i > 0 ? monthlyTrend[i-1].total : null;
            return `<tr>
              <td>${m.month.substring(5)}월</td>
              ${m.channels.map(c => `<td class="num">${fmtM(c.revenue)}</td>`).join('')}
              <td class="num" style="font-weight:700">${fmtM(m.total)}</td>
              <td class="center">${prev ? `<span class="badge ${isUp(m.total, prev) ? 'badge-up' : 'badge-down'}">${fmtPct(m.total, prev)}</span>` : '-'}</td>
            </tr>`;
          }).join('')}
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header">채널 비중 변화</div>
      <div class="card-body">
        <table>
          <tr><th>채널</th>${monthlyTrend.map(m => `<th>${m.month.substring(5)}월</th>`).join('')}<th>변화(1→3월)</th></tr>
          ${channelNames.map(name => {
            const ratios = monthlyTrend.map(m => {
              const ch = m.channels.find(c => c.name === name);
              return ch ? (ch.revenue / m.total * 100) : 0;
            });
            const diff = ratios[ratios.length-1] - ratios[0];
            return `<tr>
              <td>${name}</td>
              ${ratios.map(r => `<td class="center">${r.toFixed(1)}%</td>`).join('')}
              <td class="center"><span class="badge ${diff > 0 ? 'badge-up' : 'badge-down'}">${diff > 0 ? '+' : ''}${diff.toFixed(1)}p</span></td>
            </tr>`;
          }).join('')}
        </table>
      </div>
    </div>
  `;
  document.getElementById('content').innerHTML = html;

  // 총매출 추이
  currentChart1 = new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
      labels: monthlyTrend.map(m => m.month.substring(5) + '월'),
      datasets: [{
        label: '월간 총매출',
        data: monthlyTrend.map(m => m.total),
        borderColor: '#2F5496',
        backgroundColor: 'rgba(47,84,150,0.1)',
        fill: true, tension: 0.3, pointRadius: 8, pointBackgroundColor: '#2F5496',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => (v/100000000).toFixed(1)+'억' } } },
      plugins: {
        tooltip: { callbacks: { label: ctx => fmt(ctx.raw) + '원' } },
        legend: { display: false }
      }
    }
  });

  // 채널별 추이 (스택 바)
  currentChart2 = new Chart(document.getElementById('channelTrendChart'), {
    type: 'bar',
    data: {
      labels: monthlyTrend.map(m => m.month.substring(5) + '월'),
      datasets: channelNames.map((name, i) => ({
        label: name,
        data: monthlyTrend.map(m => m.channels[i]?.revenue || 0),
        backgroundColor: colors[i],
        borderRadius: 4
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => (v/100000000).toFixed(1)+'억' } } },
      plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + fmt(ctx.raw) + '원' } } }
    }
  });
}

// 마감 보고서
function showClosing(key) {
  destroyCharts();
  const c = monthlyClosing[key];
  if (!c) return;
  setActiveTab(key.substring(5) + '월 마감');
  document.getElementById('headerSubtitle').textContent = c.period;

  const colors = ['#E74C3C','#2F5496','#27AE60','#9B59B6','#F39C12'];
  const [closingYear, closingMonth] = key.split('-').map(Number);
  const prevMonthDate = new Date(closingYear, closingMonth - 2, 1);
  const currentLabel = `${closingYear}.${closingMonth}`;
  const prevMonthLabel = `${prevMonthDate.getFullYear()}.${prevMonthDate.getMonth() + 1}`;
  const prevYearLabel = `${closingYear - 1}.${closingMonth}`;
  const coupangGmvText = c.coupangGmv ? ` | 쿠팡 Ads 확인 매출 <strong>${fmt(c.coupangGmv.revenue)}원</strong>` : '';
  const overseasSummary = getOverseasCommissionSummary(c.overseas);

  let html = `
    <div class="summary-banner">
      <div class="label">${c.label}</div>
      <div class="big-number">${fmt(c.total.revenue)}원</div>
      <div class="sub">전월대비 <strong>${fmtPct(c.total.revenue, c.total.prevMonth)}</strong> | 전년대비 <strong>${fmtPct(c.total.revenue, c.total.prevYear)}</strong>${coupangGmvText}</div>
    </div>

    <div class="kpi-grid">
      ${c.channels.map(ch => {
        const mom = fmtPct(ch.revenue, ch.prevMonth);
        const yoy = fmtPct(ch.revenue, ch.prevYear);
        const ratio = (ch.revenue / c.total.revenue * 100).toFixed(1);
        const cls = isUp(ch.revenue, ch.prevMonth) ? 'up' : 'down';
        return `<div class="kpi-card">
          <div class="channel">${ch.name}</div>
          <div class="amount">${fmtM(ch.revenue)}원</div>
          <div class="change ${cls}">전월 ${mom}</div>
          <div class="ratio">비중 ${ratio}% | 전년 ${yoy}</div>
        </div>`;
      }).join('')}
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">채널별 매출 (전월·전년 비교)</div>
        <div class="card-body">
          <table>
            <tr><th>채널</th><th>${currentLabel}</th><th>${prevMonthLabel}</th><th>전월대비</th><th>${prevYearLabel}</th><th>전년대비</th></tr>
            ${c.channels.map(ch => `<tr>
              <td>${ch.name}</td>
              <td class="num">${fmt(ch.revenue)}</td>
              <td class="num">${fmt(ch.prevMonth)}</td>
              <td class="center"><span class="badge ${isUp(ch.revenue, ch.prevMonth) ? 'badge-up' : 'badge-down'}">${fmtPct(ch.revenue, ch.prevMonth)}</span></td>
              <td class="num">${fmt(ch.prevYear)}</td>
              <td class="center"><span class="badge ${isUp(ch.revenue, ch.prevYear) ? 'badge-up' : 'badge-down'}">${fmtPct(ch.revenue, ch.prevYear)}</span></td>
            </tr>`).join('')}
            <tr class="total-row">
              <td>합계</td>
              <td class="num">${fmt(c.total.revenue)}</td>
              <td class="num">${fmt(c.total.prevMonth)}</td>
              <td class="center"><span class="badge ${isUp(c.total.revenue, c.total.prevMonth) ? 'badge-up' : 'badge-down'}">${fmtPct(c.total.revenue, c.total.prevMonth)}</span></td>
              <td class="num">${fmt(c.total.prevYear)}</td>
              <td class="center"><span class="badge ${isUp(c.total.revenue, c.total.prevYear) ? 'badge-up' : 'badge-down'}">${fmtPct(c.total.revenue, c.total.prevYear)}</span></td>
            </tr>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header">채널 비중 변화 (전년 → 금년)</div>
        <div class="card-body">
          <table>
            <tr><th>채널</th><th>${prevYearLabel}</th><th>${currentLabel}</th><th>변화</th></tr>
            ${c.ratioChange.map(r => `<tr>
              <td>${r.name}</td>
              <td class="center">${r.prev.toFixed(1)}%</td>
              <td class="center">${r.current.toFixed(1)}%</td>
              <td class="center"><span class="badge ${r.change > 0 ? 'badge-up' : 'badge-down'}">${r.change > 0 ? '+' : ''}${r.change.toFixed(1)}p</span></td>
            </tr>`).join('')}
          </table>
          <div class="chart-container" style="height:220px; margin-top:16px;"><canvas id="ratioChart"></canvas></div>
        </div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">전월·전년 비교 차트</div>
        <div class="card-body"><div class="chart-container"><canvas id="compareChart"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header">채널 비중 (${currentLabel})</div>
        <div class="card-body"><div class="chart-container"><canvas id="closingPieChart"></canvas></div></div>
      </div>
    </div>

    ${c.weeklyTrend ? `
    <div class="card">
      <div class="card-header">주차별 매출 추이</div>
      <div class="card-body">
        <table>
          <tr><th>주차</th><th>쿠팡</th><th>자사몰</th><th>스마트스토어</th><th>카카오</th><th>롯데온</th><th>합계</th></tr>
          ${c.weeklyTrend.map((w, i) => {
            const prev = i > 0 ? c.weeklyTrend[i-1].total : null;
            const wow = prev ? fmtPct(w.total, prev) : '-';
            return `<tr>
              <td>${w.label}</td>
              <td class="num">${fmtM(w.coupang)}</td>
              <td class="num">${fmtM(w.cafe24)}</td>
              <td class="num">${fmtM(w.smartstore)}</td>
              <td class="num">${fmtM(w.kakao)}</td>
              <td class="num">${fmtM(w.lotteon)}</td>
              <td class="num" style="font-weight:700">${fmtM(w.total)} <span class="badge ${prev && w.total > prev ? 'badge-up' : 'badge-down'}" style="font-size:10px">${wow}</span></td>
            </tr>`;
          }).join('')}
        </table>
        <div class="chart-container" style="margin-top:16px;"><canvas id="weeklyTrendChart"></canvas></div>
      </div>
    </div>` : ''}

    ${c.overseas ? `
    <div class="card">
      <div class="card-header">해외 수출 현황 (월간) <span style="font-size:12px; color:var(--text-light); font-weight:400;">이지어드민 기준</span></div>
      <div class="card-body">
        <table>
          <tr><th>판매처</th><th>당월</th><th>판매금액</th><th>수수료율</th><th>수수료</th><th>차감 후</th><th>전월</th><th>전월대비</th><th>전년</th><th>전년대비</th></tr>
          ${c.overseas.sellers.map(s => `<tr>
            <td>${s.name}</td>
            <td class="num">${fmt(s.current.qty)}개</td>
            <td class="num">${fmt(s.current.amount)}원</td>
            <td class="center">${getSellerCommissionRate(s).toFixed(1)}%</td>
            <td class="num">${fmt(getSellerCommissionAmount(s))}원</td>
            <td class="num">${fmt((s.current.amount || 0) - getSellerCommissionAmount(s))}원</td>
            <td class="num">${s.prevMonth ? fmt(s.prevMonth.qty) + '개' : '-'}</td>
            <td class="center">${s.prevMonth ? `<span class="badge ${isUp(s.current.qty, s.prevMonth.qty) ? 'badge-up' : 'badge-down'}">${fmtPct(s.current.qty, s.prevMonth.qty)}</span>` : '-'}</td>
            <td class="num">${s.prevYear ? fmt(s.prevYear.qty) + '개' : '-'}</td>
            <td class="center">${s.prevYear ? `<span class="badge ${isUp(s.current.qty, s.prevYear.qty) ? 'badge-up' : 'badge-down'}">${fmtPct(s.current.qty, s.prevYear.qty)}</span>` : '<span style="color:var(--text-light)">N/A</span>'}</td>
          </tr>`).join('')}
          <tr class="total-row">
            <td>합계</td>
            <td class="num">${fmt(c.overseas.total.qty)}개</td>
            <td class="num">${fmt(overseasSummary.amount)}원</td>
            <td class="center">${overseasSummary.amount ? (overseasSummary.commission / overseasSummary.amount * 100).toFixed(1) + '%' : '-'}</td>
            <td class="num">${fmt(overseasSummary.commission)}원</td>
            <td class="num">${fmt(overseasSummary.net)}원</td>
            <td class="num">${fmt(c.overseas.total.prevMonth.qty)}개</td>
            <td class="center"><span class="badge ${isUp(c.overseas.total.qty, c.overseas.total.prevMonth.qty) ? 'badge-up' : 'badge-down'}">${fmtPct(c.overseas.total.qty, c.overseas.total.prevMonth.qty)}</span></td>
            <td class="num">${c.overseas.total.prevYear ? fmt(c.overseas.total.prevYear.qty) + '개' : '-'}</td>
            <td class="center">${c.overseas.total.prevYear ? `<span class="badge ${isUp(c.overseas.total.qty, c.overseas.total.prevYear.qty) ? 'badge-up' : 'badge-down'}">${fmtPct(c.overseas.total.qty, c.overseas.total.prevYear.qty)}</span>` : '-'}</td>
          </tr>
        </table>
      </div>
    </div>` : ''}

    <div class="two-col">
      <div class="card">
        <div class="card-header">주요 인사이트</div>
        <div class="card-body">
          <ul class="insight-list">
            ${c.insights.good.map(t => `<li class="good">${t}</li>`).join('')}
            ${c.insights.check.map(t => `<li class="check">${t}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="card">
        <div class="card-header">차월 계획</div>
        <div class="card-body">
          <div class="plan-highlight">우선 진행: ${c.nextMonth.products}</div>
          ${c.nextMonth.issues.map(i => `<div class="plan-item">${i}</div>`).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('content').innerHTML = html;

  // 주차별 추이 차트
  if (c.weeklyTrend) {
    new Chart(document.getElementById('weeklyTrendChart'), {
      type: 'bar',
      data: {
        labels: c.weeklyTrend.map(w => w.label),
        datasets: [
          { label: '쿠팡', data: c.weeklyTrend.map(w => w.coupang), backgroundColor: '#E74C3C', borderRadius: 4 },
          { label: '자사몰', data: c.weeklyTrend.map(w => w.cafe24), backgroundColor: '#2F5496', borderRadius: 4 },
          { label: '스마트스토어', data: c.weeklyTrend.map(w => w.smartstore), backgroundColor: '#27AE60', borderRadius: 4 },
          { label: '카카오', data: c.weeklyTrend.map(w => w.kakao), backgroundColor: '#9B59B6', borderRadius: 4 },
          { label: '롯데온', data: c.weeklyTrend.map(w => w.lotteon), backgroundColor: '#F39C12', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { stacked: true }, y: { stacked: true, ticks: { callback: v => (v/10000).toFixed(0)+'만' } } },
        plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + fmt(ctx.raw) + '원' } } }
      }
    });
  }

  // 비중 비교 차트 (전년 vs 금년)
  currentChart1 = new Chart(document.getElementById('ratioChart'), {
    type: 'bar',
    data: {
      labels: c.ratioChange.map(r => r.name),
      datasets: [
        { label: prevYearLabel, data: c.ratioChange.map(r => r.prev), backgroundColor: 'rgba(47,84,150,0.3)', borderColor: '#2F5496', borderWidth: 1 },
        { label: currentLabel, data: c.ratioChange.map(r => r.current), backgroundColor: 'rgba(47,84,150,0.8)', borderColor: '#2F5496', borderWidth: 1 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => v + '%' } } },
      plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.raw.toFixed(1) + '%' } } }
    }
  });

  // 전월·전년 비교 차트
  currentChart2 = new Chart(document.getElementById('compareChart'), {
    type: 'bar',
    data: {
      labels: c.channels.map(ch => ch.name),
      datasets: [
        { label: prevYearLabel, data: c.channels.map(ch => ch.prevYear), backgroundColor: '#BDC3C7' },
        { label: prevMonthLabel, data: c.channels.map(ch => ch.prevMonth), backgroundColor: 'rgba(47,84,150,0.4)' },
        { label: currentLabel, data: c.channels.map(ch => ch.revenue), backgroundColor: '#2F5496' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { y: { ticks: { callback: v => (v/10000).toFixed(0)+'만' } } },
      plugins: { tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + fmt(ctx.raw) + '원' } } }
    }
  });

  // 비중 파이
  currentChart3 = new Chart(document.getElementById('closingPieChart'), {
    type: 'doughnut',
    data: {
      labels: c.channels.map(ch => ch.name),
      datasets: [{ data: c.channels.map(ch => ch.revenue), backgroundColor: colors, borderWidth: 2 }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
  });
}

// 초기화
initTabs();
// 최신 주차 먼저 표시
showWeekly(visibleWeeklyReports()[0].id);
