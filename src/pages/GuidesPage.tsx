import { Link } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import SiteFooter from "../components/SiteFooter";
import { getGuides } from "../content/guides";
import { isKorean } from "../i18n";

const GuidesPage = () => {
  const guides = getGuides(isKorean);

  return (
    <>
      <AppHeader
        backTo="/"
        title={isKorean ? "공동지출 정산 가이드" : "Shared expense guides"}
        subtitle={
          isKorean
            ? "기록부터 송금까지, 깔끔하게 정산하는 방법"
            : "Practical methods from the first receipt to the final transfer"
        }
      />
      <main className="content public-page">
        <section className="card editorial-intro">
          <p className="eyebrow">{isKorean ? "정산 원칙" : "FIELD NOTES"}</p>
          <h2>
            {isKorean
              ? "계산보다 먼저 정리해야 할 것들"
              : "Good settlement starts before the calculation"}
          </h2>
          <p>
            {isKorean
              ? "공동지출 정산에서 가장 어려운 부분은 수학이 아니라 어떤 비용을 누가 부담할지 일관되게 기록하는 일입니다. 아래 가이드는 실제 모임과 여행에서 생기는 애매한 상황을 줄이는 데 초점을 맞춥니다."
              : "The hardest part of shared expenses is rarely the arithmetic. It is recording who benefited from each cost in a way the whole group understands. These guides focus on the decisions that prevent ambiguity in real trips and gatherings."}
          </p>
        </section>

        <div className="guide-grid">
          {guides.map((guide, index) => (
            <article key={guide.slug} className="card guide-card">
              <span className="guide-number">0{index + 1}</span>
              <div>
                <p className="eyebrow">{guide.readingTime}</p>
                <h2>{guide.title}</h2>
                <p>{guide.summary}</p>
                <Link className="text-link" to={`/guides/${guide.slug}`}>
                  {isKorean ? "가이드 읽기" : "Read the guide"}
                  <span aria-hidden="true"> →</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export default GuidesPage;
