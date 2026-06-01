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
    ];

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
            {isKorean ? "업데이트:" : "Last updated:"}{" "}
            {new Date().toLocaleDateString(getLocale() === "ko" ? "ko-KR" : "en-US")}
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
