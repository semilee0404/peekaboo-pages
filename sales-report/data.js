// 매출 보고서 데이터 — 주차별 누적
// 자사몰: Cafe24 API / 셀러센터 CSV
// 쿠팡: 서플라이허브 납품금액 (총단가 기준)
// 스마트스토어: 셀러센터 결제금액
// 카카오선물하기: 카카오 판매현황
// 롯데온: 셀러센터 판매금액 (결제-취소)

const weeklyReports = [
  {
    id: "2026-W16",
    label: "4월3주 (4/13~4/19)",
    period: "2026-04-13 ~ 2026-04-19",
    summary: "전체 매출 5,774만원 · WoW +28.6% · YoY +16.9%. 쿠팡 납품 +68% WoW/+6.5% YoY, 자사몰 +9.5% WoW/+37.8% YoY. 롯데온 -80.4% YoY·스마트스토어 -21.3% YoY 부진. 쿠팡 소매 GMV 4,919만(수수료35%).",
    channels: [
      { name: "쿠팡", revenue: 27767900, prevWeek: 16535100, prevYear: 26062100, ratio: 48.1 },
      { name: "자사몰", revenue: 27656198, prevWeek: 25249515, prevYear: 20070560, ratio: 47.9 },
      { name: "스마트스토어", revenue: 1591400, prevWeek: 2073150, prevYear: 2022840, ratio: 2.8 },
      { name: "카카오선물하기", revenue: 496900, prevWeek: 605600, prevYear: 60300, ratio: 0.9 },
      { name: "롯데온", revenue: 229400, prevWeek: 448000, prevYear: 1167900, ratio: 0.4 }
    ],
    total: { revenue: 57741798, prevWeek: 44911365, prevYear: 49383700 },
    coupangGmv: { revenue: 49189800, fee: 35 },
    overseas: {
      sellers: [
        {
          name: "도매주문관리",
          current: { qty: 3967, amount: 86021600 },
          prevMonth: { qty: 29844, amount: 641218627 },
          prevYear: { qty: 7217, amount: 152599301 }
        },
        {
          name: "Hipeekaboo(China)",
          current: { qty: 3773, amount: 0 },
          prevMonth: { qty: 12430, amount: 45600 },
          prevYear: null
        }
      ],
      total: { qty: 7740, amount: 86021600, prevMonth: { qty: 42274, amount: 641264227 }, prevYear: { qty: 7217, amount: 152599301 } }
    },
    cafe24Daily: [
      { day: "월", date: "4/13", revenue: 3722690 },
      { day: "화", date: "4/14", revenue: 5341742 },
      { day: "수", date: "4/15", revenue: 3322888 },
      { day: "목", date: "4/16", revenue: 6113118 },
      { day: "금", date: "4/17", revenue: 3078359 },
      { day: "토", date: "4/18", revenue: 2725610 },
      { day: "일", date: "4/19", revenue: 3351791 }
    ],
    cafe24Top10: [
      { rank: 1, name: "에어 키즈 세트", qty: 11, amount: 242000 },
      { rank: 2, name: "아임세트", qty: 6, amount: 214200 },
      { rank: 3, name: "쿨리 키즈세트", qty: 10, amount: 200000 },
      { rank: 4, name: "에어 바디수트", qty: 9, amount: 198000 },
      { rank: 5, name: "버디 바디수트", qty: 7, amount: 196000 },
      { rank: 6, name: "이븐 베이비세트", qty: 4, amount: 160000 },
      { rank: 7, name: "에어 베이비 세트", qty: 7, amount: 154000 },
      { rank: 8, name: "윙고_baby상하세트", qty: 9, amount: 153000 },
      { rank: 9, name: "카렌 키즈세트", qty: 3, amount: 117000 },
      { rank: 10, name: "듀이 바디수트", qty: 3, amount: 114000 }
    ],
    insights: {
      good: [
        "전체 매출 WoW +28.6% (4,491만→5,774만) · YoY +16.9% (4,938만→5,774만)",
        "쿠팡 납품 WoW +68.0% · YoY +6.5% (2,606만→2,777만), 발주 781건 회복",
        "자사몰 WoW +9.5% · YoY +37.8% (2,007만→2,766만) 두 자릿수 성장",
        "카카오선물하기 YoY +724% (6만→50만) — 채널 성장 지속",
        "4/16(목) 자사몰 일매출 611만, 주중 최고치",
        "쿠팡 소매 GMV 4,919만원 (W15 4,039만 대비 +21.8%)"
      ],
      check: [
        "롯데온 WoW -48.8% (45만→23만) · YoY -80.4% (117만→23만) 급락",
        "스마트스토어 WoW -23.2% · YoY -21.3% (203만→159만) 3주 연속 부진",
        "4/18(금) 자사몰 273만원, 주중 최저 — W15 4/11(금) 161만 이어 금요일 취약 패턴",
        "카카오선물하기 4/13·14·17·18 매출 0원 (7일 중 4일 공백)",
        "자사몰 Cafe24 CSV 매출(2,765만) vs 이지어드민 카페24(848만) 괴리 — 이지어드민 집계 지연 가능성"
      ]
    },
    status: [
      { type: "confirmed", text: "자사몰 Cafe24 셀러센터 CSV 기준 (order_amount 27,656,198원, 387건, 바이어 381명)" },
      { type: "confirmed", text: "쿠팡 납품 서플라이허브 xlsx 기준 (총단가 27,767,900원, 781건)" },
      { type: "confirmed", text: "쿠팡 소매 GMV 49,189,800원 (WING ads 기준, 수수료 35%)" },
      { type: "confirmed", text: "전년(2025) 쿠팡 납품 서플라이허브 이력 xlsx로 재산출 (26,062,100원)" },
      { type: "confirmed", text: "전년(2025) 자사몰 Cafe24 CSV 이력 재계산, 요일정렬(-364d) 기준 20,070,560원" },
      { type: "confirmed", text: "스마트스토어 이지어드민 판매처상품매출통계 기준 (1,591,400원, 63개)" },
      { type: "confirmed", text: "카카오선물하기 판매현황 xlsx 기준 (주문 496,900원 - 취소 0원)" },
      { type: "confirmed", text: "롯데온 통계매출분석 xlsx 기준 (결제 338,800원 - 취소 109,400원 = 229,400원)" },
      { type: "confirmed", text: "해외/도매 이지어드민 판매처상품매출통계 (월 누적 4/1~4/19)" },
      { type: "warning", text: "자사몰 TOP10은 이지어드민 카페24 기준 — CSV에는 상품별 집계 없음" }
    ],
    nextWeek: {
      products: "",
      issues: [
        "롯데온 전년 대비 -80% 하락 원인 확인 — 상품 노출 또는 취소 이슈",
        "스마트스토어 3주 연속 부진 대응 (W14 206만 → W15 207만 → W16 159만)",
        "자사몰 금요일 저조 2주 연속 — 콘텐츠·프로모션 발행 요일 재검토",
        "카카오선물하기 주 4일 공백 — 노출/배너 교체 검토"
      ]
    }
  },
  {
    id: "2026-W15",
    label: "4월2주 (4/6~4/12)",
    period: "2026-04-06 ~ 2026-04-12",
    summary: "전체 매출 4,491만원, 전주 대비 -17.4%. 쿠팡 납품 -27.5% 하락, 자사몰 -12.7%. 카카오 +24.3%, 롯데온 +234% 반등. 쿠팡 소매 GMV 4,039만(수수료35%).",
    channels: [
      { name: "쿠팡", revenue: 16535100, prevWeek: 22798400, prevYear: 16264600, ratio: 36.8 },
      { name: "자사몰", revenue: 25249515, prevWeek: 28914400, prevYear: 19126990, ratio: 56.2 },
      { name: "스마트스토어", revenue: 2073150, prevWeek: 2058770, prevYear: 1152470, ratio: 4.6 },
      { name: "카카오선물하기", revenue: 605600, prevWeek: 487100, prevYear: null, ratio: 1.3 },
      { name: "롯데온", revenue: 448000, prevWeek: 134300, prevYear: 208900, ratio: 1.0 }
    ],
    total: { revenue: 44911365, prevWeek: 54392970, prevYear: null },
    coupangGmv: { revenue: 40393820, fee: 35 },
    overseas: {
      sellers: [
        {
          name: "도매주문관리",
          current: { qty: 3716, amount: 79815150 },
          prevMonth: { qty: 16272, amount: 348573327 },
          prevYear: { qty: 4067, amount: 89499001 }
        },
        {
          name: "Hipeekaboo(China)",
          current: { qty: 1787, amount: 0 },
          prevMonth: { qty: 5677, amount: 34200 },
          prevYear: null
        }
      ],
      total: { qty: 5503, amount: 79815150, prevMonth: { qty: 21949, amount: 348607527 }, prevYear: { qty: 4067, amount: 89499001 } }
    },
    cafe24Daily: [
      { day: "일", date: "4/6", revenue: 4173027 },
      { day: "월", date: "4/7", revenue: 4795450 },
      { day: "화", date: "4/8", revenue: 4168964 },
      { day: "수", date: "4/9", revenue: 3903207 },
      { day: "목", date: "4/10", revenue: 3678620 },
      { day: "금", date: "4/11", revenue: 1609300 },
      { day: "토", date: "4/12", revenue: 2920947 }
    ],
    cafe24Top10: [
      { rank: 1, name: "샤인 수트세트", qty: 72, amount: 2016000 },
      { rank: 2, name: "디저트 반팔 수트세트", qty: 41, amount: 1066000 },
      { rank: 3, name: "샤인 키즈세트", qty: 40, amount: 960000 },
      { rank: 4, name: "밀키 베이비 3종세트", qty: 16, amount: 832000 },
      { rank: 5, name: "쿨쿨세트", qty: 40, amount: 612000 },
      { rank: 6, name: "쿨리 베이비세트", qty: 24, amount: 504000 },
      { rank: 7, name: "보니 블루머", qty: 18, amount: 468000 },
      { rank: 8, name: "쇼콜라 티셔츠", qty: 18, amount: 396000 },
      { rank: 9, name: "코이 블루머", qty: 16, amount: 384000 },
      { rank: 10, name: "쿨쿨 수트", qty: 18, amount: 336600 }
    ],
    insights: {
      good: [
        "자사몰 비중 56.2%로 전주(53.2%) 대비 상승 — 채널 1위 유지",
        "카카오선물하기 +24.3% 반등 (49만 → 61만), 취소 0건",
        "롯데온 +233.6% (13만 → 45만), 취소 0건",
        "샤인 수트세트 자사몰 TOP1 (72개/202만) — 4/3 출시 후 2주 연속 강세"
      ],
      check: [
        "전체 매출 전주대비 -17.4% (5,439만 → 4,491만)",
        "쿠팡 납품 전주대비 -27.5% (2,280만 → 1,654만)",
        "자사몰 전주대비 -12.7% (2,891만 → 2,525만, CSV order_amount 기준)",
        "4/11(금) 자사몰 일매출 161만으로 주중 최저"
      ]
    },
    status: [
      { type: "confirmed", text: "자사몰 Cafe24 셀러센터 CSV 기준 (order_amount, 환불 미반영)" },
      { type: "confirmed", text: "쿠팡 납품 서플라이허브 xlsx 기준 (총단가 16,535,100원, 401건)" },
      { type: "confirmed", text: "쿠팡 소매 GMV 40,393,820원 (수수료 35%)" },
      { type: "confirmed", text: "스마트스토어 셀러센터 판매성과 xlsx 기준 (결제금액 2,073,150원, 91건)" },
      { type: "confirmed", text: "카카오선물하기 판매현황 xlsx 기준 (주문 605,600원 - 취소 0원)" },
      { type: "confirmed", text: "롯데온 통계매출분석 xlsx 기준 (결제 448,000원 - 취소 0원)" },
      { type: "confirmed", text: "해외 수출 이지어드민 판매처상품매출통계 기준" }
    ],
    nextWeek: {
      products: "",
      issues: [
        "쿠팡 납품 하락 원인 확인 — 입고 지연 또는 시즌 전환 영향",
        "자사몰 금요일 매출 급락(161만) 원인 분석"
      ]
    }
  },
  {
    id: "2026-W14",
    label: "4월1주 (3/30~4/5)",
    period: "2026-03-30 ~ 2026-04-05",
    summary: "전체 매출 5,439만원, 전주 대비 +7.7%. 쿠팡 납품 +28.2% 반등, 스마트스토어 +67% 급성장. 쿠팡 소매 GMV 4,686만(수수료35%).",
    channels: [
      { name: "쿠팡", revenue: 22798400, prevWeek: 17783300, prevYear: 16968400, ratio: 41.9 },
      { name: "자사몰", revenue: 28914400, prevWeek: 30741475, prevYear: 23455570, ratio: 53.2 },
      { name: "스마트스토어", revenue: 2058770, prevWeek: 1232700, prevYear: 837990, ratio: 3.8 },
      { name: "카카오선물하기", revenue: 487100, prevWeek: 624300, prevYear: 794400, ratio: 0.9 },
      { name: "롯데온", revenue: 134300, prevWeek: 137700, prevYear: 130900, ratio: 0.2 }
    ],
    total: { revenue: 54392970, prevWeek: 50519475, prevYear: 42187260 },
    coupangGmv: { revenue: 46857930, fee: 35 },
    overseas: {
      sellers: [
        {
          name: "도매주문관리",
          current: { qty: 278, amount: 7023700 },
          prevMonth: { qty: 4628, amount: 94668600 },
          prevYear: { qty: 1815, amount: 38334527 }
        },
        {
          name: "Hipeekaboo(China)",
          current: { qty: 651, amount: 0 },
          prevMonth: { qty: 3987, amount: 0 },
          prevYear: null
        }
      ],
      total: { qty: 929, amount: 7023700, prevMonth: { qty: 8615, amount: 94668600 }, prevYear: { qty: 1815, amount: 38334527 } }
    },
    cafe24Daily: [
      { day: "월", date: "3/30", revenue: 3936700 },
      { day: "화", date: "3/31", revenue: 3732200 },
      { day: "수", date: "4/1", revenue: 6062000 },
      { day: "목", date: "4/2", revenue: 3558300 },
      { day: "금", date: "4/3", revenue: 3925100 },
      { day: "토", date: "4/4", revenue: 3242500 },
      { day: "일", date: "4/5", revenue: 4457600 }
    ],
    cafe24Top10: [
      { rank: 1, name: "보니 블루머", qty: 70, amount: 1820000 },
      { rank: 2, name: "밀키 베이비 3종 세트", qty: 28, amount: 1456000 },
      { rank: 3, name: "쇼콜라 티셔츠", qty: 64, amount: 1408000 },
      { rank: 4, name: "디저트 반팔 수트세트", qty: 33, amount: 858000 },
      { rank: 5, name: "보니 헤어밴드", qty: 48, amount: 768000 },
      { rank: 6, name: "코이 티셔츠", qty: 38, amount: 722000 },
      { rank: 7, name: "코이 블루머", qty: 29, amount: 696000 },
      { rank: 8, name: "샤인 수트세트", qty: 23, amount: 644000 },
      { rank: 9, name: "쿨리 바디수트", qty: 26, amount: 546000 },
      { rank: 10, name: "쿨쿨 수트세트", qty: 29, amount: 542300 }
    ],
    insights: {
      good: [
        "전체 매출 전주대비 +7.7% (5,052만 → 5,439만)",
        "쿠팡 납품 전주대비 +28.2% (1,778만 → 2,280만), 시즌 전환 효과",
        "스마트스토어 전주대비 +67.0% (123만 → 206만), 환불비율 14%로 개선",
        "4/1(수) 자사몰 일매출 606만, 주간 최고 — 밀키 3종세트·보니 블루머·보니 헤어밴드 등 기존 인기상품 집중 판매 (신상 3종 샤인·샌디·링고는 4/3 오픈)"
      ],
      check: [
        "자사몰 전주대비 -5.9% (3,074만 → 2,891만), API 기준 — 셀러센터 CSV 교차검증 필요",
        "카카오선물하기 전주대비 -22.0% (62만 → 49만)",
        "롯데온 4/3 환불 32,000원 발생 (판매금액 -1,400원)"
      ]
    },
    status: [
      { type: "confirmed", text: "자사몰 Cafe24 API 기준 (셀러센터 CSV 교차검증 필요)" },
      { type: "confirmed", text: "쿠팡 납품 서플라이허브 xlsx 기준" },
      { type: "confirmed", text: "쿠팡 소매 GMV 46,857,930원 (수수료 35%)" },
      { type: "confirmed", text: "스마트스토어 셀러센터 캡쳐 기준 (결제 2,387,870 - 환불 329,100)" },
      { type: "confirmed", text: "카카오선물하기 판매현황 xlsx 기준 (주문 527,100 - 취소 40,000)" },
      { type: "confirmed", text: "롯데온 통계매출분석 xlsx 기준 (결제 166,300 - 취소 32,000)" },
      { type: "confirmed", text: "해외 수출 이지어드민 판매처상품매출통계 기준" }
    ],
    nextWeek: {
      products: "포밍 · 이븐 · 에어 (3종) 오픈",
      issues: [
        "가정의 달 이벤트 — \"포밍 입어볼래요\", \"에어 입어볼래요\" 기획 진행",
        "인스타그램 팔로워 10만 달성 이벤트"
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

// 월간 마감 보고서 데이터 (셀러센터 확정치, 쿠팡은 납품금액 기준)
const monthlyClosing = {
  "2026-03": {
    label: "2026년 3월 마감",
    period: "2026-03-01 ~ 2026-03-31",
    summary: "전체 매출 1억 9,860만원(쿠팡 납품 기준), 전월대비 -18.6%, 전년대비 +12.1%. 자사몰 비중 50.5%로 1위.",
    channels: [
      { name: "쿠팡", revenue: 91236900, prevMonth: 83556530, prevYear: 79635100 },
      { name: "자사몰", revenue: 100234085, prevMonth: 156405573, prevYear: 86482892 },
      { name: "스마트스토어", revenue: 4972500, prevMonth: 1582600, prevYear: 2789190 },
      { name: "카카오선물하기", revenue: 1690300, prevMonth: 2319200, prevYear: 5992800 },
      { name: "롯데온", revenue: 469200, prevMonth: 93500, prevYear: 2346000 }
    ],
    total: { revenue: 198602985, prevMonth: 243957403, prevYear: 177245982 },
    ratioChange: [
      { name: "쿠팡", prev: 44.9, current: 45.9, change: 1.0 },
      { name: "자사몰", prev: 48.8, current: 50.5, change: 1.7 },
      { name: "스마트스토어", prev: 1.6, current: 2.5, change: 0.9 },
      { name: "카카오선물하기", prev: 3.4, current: 0.9, change: -2.5 },
      { name: "롯데온", prev: 1.3, current: 0.2, change: -1.1 }
    ],
    overseas: {
      sellers: [
        {
          name: "도매주문관리",
          current: { qty: 23261, amount: 399850600 },
          prevMonth: { qty: 28574, amount: 539746000 },
          prevYear: { qty: 34185, amount: 548365900 }
        },
        {
          name: "Hipeekaboo(China)",
          current: { qty: 8308, amount: 184948000 },
          prevMonth: { qty: 1250, amount: 22648000 },
          prevYear: null
        }
      ],
      total: { qty: 31569, amount: 584798600, prevMonth: { qty: 29824, amount: 562394000 }, prevYear: { qty: 34185, amount: 548365900 } }
    },
    insights: {
      good: [
        "전체 매출 전년대비 +12.1% 성장 (1.77억 → 1.99억, 납품 기준)",
        "쿠팡 납품 전년대비 +14.6% (7,964만 → 9,124만)",
        "쿠팡 납품 전월대비 +9.2% 증가",
        "스마트스토어 전월대비 +214%, 전년대비 +78% 성장세",
        "해외 수출 Hipeekaboo 전월대비 +564.6% 급성장 (8,308개)"
      ],
      check: [
        "자사몰 전월대비 -35.9% (2월 1.56억 → 3월 1.00억)",
        "카카오 전년대비 -71.8%, 롯데온 전년대비 -80.0% 축소",
        "전월대비 전체 -18.6% — 2월 대비 하락",
        "도매주문관리 수출 전월 -18.6%, 전년 -32.0% 감소 추세"
      ]
    },
    weeklyTrend: [
      { label: "1주 (3/2~3/8)", coupang: 19325000, cafe24: 20959796, smartstore: 961000, kakao: 190600, lotteon: 139400, total: 41575796 },
      { label: "2주 (3/9~3/15)", coupang: 19454900, cafe24: 19023081, smartstore: 910400, kakao: 155600, lotteon: 44200, total: 39588181 },
      { label: "3주 (3/16~3/22)", coupang: 22828300, cafe24: 20901113, smartstore: 1003600, kakao: 465500, lotteon: 71400, total: 45269913 },
      { label: "4주 (3/23~3/29)", coupang: 17783300, cafe24: 30741475, smartstore: 1232700, kakao: 624300, lotteon: 137700, total: 50519475 }
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

// 월별 추이 데이터 (2026년 1월~, 쿠팡 납품금액 기준)
const monthlyTrend = [
  {
    month: "2026-01",
    channels: [
      { name: "쿠팡", revenue: 127352650 },
      { name: "자사몰", revenue: 107295673 },
      { name: "스마트스토어", revenue: 1195030 },
      { name: "카카오선물하기", revenue: 2347900 },
      { name: "롯데온", revenue: 761600 }
    ],
    total: 238952853
  },
  {
    month: "2026-02",
    channels: [
      { name: "쿠팡", revenue: 83556530 },
      { name: "자사몰", revenue: 156405573 },
      { name: "스마트스토어", revenue: 1582600 },
      { name: "카카오선물하기", revenue: 2319200 },
      { name: "롯데온", revenue: 93500 }
    ],
    total: 243957403
  },
  {
    month: "2026-03",
    channels: [
      { name: "쿠팡", revenue: 91236900 },
      { name: "자사몰", revenue: 100234085 },
      { name: "스마트스토어", revenue: 4972500 },
      { name: "카카오선물하기", revenue: 1690300 },
      { name: "롯데온", revenue: 469200 }
    ],
    total: 198602985
  }
];
