import { Link, Navigate, useParams } from "react-router-dom";
import { AppHeader } from "../components/ui/AppHeader";
import SiteFooter from "../components/SiteFooter";
import { getGuides } from "../content/guides";
import { isKorean } from "../i18n";

const GuideArticlePage = () => {
  const { slug } = useParams();
  const guide = getGuides(isKorean).find((item) => item.slug === slug);

  if (!guide) return <Navigate to="/guides" replace />;

  return (
    <>
      <AppHeader backTo="/guides" title={guide.title} subtitle={guide.readingTime} />
      <main className="content public-page">
        <article className="card guide-article">
          <header>
            <p className="eyebrow">{isKorean ? "실전 정산 가이드" : "PRACTICAL GUIDE"}</p>
            <p className="guide-deck">{guide.summary}</p>
          </header>

          <div className="article-intro">
            {guide.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <aside className="article-takeaway">
            <strong>{isKorean ? "핵심 정리" : "Key takeaway"}</strong>
            <p>{guide.takeaway}</p>
          </aside>
        </article>

        <nav className="article-next" aria-label={isKorean ? "다음 단계" : "Next steps"}>
          <Link to="/guides">{isKorean ? "모든 가이드 보기" : "Browse all guides"}</Link>
          <Link to="/create-group">{isKorean ? "새 그룹 만들기" : "Create a group"}</Link>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
};

export default GuideArticlePage;
