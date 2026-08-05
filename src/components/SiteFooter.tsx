import { Link } from "react-router-dom";
import { isKorean } from "../i18n";

const SiteFooter = () => (
  <footer className="site-footer">
    <div>
      <strong>{isKorean ? "정산도우미" : "Split Expense"}</strong>
      <p>
        {isKorean
          ? "여행과 모임의 공동 지출을 기록하고, 최소한의 송금으로 정산하는 무료 도구입니다."
          : "A free tool for tracking shared group costs and settling them with fewer transfers."}
      </p>
    </div>
    <nav aria-label={isKorean ? "사이트 안내" : "Site information"}>
      <Link to="/guides">{isKorean ? "정산 가이드" : "Guides"}</Link>
      <Link to="/about">{isKorean ? "서비스 소개" : "About"}</Link>
      <Link to="/privacy">{isKorean ? "개인정보" : "Privacy"}</Link>
      <Link to="/terms">{isKorean ? "이용약관" : "Terms"}</Link>
    </nav>
    <p className="site-footer-note">
      {isKorean
        ? "계산 결과는 입력한 금액과 참여자를 기준으로 하며, 결제·송금 기능은 제공하지 않습니다."
        : "Results are based on the amounts and participants you enter. The service does not process payments."}
    </p>
  </footer>
);

export default SiteFooter;
