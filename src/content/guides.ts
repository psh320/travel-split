export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  readingTime: string;
  intro: string[];
  sections: GuideSection[];
  takeaway: string;
};

const englishGuides: Guide[] = [
  {
    slug: "split-expenses",
    title: "How to split shared expenses fairly",
    summary:
      "Choose the right split for each purchase, record the payer and beneficiaries separately, and avoid the most common group-bill mistakes.",
    readingTime: "6 min read",
    intro: [
      "A fair split is not always an equal split. A taxi that everyone used can be divided evenly, while a museum ticket should only include the people who went. The important step is to decide who benefited from each cost before calculating what anyone owes.",
      "Split Expense keeps two facts separate: who paid at the register and who should share the cost. That distinction makes the final balance understandable and prevents the person who paid from being charged twice.",
    ],
    sections: [
      {
        heading: "1. Agree on the rule before spending",
        paragraphs: [
          "Groups usually run into conflict when they choose a rule after seeing the final total. Before the trip or event, agree on which costs are shared by everyone and which costs are personal. A simple rule such as “transport and accommodation are shared; optional activities and personal shopping are individual” removes most ambiguity.",
          "The rule does not need to cover every possible situation. It should give the group a default and leave room to confirm unusual purchases when they happen.",
        ],
        bullets: [
          "Split equally when everyone received roughly the same benefit.",
          "Select only the relevant participants for optional activities or individual meals.",
          "Record reimbursements separately instead of editing an unrelated expense.",
        ],
      },
      {
        heading: "2. Record payer and participants as separate facts",
        paragraphs: [
          "Suppose Mina pays $120 for dinner for Mina, Alex, and Sam. Mina is the payer, but all three are participants. Each person’s share is $40. Mina has already contributed $120, so her net position for that expense is +$80, while Alex and Sam are each at -$40.",
          "If Alex skipped dinner, remove Alex from that expense instead of compensating later with a guess. Accurate participation at the expense level produces a cleaner final settlement.",
        ],
      },
      {
        heading: "3. Enter costs while the details are fresh",
        paragraphs: [
          "Small forgotten costs create more disagreement than large, well-documented bookings. Enter the amount, payer, participants, and a recognizable note soon after the purchase. A name such as “Tuesday airport taxi” is easier to verify than “transport.”",
          "For card purchases in another currency, agree whether the group will use the amount shown on the receipt or the amount posted by the card issuer. Use one method consistently for the whole trip.",
        ],
        bullets: [
          "Keep receipts until the group confirms the final balance.",
          "Use the group’s selected currency consistently.",
          "Correct mistakes before anyone begins sending money.",
        ],
      },
      {
        heading: "4. Review the ledger before settling",
        paragraphs: [
          "A final review is faster when every participant checks only the expenses that involve them. Look for duplicate entries, missing people, transposed digits, and costs that should have been personal. Then lock in the agreed list and calculate the net balance.",
          "The settlement result is a payment plan, not a new set of expenses. Once transfers are complete, keep a screenshot or shared note so the group knows the trip is closed.",
        ],
      },
    ],
    takeaway:
      "Fairness comes from accurate participation, a consistent rule, and a quick review—not from forcing every purchase into an equal split.",
  },
  {
    slug: "travel-budget",
    title: "A practical group travel budget workflow",
    summary:
      "Plan shared categories before departure, capture expenses during the trip, and close the budget without a week of message-thread archaeology.",
    readingTime: "7 min read",
    intro: [
      "Group travel produces several kinds of money at once: prepaid bookings, cash purchases, card charges, deposits, refunds, and personal add-ons. A useful budget workflow does not try to predict every purchase. It gives the group a shared place and a repeatable way to record what actually happened.",
      "The best time to design that workflow is before anyone books the first non-refundable item. The second-best time is today, before more receipts disappear into chat history.",
    ],
    sections: [
      {
        heading: "Before the trip: define the shared budget",
        paragraphs: [
          "List the categories that everyone expects to share, such as accommodation, transport, groceries, and group activities. Add a rough target for each category and a small contingency amount. The target is a planning tool, not a promise that everyone must spend exactly that amount.",
          "Choose one settlement currency. If the trip uses several currencies, decide how conversions will be recorded. A consistent daily reference rate is simple; the final card-statement amount is more exact but arrives later. Either can work when the group agrees in advance.",
        ],
        bullets: [
          "Confirm who is included in each prepaid booking.",
          "Decide whether deposits count when paid or when they become non-refundable.",
          "Share the room code with every participant before departure.",
        ],
      },
      {
        heading: "During the trip: use a two-minute daily check",
        paragraphs: [
          "Enter large purchases immediately. For smaller items, set aside two minutes at the end of each day to catch up. The goal is not accounting perfection; it is enough detail that every person can recognize the purchase later.",
          "Cash needs special attention because there may be no bank record. Note who supplied the cash and who benefited. An ATM withdrawal itself is not a group expense; the things bought with that cash are the expenses.",
        ],
        bullets: [
          "Use specific descriptions with a place or date.",
          "Keep personal purchases out of the group ledger.",
          "Record refunds as corrections to the related cost or as a clearly labeled negative adjustment.",
        ],
      },
      {
        heading: "Before checkout: verify high-impact items",
        paragraphs: [
          "Check accommodation, rental vehicles, event tickets, and other high-value purchases before the group separates. Confirm that deposits and refunds are represented correctly and that no one is included in a booking they did not use.",
          "This is also the moment to add shared charges that arrive late, such as a hotel city tax or fuel refill. Waiting until everyone is in a different time zone makes these small questions surprisingly slow to resolve.",
        ],
      },
      {
        heading: "After the trip: settle once, then close",
        paragraphs: [
          "Give the group a short review window, calculate balances, and send one final payment plan. Avoid settling every individual receipt; netting all costs first usually requires fewer transfers and makes it easier to spot mistakes.",
          "When transfers are complete, confirm completion in the group chat and keep the expense list available for a reasonable period. A clear endpoint protects both the payer and the person reimbursing them.",
        ],
      },
    ],
    takeaway:
      "A good travel budget is a lightweight shared habit: agree on categories, record consistently, verify the expensive items, and settle once at the end.",
  },
  {
    slug: "settle-up",
    title: "How fewer-transfer settlement works",
    summary:
      "Understand net balances and see why a group can settle accurately without reimbursing every purchase one by one.",
    readingTime: "5 min read",
    intro: [
      "When several people pay for different purchases, reimbursing each receipt separately creates unnecessary transfers. A settlement calculator first combines what each person paid and what each person was responsible for, then uses the difference to build a shorter payment plan.",
      "This does not change anyone’s share. It changes only the route the money takes after all expenses have been counted.",
    ],
    sections: [
      {
        heading: "Start with each person’s net balance",
        paragraphs: [
          "For every participant, add the amount they paid and subtract the amount they should ultimately bear. A positive result means the group owes that person money. A negative result means that person still needs to contribute. Across a complete ledger, all positive and negative balances should sum to zero apart from minor rounding.",
          "Example: Alex paid $90 and owes a $50 share, so Alex’s net balance is +$40. Mina paid $20 and owes $50, so Mina is -$30. Sam paid $40 and owes $50, so Sam is -$10.",
        ],
      },
      {
        heading: "Match people who owe with people who are owed",
        paragraphs: [
          "In the example, Mina can pay Alex $30 and Sam can pay Alex $10. Two transfers clear all three balances. Reimbursing the original receipts might have required several smaller payments between the same people.",
          "With a larger group, the same principle repeats: take one person with a negative balance and match that amount against a person with a positive balance until one side reaches zero, then continue.",
        ],
      },
      {
        heading: "Why the result can look unfamiliar",
        paragraphs: [
          "A person may be asked to pay someone whose receipt they never appeared on. That can still be correct because the plan represents the group’s combined net position, not a receipt-by-receipt reimbursement. The total each person pays or receives remains the same.",
          "If the group prefers payments to follow social or household boundaries, use separate groups or expense sets. Fewer transfers is a convenience goal, not a requirement that overrides the group’s preferences.",
        ],
      },
      {
        heading: "Rounding and verification",
        paragraphs: [
          "Currency is normally settled to the smallest spendable unit. Splitting an amount such as $10 among three people creates a remainder, so one or more shares may differ by one cent. The important check is that the rounded shares add back to the original expense.",
          "Before sending money, confirm the group currency, inspect any unusually large balance, and make sure deleted participants or duplicate expenses are not still affecting the total.",
        ],
        bullets: [
          "Total paid should equal total owed.",
          "Positive balances should equal the absolute value of negative balances.",
          "Every proposed transfer should reduce at least one balance to zero.",
        ],
      },
    ],
    takeaway:
      "Net settlement preserves every person’s final share while removing payment loops and redundant receipt-by-receipt reimbursements.",
  },
];

const koreanGuides: Guide[] = [
  {
    slug: "split-expenses",
    title: "공동지출을 공정하게 나누는 방법",
    summary: "균등 분할과 선택 참여 지출을 구분하고 결제자와 부담자를 정확히 기록하는 실전 원칙입니다.",
    readingTime: "약 6분",
    intro: [
      "공정한 정산이 언제나 똑같이 나누는 것을 뜻하지는 않습니다. 모두가 탄 택시는 균등하게 나눌 수 있지만, 일부만 간 박물관 입장료는 실제 참여자끼리 부담하는 편이 자연스럽습니다. 계산 전에 먼저 각 지출로 누가 혜택을 받았는지 정하는 것이 핵심입니다.",
      "정산도우미는 현장에서 돈을 낸 사람과 비용을 부담할 사람을 따로 기록합니다. 이 둘을 구분하면 결제자가 이중으로 부담하는 오류를 막고 최종 잔액도 쉽게 설명할 수 있습니다.",
    ],
    sections: [
      {
        heading: "1. 지출 전에 기본 규칙을 합의하세요",
        paragraphs: [
          "최종 금액을 본 뒤 규칙을 정하면 의견이 갈리기 쉽습니다. 여행이나 모임을 시작하기 전에 숙소·교통·장보기처럼 모두가 나눌 항목과 선택 관광·개인 쇼핑처럼 개인이 부담할 항목을 정하세요. 모든 예외를 예상할 필요는 없지만 기본 원칙이 있으면 대부분의 애매함을 줄일 수 있습니다.",
          "평소에는 기본 규칙을 따르고, 특별한 지출이 생겼을 때 참여자만 한 번 확인하는 방식이 가장 부담이 적습니다.",
        ],
        bullets: ["모두가 비슷하게 이용했다면 균등 분할", "선택 활동과 개인 메뉴는 실제 참여자만 선택", "환급이나 반환금은 다른 지출을 임의로 고치지 말고 관련 내역에 명확히 반영"],
      },
      {
        heading: "2. 결제자와 부담자를 따로 기록하세요",
        paragraphs: [
          "민지가 민지·알렉스·샘의 저녁값 12만 원을 결제했다고 해보겠습니다. 결제자는 민지 한 명이지만 부담자는 세 명이고, 1인당 몫은 4만 원입니다. 민지는 이미 12만 원을 냈으므로 이 지출에서 8만 원을 받아야 하고, 나머지 두 사람은 각각 4만 원을 보내야 합니다.",
          "알렉스가 저녁에 참석하지 않았다면 나중에 대충 보정하지 말고 그 지출의 참여자에서 제외하세요. 지출별 참여자가 정확할수록 마지막 정산이 단순해집니다.",
        ],
      },
      {
        heading: "3. 기억이 생생할 때 입력하세요",
        paragraphs: [
          "큰 예약보다 영수증이 없는 작은 비용이 더 자주 분쟁을 만듭니다. 결제 직후 금액, 결제자, 참여자, 알아보기 쉬운 메모를 남기세요. ‘교통’보다 ‘화요일 공항 택시’가 나중에 확인하기 쉽습니다.",
          "해외 결제는 영수증 금액을 쓸지 카드사 최종 청구액을 쓸지 미리 합의하세요. 어느 방식이든 여행 전체에서 일관되게 적용하는 것이 중요합니다.",
        ],
        bullets: ["최종 확인 전까지 영수증 보관", "그룹에서 정한 통화를 일관되게 사용", "송금을 시작하기 전에 중복·누락 수정"],
      },
      {
        heading: "4. 송금 전에 한 번 검토하세요",
        paragraphs: [
          "각 참여자는 자신이 포함된 지출만 확인해도 충분합니다. 중복 입력, 빠진 사람, 숫자 오타, 개인 지출이 섞이지 않았는지 살핀 뒤 최종 목록을 확정하세요.",
          "정산 결과는 새로운 지출 목록이 아니라 최종 송금 계획입니다. 송금이 끝나면 화면을 저장하거나 단체방에 완료 사실을 남겨 깔끔하게 마무리하세요.",
        ],
      },
    ],
    takeaway: "공정함은 모든 비용을 억지로 똑같이 나누는 것이 아니라, 실제 참여자를 정확히 기록하고 같은 원칙을 적용하는 데서 나옵니다.",
  },
  {
    slug: "travel-budget",
    title: "여행 공동경비를 놓치지 않는 관리법",
    summary: "출발 전 준비, 여행 중 기록, 귀국 후 정산까지 단체 채팅을 다시 뒤지지 않게 만드는 체크리스트입니다.",
    readingTime: "약 7분",
    intro: [
      "단체 여행에는 선결제 예약, 현금 사용, 카드 결제, 보증금, 환불, 개인 추가 비용이 한꺼번에 생깁니다. 좋은 공동경비 관리법은 모든 소비를 완벽히 예측하는 방식이 아닙니다. 실제로 발생한 지출을 모두가 같은 규칙으로 남길 수 있게 해주는 방식입니다.",
      "가장 좋은 시작 시점은 환불 불가능한 첫 예약을 하기 전입니다. 이미 여행이 시작됐다면 오늘이 두 번째로 좋은 시점입니다.",
    ],
    sections: [
      {
        heading: "출발 전: 공동 예산의 범위를 정하세요",
        paragraphs: [
          "숙소, 교통, 장보기, 단체 활동처럼 함께 부담할 항목을 적고 각 항목에 대략적인 목표 금액과 여유분을 더하세요. 목표는 계획을 돕는 기준이지 반드시 그만큼 써야 한다는 약속은 아닙니다.",
          "정산 통화도 하나 정하세요. 여러 통화를 사용한다면 결제일 기준 환율과 카드사 최종 청구액 중 어떤 값을 기록할지 합의하세요. 방식보다 일관성이 더 중요합니다.",
        ],
        bullets: ["선결제 예약마다 실제 참여자 확인", "보증금을 언제 비용으로 볼지 합의", "출발 전에 모든 참여자에게 방 코드 공유"],
      },
      {
        heading: "여행 중: 하루 2분만 정리하세요",
        paragraphs: [
          "큰 지출은 바로 입력하고 작은 비용은 하루가 끝날 때 2분 동안 정리하세요. 회계 장부처럼 완벽할 필요는 없지만 나중에 모두가 알아볼 수 있는 설명은 필요합니다.",
          "현금은 카드 기록이 남지 않으므로 특히 주의해야 합니다. 현금을 인출한 것 자체가 공동지출은 아닙니다. 그 현금으로 실제 구매한 항목과 이용한 사람을 기록하세요.",
        ],
        bullets: ["장소나 날짜가 포함된 구체적인 메모", "개인 쇼핑은 공동 장부에서 제외", "환불은 관련 비용을 고치거나 환불 조정이라고 명확히 기록"],
      },
      {
        heading: "체크아웃 전: 금액이 큰 항목을 확인하세요",
        paragraphs: [
          "숙소, 렌터카, 공연 표처럼 큰 금액은 일행이 흩어지기 전에 확인하세요. 보증금과 환불이 올바르게 반영됐는지, 이용하지 않은 사람이 포함되지는 않았는지 살펴봅니다.",
          "도시세나 마지막 주유비처럼 늦게 생긴 공동 비용도 이때 추가하세요. 서로 다른 시간대로 돌아간 뒤에는 작은 질문도 해결하는 데 오래 걸립니다.",
        ],
      },
      {
        heading: "여행 후: 한 번 정산하고 종료하세요",
        paragraphs: [
          "짧은 검토 기간을 정한 뒤 전체 잔액을 계산하고 최종 송금 계획을 한 번 공유하세요. 영수증마다 따로 갚는 것보다 모든 비용을 합산한 뒤 순잔액으로 정산하는 편이 송금 횟수와 실수를 줄입니다.",
          "송금이 끝나면 단체방에 완료를 확인하고 지출 내역을 일정 기간 보관하세요. 명확한 종료 시점은 돈을 낸 사람과 갚은 사람 모두를 보호합니다.",
        ],
      },
    ],
    takeaway: "좋은 여행 예산은 무거운 회계가 아니라, 범위를 합의하고 꾸준히 기록한 뒤 큰 항목을 확인하고 마지막에 한 번 정산하는 가벼운 습관입니다.",
  },
  {
    slug: "settle-up",
    title: "송금 횟수를 줄이는 정산 원리",
    summary: "각자의 순잔액을 계산하면 모든 영수증을 하나씩 갚지 않고도 정확하게 정산할 수 있습니다.",
    readingTime: "약 5분",
    intro: [
      "여러 사람이 번갈아 결제한 모임에서 영수증마다 돈을 보내면 불필요한 송금이 많아집니다. 정산 계산기는 각자가 낸 금액과 실제 부담해야 할 금액을 먼저 합친 다음, 그 차이만으로 더 짧은 송금 계획을 만듭니다.",
      "이 방식은 누구의 부담액도 바꾸지 않습니다. 모든 지출을 반영한 뒤 돈이 이동하는 경로만 단순하게 만듭니다.",
    ],
    sections: [
      {
        heading: "먼저 각자의 순잔액을 계산합니다",
        paragraphs: [
          "참여자마다 실제 결제액에서 최종 부담액을 뺍니다. 결과가 양수면 그 사람이 돈을 받아야 하고, 음수면 아직 더 내야 합니다. 전체 장부가 완전하다면 반올림 차이를 제외한 양수와 음수의 합은 0이 됩니다.",
          "예를 들어 알렉스가 9만 원을 냈고 자신의 몫이 5만 원이면 순잔액은 +4만 원입니다. 민지는 2만 원을 내고 5만 원을 부담해야 하므로 -3만 원, 샘은 4만 원을 내고 5만 원을 부담하므로 -1만 원입니다.",
        ],
      },
      {
        heading: "보낼 사람과 받을 사람을 연결합니다",
        paragraphs: [
          "위 예시에서는 민지가 알렉스에게 3만 원, 샘이 알렉스에게 1만 원을 보내면 모든 잔액이 0이 됩니다. 원래 영수증을 하나씩 갚았다면 같은 사람들 사이에 더 많은 소액 송금이 필요했을 수 있습니다.",
          "인원이 많아져도 원리는 같습니다. 음수 잔액 한 명을 양수 잔액 한 명과 연결해 어느 한쪽이 0이 될 때까지 금액을 이동하고 다음 사람으로 넘어갑니다.",
        ],
      },
      {
        heading: "왜 처음 보는 사람에게 보내라는 결과가 나올까요?",
        paragraphs: [
          "내가 참여하지 않은 영수증의 결제자에게 송금하라는 결과가 나올 수 있습니다. 이는 영수증별 환급이 아니라 그룹 전체의 순잔액을 정리하기 때문입니다. 각자가 최종적으로 내거나 받는 총액은 달라지지 않습니다.",
          "가족이나 팀 단위로만 송금하고 싶다면 장부나 그룹을 나누어 관리할 수 있습니다. 최소 송금은 편의를 위한 목표이며 일행의 합의를 무시해야 하는 규칙은 아닙니다.",
        ],
      },
      {
        heading: "반올림과 마지막 검증",
        paragraphs: [
          "통화는 보통 가장 작은 결제 단위까지 정산합니다. 1만 원을 3명이 나누면 나머지가 생기므로 한두 명의 몫이 1원 차이 날 수 있습니다. 반올림된 몫을 모두 더했을 때 원래 지출액과 같아야 합니다.",
          "송금 전에 그룹 통화가 맞는지, 유난히 큰 잔액에 입력 오류가 없는지, 삭제된 참여자나 중복 지출이 남아 있지 않은지 확인하세요.",
        ],
        bullets: ["총 결제액과 총 부담액이 같아야 함", "받을 금액 합계와 보낼 금액 합계가 같아야 함", "각 송금은 적어도 한 사람의 잔액을 0으로 만들어야 함"],
      },
    ],
    takeaway: "순잔액 정산은 각자의 최종 부담을 그대로 유지하면서 돈이 빙빙 도는 경로와 영수증별 중복 송금을 줄여 줍니다.",
  },
];

export const getGuides = (korean: boolean) =>
  korean ? koreanGuides : englishGuides;
