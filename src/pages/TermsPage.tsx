import { Link } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import { getLocale, isKorean, t } from "../i18n";

const termsSections = isKorean
  ? [
      {
        title: "서비스",
        items: ["방 코드로 그룹 생성", "공유 지출 기록", "정산 금액 계산"],
      },
      {
        title: "사용자 책임",
        items: ["정확한 금액 입력", "정상적인 지출 정산에 사용", "다른 사용자의 데이터 존중"],
      },
      {
        title: "제한",
        items: ["계산 결과 확인 필요", "서비스 중단 가능", "데이터 보관 보장 없음"],
      },
      {
        title: "광고",
        items: ["무료 서비스 운영을 위해 Google 광고가 표시될 수 있음", "광고는 닫거나 건너뛸 수 있음"],
      },
    ]
  : [
      {
        title: "Service",
        items: ["Create groups by room code", "Track shared expenses", "Calculate balances"],
      },
      {
        title: "Responsibilities",
        items: ["Enter accurate amounts", "Use it for real expense splitting", "Respect other users' data"],
      },
      {
        title: "Limits",
        items: ["Check calculations before paying", "Service may be unavailable", "Data storage is not guaranteed"],
      },
      {
        title: "Advertising",
        items: ["Google ads may be shown to keep the service free", "Overlay ads can be dismissed or skipped"],
      },
    ];

const lastUpdated = new Intl.DateTimeFormat(
  getLocale() === "ko" ? "ko-KR" : "en-US",
  { dateStyle: "medium", timeZone: "UTC" }
).format(new Date(Date.UTC(2026, 6, 16)));

const TermsPage = () => {
  return (
    <>
      <AppHeader
        backTo="/"
        title={t("termsOfService")}
        subtitle={isKorean ? "이용 조건" : "Terms and conditions"}
      />

      <div className="content">
        <div className="card">
          <h3>{t("termsOfService")}</h3>
          <p className="muted" style={{ marginBottom: "1rem" }}>
            {isKorean ? "업데이트:" : "Last updated:"} {lastUpdated}
          </p>

          <div style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
            {termsSections.map((section) => (
              <section key={section.title} style={{ marginTop: "1.25rem" }}>
                <h4 style={{ marginBottom: "0.5rem" }}>{section.title}</h4>
                <ul style={{ marginLeft: "1rem" }}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}

            <section style={{ marginTop: "1.25rem" }}>
              <h4 style={{ marginBottom: "0.5rem" }}>
                {isKorean ? "개인정보" : "Privacy"}
              </h4>
              <p>
                {isKorean ? "데이터 사용 방식은 " : "See the "}
                <Link
                  to="/privacy"
                  style={{ color: "var(--ease-color-brand)" }}
                  data-google-vignette="false"
                >
                  {t("privacyPolicy")}
                </Link>
                {isKorean ? "에서 확인하세요." : " for data details."}
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
