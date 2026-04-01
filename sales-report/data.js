// 매출 보고서 데이터 — 주차별 누적
// 자사몰: Cafe24 셀러센터 CSV (order_amount)
// 쿠팡: DB 기준 (셀러센터 확인 시 교체)
// 스마트스토어: 셀러센터 결제금액
// 카카오선물하기: 카카오 판매현황
// 롯데온: 셀러센터 판매금액 (결제-취소)

const weeklyReports = [
  {
    id: "2026-W13",
    label: "3월4주 (3/23~3/29)",
    period: "2026-03-23 ~ 2026-03-29",
    summary: "전체 매출 7,826만원, 전주 대비 +19.3%, 전년 동기 대비 +9.2%. 신상 5종 오픈 효과로 자사몰 견인.",
    channels: [
      { name: "쿠팡", revenue: 45525000, prevWeek: 43127090, prevYear: null, ratio: 58.2 },
      { name: "자사몰", revenue: 30741475, prevWeek: 20901113, prevYear: null, ratio: 39.3 },
      { name: "스마트스토어", revenue: 1232700, prevWeek: 1003600, prevYear: null, ratio: 1.6 },
      { name: "카카오선물하기", revenue: 624300, prevWeek: 465500, prevYear: null, ratio: 0.8 },
      { name: "롯데온", revenue: 137700, prevWeek: 71400, prevYear: null, ratio: 0.2 }
    ],
    total: { revenue: 78261175, prevWeek: 65568703, prevYear: 71646842 },
    coupangStock: {
      current: { sku: 667, qty: 1694, amount: 17783300 },
      prevWeek: { sku: 803, qty: 2223, amount: 22828300 },
      prevYear: { sku: 1039, qty: 1816, amount: 20122900 },
      top5: [
        { name: "쿨쿨 수트세트 검정 12m", qty: 36, amount: 435600 },
        { name: "초코 래쉬가드 민트초코 XL", qty: 16, amount: 352000 },
        { name: "스무드 실내복 세트 아이보리 XS", qty: 15, amount: 247500 },
        { name: "룰루 곰돌이모자 아이보리 M", qty: 34, amount: 224400 },
        { name: "쿨쿨세트 크림 M", qty: 20, amount: 198000 }
      ]
    },
    cafe24Daily: [
      { day: "월", date: "3/23", revenue: 4068993 },
      { day: "화", date: "3/24", revenue: 5964003 },
      { day: "수", date: "3/25", revenue: 3209837 },
      { day: "목", date: "3/26", revenue: 5359033 },
      { day: "금", date: "3/27", revenue: 6305411 },
      { day: "토", date: "3/28", revenue: 3192800 },
      { day: "일", date: "3/29", revenue: 2641398 }
    ],
    cafe24Top10: [
      { rank: 1, name: "피카부X민들레마음 수면안대", qty: 150, amount: 1800000 },
      { rank: 2, name: "보니 블루머", qty: 49, amount: 1274000 },
      { rank: 3, name: "쿨쿨 수트세트", qty: 48, amount: 897600 },
      { rank: 4, name: "쇼콜라 티셔츠", qty: 47, amount: 1034000 },
      { rank: 5, name: "디저트 수트세트", qty: 33, amount: 924000 },
      { rank: 6, name: "디저트 보넷", qty: 27, amount: 324000 },
      { rank: 7, name: "보니 헤어밴드", qty: 27, amount: 432000 },
      { rank: 8, name: "초코 스윔햇", qty: 23, amount: 234600 },
      { rank: 9, name: "디저트 반팔 수트세트", qty: 23, amount: 598000 },
      { rank: 10, name: "밀키 베이비 3종 세트", qty: 22, amount: 1144000 }
    ],
    insights: {
      good: [
        "자사몰 +47.1%, 신상 오픈이 확실한 매출 견인",
        "신상품 3종(보니·쇼콜라·밀키) 오픈 4일 만에 TOP 10 진입",
        "쿠팡 매출 안정 성장, 4,550만원대 돌파",
        "카카오선물하기 +34.1%, 3월 최고 주간 매출"
      ],
      check: [
        "쿠팡 납품 전주대비 -22.1%, 전년대비 -11.6% 감소",
        "스마트스토어 환불 32.9% — 루루·이브 래쉬가드 품절 (원인 파악 완료)"
      ]
    },
    status: [
      { type: "confirmed", text: "5채널 셀러센터 실수치 + 쿠팡 납품 실데이터 기준" },
      { type: "confirmed", text: "스마트스토어 환불 — 루루·이브 래쉬가드 품절 건" },
      { type: "judgment", text: "신상 초기 반응 양호, 다음주 추이로 지속성 확인 필요" },
      { type: "judgment", text: "쿠팡 납품 감소 — S/S 시즌 전환기 영향 가능성" }
    ],
    nextWeek: {
      products: "샤인 · 샌디 · 링고 · 이븐 (4종)",
      issues: [
        "가정의 달 이벤트 — \"포밍 입어볼래요\", \"에어 입어볼래요\" 이벤트",
        "인스타그램 팔로워 10만 달성 이벤트 또는 기획전",
        "메인 배너 기획 진행 필요"
      ]
    }
  }
];

// 월별 집계는 weeklyReports에서 자동 계산
function getMonthlyData() {
  const monthly = {};
  weeklyReports.forEach(w => {
    const month = w.period.substring(0, 7);
    if (!monthly[month]) {
      monthly[month] = { label: month, weeks: [], totalRevenue: 0, channels: {} };
    }
    monthly[month].weeks.push(w);
    monthly[month].totalRevenue += w.total.revenue;
    w.channels.forEach(ch => {
      if (!monthly[month].channels[ch.name]) monthly[month].channels[ch.name] = 0;
      monthly[month].channels[ch.name] += ch.revenue;
    });
  });
  return Object.values(monthly).sort((a, b) => b.label.localeCompare(a.label));
}

// 월간 마감 보고서 데이터 (셀러센터 확정치)
const monthlyClosing = {
  "2026-03": {
    label: "2026년 3월 마감",
    period: "2026-03-01 ~ 2026-03-31",
    summary: "전체 매출 2억 9,897만원, 전월대비 -5.9%, 전년대비 +54.1%. 쿠팡 독주 심화, 자사몰 전월대비 하락.",
    channels: [
      { name: "쿠팡", revenue: 191605900, prevMonth: 157439630, prevYear: 96459800 },
      { name: "자사몰", revenue: 100234085, prevMonth: 156405573, prevYear: 86482892 },
      { name: "스마트스토어", revenue: 4972500, prevMonth: 1582600, prevYear: 2789190 },
      { name: "카카오선물하기", revenue: 1690300, prevMonth: 2319200, prevYear: 5992800 },
      { name: "롯데온", revenue: 469200, prevMonth: 93500, prevYear: 2346000 }
    ],
    total: { revenue: 298971985, prevMonth: 317840503, prevYear: 194070682 },
    ratioChange: [
      { name: "쿠팡", prev: 49.7, current: 64.1, change: 14.4 },
      { name: "자사몰", prev: 44.6, current: 33.5, change: -11.0 },
      { name: "스마트스토어", prev: 1.4, current: 1.7, change: 0.2 },
      { name: "카카오선물하기", prev: 3.1, current: 0.6, change: -2.5 },
      { name: "롯데온", prev: 1.2, current: 0.2, change: -1.1 }
    ],
    coupangStock: {
      current: { sku: 3165, qty: 8474, amount: 91236900 },
      prevMonth: { sku: 2455, qty: 7861, amount: 83556530 },
      prevYear: { sku: 3948, qty: 7031, amount: 79635100 },
      top5: [
        { name: "룰루 곰돌이모자 아이보리 S", qty: 165, amount: 1089000 },
        { name: "룰루 곰돌이모자 아이보리 M", qty: 144, amount: 950400 },
        { name: "루미 알라딘헤어밴드 아이보리 FREE", qty: 210, amount: 924000 },
        { name: "쿨쿨 수트세트 검정 12m", qty: 66, amount: 798600 },
        { name: "제제 보넷 블랙 S", qty: 80, amount: 792000 }
      ]
    },
    insights: {
      good: [
        "전체 매출 전년대비 +54.1% 성장 (1.94억 → 2.99억)",
        "쿠팡 매출 전년대비 +98.6%, 거의 2배 성장",
        "쿠팡 납품 전월대비 +9.2%, 전년대비 +14.6% 증가",
        "스마트스토어 전월대비 +214%, 전년대비 +78% 성장세"
      ],
      check: [
        "쿠팡 비중 64.1%로 편중 심화 (전년 49.7%)",
        "자사몰 전월대비 -35.9% (2월 1.56억 → 3월 1.00억)",
        "카카오 전년대비 -71.8%, 롯데온 전년대비 -80.0% 축소",
        "전월대비 전체 -5.9% — 2월 대비 하락"
      ]
    },
    weeklyTrend: [
      { label: "1주 (3/2~3/8)", coupang: 43717360, cafe24: 20959796, smartstore: 961000, kakao: 190600, lotteon: 139400, total: 65968156 },
      { label: "2주 (3/9~3/15)", coupang: 41746050, cafe24: 19023081, smartstore: 910400, kakao: 155600, lotteon: 44200, total: 61879331 },
      { label: "3주 (3/16~3/22)", coupang: 43127090, cafe24: 20901113, smartstore: 1003600, kakao: 465500, lotteon: 71400, total: 65568703 },
      { label: "4주 (3/23~3/29)", coupang: 45525000, cafe24: 30741475, smartstore: 1232700, kakao: 624300, lotteon: 137700, total: 78261175 }
    ],
    nextMonth: {
      products: "샤인 · 샌디 · 링고 · 이븐 (4종) 오픈",
      issues: [
        "가정의 달 이벤트 — \"포밍 입어볼래요\", \"에어 입어볼래요\"",
        "인스타그램 팔로워 10만 달성 이벤트 또는 기획전",
        "메인 배너 기획 진행",
        "자사몰 비중 회복 방안 검토 필요"
      ]
    }
  }
};
