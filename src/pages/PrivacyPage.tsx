import { AppHeader } from "../components/ui/AppHeader";
import { getLocale, isKorean, t } from "../i18n";

const privacySections = isKorean
  ? [
      {
        title: "수집 정보",
        items: ["그룹 이름과 메모", "입력한 이름", "지출과 정산 데이터"],
      },
      {
        title: "사용 목적",
        items: ["방 코드로 그룹을 찾기", "공유 지출 저장", "정산 계산"],
      },
      {
        title: "저장",
        items: ["Firebase Firestore", "브라우저 로컬 저장소", "이메일 없이 사용"],
      },
      {
        title: "삭제",
        items: ["지출 삭제", "브라우저 데이터 삭제", "GitHub 이슈로 요청"],
      },
      {
        title: "Google 광고",
        items: [
          "Google AdSense가 광고 제공과 노출 빈도 제한을 위해 쿠키 또는 유사 기술을 사용할 수 있음",
          "페이지 URL, IP 주소, 브라우저 및 기기 정보가 Google에 전송될 수 있음",
          "Google의 동의 관리 메시지에서 맞춤 광고 설정을 선택할 수 있음",
        ],
      },
      {
        title: "Google Analytics",
        items: [
          "방문한 화면, 접속 시간, 브라우저 및 기기 유형 같은 이용 정보를 수집",
          "서비스 이용 현황과 개선이 필요한 부분을 파악하는 데 사용",
          "방 코드, 그룹 ID, 지출 ID는 분석 데이터에 전송하지 않음",
        ],
      },
    ]
  : [
      {
        title: "Information We Collect",
        items: ["Group names and notes", "Names you enter", "Expense data"],
      },
      {
        title: "How We Use It",
        items: ["Find rooms by code", "Store shared expenses", "Calculate balances"],
      },
      {
        title: "Storage",
        items: ["Firebase Firestore", "Browser local storage", "No email required"],
      },
      {
        title: "Deletion",
        items: ["Delete expenses", "Clear browser data", "Ask through GitHub issues"],
      },
      {
        title: "Google advertising",
        items: [
          "Google AdSense may use cookies or similar technologies to serve ads and limit how often they appear",
          "The page URL, IP address, browser, and device information may be sent to Google",
          "Ad personalization choices can be managed through Google's consent message",
        ],
      },
      {
        title: "Google Analytics",
        items: [
          "Collects usage information such as pages viewed, visit times, browser, and device type",
          "Used to understand service usage and identify areas for improvement",
          "Room codes, group IDs, and expense IDs are not sent in analytics data",
        ],
      },
    ];

const lastUpdated = new Intl.DateTimeFormat(
  getLocale() === "ko" ? "ko-KR" : "en-US",
  { dateStyle: "medium", timeZone: "UTC" }
).format(new Date(Date.UTC(2026, 7, 7)));

const PrivacyPage = () => {
  return (
    <>
      <AppHeader
        backTo="/"
        title={t("privacyPolicy")}
        subtitle={isKorean ? "데이터 사용 방식" : "How data is used"}
      />

      <div className="content">
        <div className="card">
          <h3>{t("privacyPolicy")}</h3>
          <p className="muted" style={{ marginBottom: "1rem" }}>
            {isKorean ? "업데이트:" : "Last updated:"} {lastUpdated}
          </p>

          <div style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
            {privacySections.map((section) => (
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
                {isKorean ? "광고 개인정보 선택" : "Advertising privacy choices"}
              </h4>
              <p>
                {isKorean
                  ? "Google이 파트너 사이트의 정보를 사용하는 방식과 광고 설정은 "
                  : "Learn how Google uses information from partner sites and manage your ad settings in "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--ease-color-brand)", textDecoration: "underline" }}
                >
                  {isKorean ? "Google 개인정보 안내" : "Google's privacy information"}
                </a>
                {isKorean ? "에서 확인할 수 있습니다." : "."}
              </p>
            </section>

            <section style={{ marginTop: "1.25rem" }}>
              <h4 style={{ marginBottom: "0.5rem" }}>
                {isKorean ? "문의" : "Contact"}
              </h4>
              <p>
                {isKorean ? "질문은 " : "Questions can be opened in the "}
                <a
                  href="https://github.com/psh320/travel-split"
                  style={{ color: "var(--ease-color-brand)" }}
                >
                  GitHub
                </a>
                {isKorean ? "에 남겨주세요." : " repository."}
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
