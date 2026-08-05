import { Link } from "react-router-dom";
import { isKorean, t, type CopyKey } from "../i18n";

const faqItems: Array<[CopyKey, CopyKey]> = [
  ["faqQuestion1", "faqAnswer1"],
  ["faqQuestion2", "faqAnswer2"],
  ["faqQuestion3", "faqAnswer3"],
  ["faqQuestion4", "faqAnswer4"],
  ["faqQuestion5", "faqAnswer5"],
];

const SEOContent = () => (
  <section className="public-home-content" aria-labelledby="how-splitting-works">
    <div className="card public-explainer">
      <p className="eyebrow">{isKorean ? "공동지출 정산" : "SHARED EXPENSE BASICS"}</p>
      <h2 id="how-splitting-works">
        {isKorean
          ? "누가 결제했는지와 누가 부담하는지를 분리하세요"
          : "Separate who paid from who shares the cost"}
      </h2>
      <p>
        {isKorean
          ? "공동지출은 결제한 사람과 실제 비용을 나눌 사람이 다를 수 있습니다. 한 사람이 식사비를 먼저 냈더라도 식사에 참여한 모두가 각자의 몫을 부담해야 합니다. 정산도우미는 지출마다 결제자와 참여자를 따로 기록하고, 전체 지출을 합산해 각자의 최종 잔액을 계산합니다."
          : "The person who pays at the register is not necessarily the only person responsible for the cost. Split Expense records the payer and the participating people separately, then combines every entry to calculate each person’s final net balance."}
      </p>
      <p>
        {isKorean
          ? "영수증마다 돈을 주고받는 대신 모든 잔액을 먼저 합치기 때문에 불필요한 송금을 줄일 수 있습니다. 계산 결과는 입력한 금액과 참여자를 그대로 반영하며, 결제나 송금을 직접 처리하지 않습니다."
          : "Instead of reimbursing every receipt one at a time, the calculator nets all balances first. This can reduce redundant transfers while preserving what every person ultimately owes. It never moves money or connects to a bank account."}
      </p>

      <div className="principle-grid">
        <div>
          <span>01</span>
          <h3>{isKorean ? "지출별 참여자 선택" : "Choose participants"}</h3>
          <p>
            {isKorean
              ? "모두가 이용한 비용은 균등하게, 선택 활동은 실제 참여자끼리만 나눕니다."
              : "Split group-wide costs equally and optional activities only among the people involved."}
          </p>
        </div>
        <div>
          <span>02</span>
          <h3>{isKorean ? "순잔액 계산" : "Calculate net balances"}</h3>
          <p>
            {isKorean
              ? "각자가 결제한 금액에서 자신의 부담액을 빼 받을 돈과 보낼 돈을 구합니다."
              : "Subtract each person’s share from what they paid to find what they should receive or send."}
          </p>
        </div>
        <div>
          <span>03</span>
          <h3>{isKorean ? "최종 송금 단순화" : "Simplify settlement"}</h3>
          <p>
            {isKorean
              ? "받을 사람과 보낼 사람을 연결해 같은 돈이 여러 번 오가는 상황을 줄입니다."
              : "Match positive and negative balances to remove payment loops and unnecessary transfers."}
          </p>
        </div>
      </div>
    </div>

    <div className="card resource-card">
      <div className="section-heading public-section-heading">
        <div>
          <p className="eyebrow">{isKorean ? "더 알아보기" : "LEARN THE METHOD"}</p>
          <h2>{isKorean ? "실전 정산 가이드" : "Practical settlement guides"}</h2>
        </div>
        <Link className="text-link" to="/guides">
          {isKorean ? "전체 보기" : "View all"} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="resource-links">
        <Link to="/guides/split-expenses">
          <strong>{isKorean ? "공동지출을 공정하게 나누는 법" : "How to split shared expenses fairly"}</strong>
          <span>{isKorean ? "균등 분할과 선택 참여를 구분하는 기준" : "Equal splits, optional costs, and accurate records"}</span>
        </Link>
        <Link to="/guides/travel-budget">
          <strong>{isKorean ? "여행 공동경비 관리법" : "A group travel budget workflow"}</strong>
          <span>{isKorean ? "출발 전부터 마지막 송금까지의 체크리스트" : "A checklist from planning to the final transfer"}</span>
        </Link>
        <Link to="/guides/settle-up">
          <strong>{isKorean ? "송금 횟수를 줄이는 원리" : "How fewer-transfer settlement works"}</strong>
          <span>{isKorean ? "순잔액과 정산 경로를 예시로 이해하기" : "Understand net balances with a clear example"}</span>
        </Link>
      </div>
    </div>

    <div className="card faq-card">
      <p className="eyebrow">FAQ</p>
      <h2>{t("faqTitle")}</h2>
      <div className="faq-list">
        {faqItems.map(([question, answer]) => (
          <section key={question}>
            <h3>{t(question)}</h3>
            <p>{t(answer)}</p>
          </section>
        ))}
      </div>
    </div>
  </section>
);

export default SEOContent;
