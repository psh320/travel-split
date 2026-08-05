import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isKorean } from "../i18n";

const SITE_URL = "https://splitexpense.web.app";

const publicMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: isKorean
      ? "정산도우미 — 여행·모임 공동지출 정산"
      : "Split Expenses Online Free — Group Bill Calculator",
    description: isKorean
      ? "여행·모임 공동지출을 기록하고 누가 누구에게 얼마를 보내야 하는지 계산하세요. 회원가입 없이 무료로 사용할 수 있습니다."
      : "Track shared travel and group expenses, then calculate who should pay whom. Free to use with no account required.",
  },
  "/guides": {
    title: isKorean ? "공동지출 정산 가이드 | 정산도우미" : "Shared Expense Guides | Split Expense",
    description: isKorean
      ? "공동지출을 공정하게 나누는 방법, 여행 예산 관리, 송금 횟수를 줄이는 정산 원리를 알아보세요."
      : "Learn fair expense splitting, practical travel budget tracking, and how to reduce the number of settlement transfers.",
  },
  "/guides/split-expenses": {
    title: isKorean ? "공동지출을 공정하게 나누는 법 | 정산도우미" : "How to Split Shared Expenses Fairly | Split Expense",
    description: isKorean
      ? "균등 분할과 선택 참여 지출을 구분하고, 결제자·부담자를 정확히 기록하는 실전 방법입니다."
      : "A practical guide to equal splits, participant-specific costs, and accurately recording payers and beneficiaries.",
  },
  "/guides/travel-budget": {
    title: isKorean ? "여행 공동경비 관리법 | 정산도우미" : "How to Manage a Group Travel Budget | Split Expense",
    description: isKorean
      ? "여행 전 준비부터 현지 기록, 귀국 후 정산까지 공동경비를 놓치지 않는 체크리스트입니다."
      : "A checklist for shared travel costs, from pre-trip planning and daily tracking to the final settlement.",
  },
  "/guides/settle-up": {
    title: isKorean ? "송금 횟수를 줄이는 정산 원리 | 정산도우미" : "How Fewer-Transfer Settlement Works | Split Expense",
    description: isKorean
      ? "각자의 순잔액을 계산해 불필요한 송금을 줄이는 공동지출 정산 원리를 예시로 설명합니다."
      : "See how net balances reduce unnecessary transfers, with a clear group-expense example.",
  },
  "/about": {
    title: isKorean ? "서비스 소개 | 정산도우미" : "About Split Expense",
    description: isKorean
      ? "정산도우미가 만들어진 이유, 계산 방식, 데이터 처리 원칙과 문의 방법을 안내합니다."
      : "Why Split Expense exists, how its calculations work, how data is handled, and how to get in touch.",
  },
  "/privacy": {
    title: isKorean ? "개인정보 처리방침 | 정산도우미" : "Privacy Policy | Split Expense",
    description: isKorean
      ? "정산도우미가 수집·저장하는 정보와 이용자의 데이터 관리 방법을 확인하세요."
      : "Learn what information Split Expense stores and how users can manage their data.",
  },
  "/terms": {
    title: isKorean ? "이용약관 | 정산도우미" : "Terms of Service | Split Expense",
    description: isKorean
      ? "정산도우미의 이용 조건과 계산 결과에 관한 안내입니다."
      : "Terms for using Split Expense and important information about calculation results.",
  },
};

const setMeta = (name: string, content: string) => {
  let element = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
};

const RouteMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = publicMeta[pathname];
    const canonicalPath = meta ? pathname : "/";

    document.title = meta?.title ?? (isKorean ? "정산도우미" : "Split Expense");
    setMeta(
      "description",
      meta?.description ??
        (isKorean
          ? "회원가입 없이 사용하는 공동지출 정산 도구입니다."
          : "A no-account shared expense calculator.")
    );
    setMeta("robots", meta ? "index, follow" : "noindex, nofollow, noarchive");

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
  }, [pathname]);

  return null;
};

export default RouteMeta;
