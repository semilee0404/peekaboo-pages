# 매출 대시보드 백데이터 입력 가이드

연결 파일: `weekly-sales-input.csv`

이 CSV가 대시보드의 주차별 백데이터 시트입니다. 값을 입력한 뒤 `active`를 `TRUE`로 바꾸면 공개 대시보드에 해당 주차 탭이 표시됩니다.

## 필수 입력

- `active`: 공개 표시 여부. 입력 완료 전에는 `FALSE`, 공개할 때 `TRUE`
- `id`: 주차 ID. 예: `2026-W19`
- `label`: 탭 이름. 예: `5월2주 (5/4~5/10)`
- `start_date`, `end_date`, `period`: 주차 기간
- `coupang`: 쿠팡 납품 매출
- `cafe24`: 자사몰 Cafe24 애널리틱스 매출
- `smartstore`: 스마트스토어 매출
- `kakao`: 카카오선물하기 매출
- `lotteon`: 롯데온 매출

## 선택 입력

- `coupang_ads`: 쿠팡 Ads 확인 매출
- `meta_period`: Meta 광고 기간
- `meta_spend`: Meta 광고비
- `meta_purchases`: Meta 구매 수
- `meta_purchase_value`: Meta 구매 전환값
- `meta_notes`: Meta 관련 확인 메모. 여러 개는 `|`로 구분
- `cafe24_daily_dates`: 자사몰 일별 날짜. 예: `5/4|5/5|5/6|5/7|5/8|5/9|5/10`
- `cafe24_daily_revenues`: 자사몰 일별 매출. 날짜와 같은 순서로 `|` 구분
- `insight_good`: 주요 인사이트. 여러 개는 `|`로 구분
- `insight_check`: 확인/판단 메모. 여러 개는 `|`로 구분
- `status_confirmed`: 실제 확인된 내용. 여러 개는 `|`로 구분
- `next_products`: 차주 우선 진행
- `next_issues`: 차주 계획/확인 사항. 여러 개는 `|`로 구분

## 자동 계산

- 총매출: `coupang + cafe24 + smartstore + kakao + lotteon`
- 전주대비: `prev_week_*`가 비어 있으면 직전 주차 값을 자동 사용
- 입력 상태: 주요 채널 5개 + Meta 광고비 총 6개 기준
- 광고비 차감 후 매출: `총매출 - meta_spend`
- 채널별 전주대비 증감액: 이번 주 채널 매출 - 전주 채널 매출

주의: 주요 인사이트와 확인/판단 문구에는 실제로 확인된 사실만 입력합니다.
