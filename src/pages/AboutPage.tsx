import { Link } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import SiteFooter from "../components/SiteFooter";
import { isKorean } from "../i18n";

const AboutPage = () => (
  <>
    <AppHeader
      backTo="/"
      title={isKorean ? "정산도우미 소개" : "About Split Expense"}
      subtitle={
        isKorean
          ? "왜 만들었고, 어떻게 계산하는지"
          : "Why it exists and how the calculation works"
      }
    />
    <main className="content public-page">
      <article className="card about-page">
        <section>
          <p className="eyebrow">{isKorean ? "서비스 목적" : "PURPOSE"}</p>
          <h2>
            {isKorean
              ? "단체 채팅에 흩어진 영수증을 하나의 정산으로"
              : "Turn scattered receipts into one clear settlement"}
          </h2>
          <p>
            {isKorean
              ? "정산도우미는 여행, 모임, 공동생활에서 생기는 비용을 회원가입 없이 함께 기록하기 위해 만든 무료 웹 도구입니다. 방 코드를 공유하면 같은 그룹의 지출을 확인할 수 있고, 각 지출의 결제자와 참여자를 기준으로 최종 정산액을 계산합니다."
              : "Split Expense is a free web tool for recording costs from trips, gatherings, and shared households without requiring an account. A room code gives participants access to the same expense list, and the final settlement is calculated from each expense’s payer and participants."}
          </p>
          <p>
            {isKorean
              ? "이 서비스는 은행 계좌나 카드에 연결되지 않으며 돈을 보관하거나 송금하지 않습니다. 사용자가 입력한 정보로 계산 결과만 제공합니다."
              : "The service does not connect to bank accounts or cards, hold funds, or initiate payments. It only calculates results from information entered by the group."}
          </p>
        </section>

        <section>
          <p className="eyebrow">{isKorean ? "계산 방식" : "METHODOLOGY"}</p>
          <h2>{isKorean ? "검증 가능한 순잔액 방식" : "A verifiable net-balance method"}</h2>
          <p>
            {isKorean
              ? "각 참여자의 총 결제액에서 본인이 부담해야 할 몫을 빼 순잔액을 구합니다. 양수 잔액은 받을 금액, 음수 잔액은 보낼 금액입니다. 이후 양수와 음수 잔액을 연결해 불필요한 송금 경로를 줄입니다. 모든 지출의 부담액 합계와 결제액 합계는 같아야 하므로 사용자는 결과를 직접 검산할 수 있습니다."
              : "For every participant, the calculator subtracts their share of all costs from the amount they paid. A positive balance is money to receive; a negative balance is money to send. Positive and negative balances are then matched to reduce redundant transfers. Because total paid and total owed must be equal, users can verify the result independently."}
          </p>
          <Link className="text-link" to="/guides/settle-up">
            {isKorean ? "계산 원리 자세히 보기" : "Read the settlement method"} <span aria-hidden="true">→</span>
          </Link>
        </section>

        <section>
          <p className="eyebrow">{isKorean ? "운영 원칙" : "OPERATING PRINCIPLES"}</p>
          <h2>{isKorean ? "무료, 최소 수집, 투명한 개선" : "Free, minimal data, transparent improvement"}</h2>
          <ul>
            <li>{isKorean ? "이메일 계정 없이 사용" : "No email account required"}</li>
            <li>{isKorean ? "그룹 정산에 필요한 정보만 저장" : "Only information needed for the shared ledger is stored"}</li>
            <li>{isKorean ? "오류와 개선 요청을 공개 저장소에서 접수" : "Bugs and improvement requests are tracked in the public repository"}</li>
            <li>{isKorean ? "계산 결과를 사용자가 직접 확인할 수 있게 표시" : "Calculation results are presented so users can verify them"}</li>
          </ul>
        </section>

        <section>
          <p className="eyebrow">{isKorean ? "만든 사람·문의" : "MAINTAINER & CONTACT"}</p>
          <h2>{isKorean ? "개인 프로젝트로 운영합니다" : "Maintained as an independent project"}</h2>
          <p>
            {isKorean
              ? "정산도우미는 GitHub 사용자 psh320이 개발·관리합니다. 계산 오류, 접근성 문제, 개인정보 문의, 기능 제안은 아래 공개 저장소의 Issues를 통해 접수할 수 있습니다. 그룹 이름이나 방 코드 같은 개인 데이터는 공개 문의에 적지 마세요."
              : "Split Expense is developed and maintained by GitHub user psh320. Calculation bugs, accessibility issues, privacy questions, and feature suggestions can be submitted through the repository’s Issues page. Do not include private group names or room codes in a public issue."}
          </p>
          <div className="about-links">
            <a href="https://github.com/psh320/travel-split" rel="noreferrer" target="_blank">
              {isKorean ? "소스 저장소" : "Source repository"}
            </a>
            <a href="https://github.com/psh320/travel-split/issues" rel="noreferrer" target="_blank">
              {isKorean ? "문의·오류 제보" : "Contact & bug reports"}
            </a>
          </div>
        </section>
      </article>
    </main>
    <SiteFooter />
  </>
);

export default AboutPage;
