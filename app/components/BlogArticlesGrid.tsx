import BlogArticleComponent, { BlogArticle } from "./BlogArticle";

const MOCK_ARTICLES: BlogArticle[] = [
  {
    id: "1",
    title: "Strategy that ships: turning ambiguity into clear roadmaps",
    excerpt:
      "We partner with your team to define the real problem, agree on success metrics, and shape an executable plan—scope, constraints, owners, and milestones.",
    date: "Jan 18, 2025",
    image: "/images/cards/charlesdeluvio.jpg",
    slug: "/blog",
  },
  {
    id: "2",
    title: "From discovery to delivery: building systems that scale",
    excerpt:
      "From discovery to delivery, we turn ambiguity into clear priorities and momentum. We validate assumptions with users and data.",
    date: "Jan 12, 2025",
    image: "/images/cards/clay.jpg",
    slug: "/blog",
  },
  {
    id: "3",
    title: "Clarity, fast: sharp research and decision-ready artifacts",
    excerpt:
      "Sharp research, practical strategy, and decision-ready artifacts—so your team stops debating and starts building.",
    date: "Jan 5, 2025",
    image: "/images/cards/malte.jpg",
    slug: "/blog",
  },
  {
    id: "4",
    title: "Delivery you can trust: clean execution and measurable progress",
    excerpt:
      "Clean execution, predictable cadence, and measurable progress—built with maintainability and long-term ownership in mind.",
    date: "Dec 28, 2024",
    image: "/images/cards/zac-wolff.jpg",
    slug: "/blog",
  },
  {
    id: "5",
    title:
      "Engineering excellence: building robust solutions for complex challenges",
    excerpt:
      "Our engineering approach combines deep technical expertise with practical problem-solving to deliver solutions that stand the test of time.",
    date: "Dec 20, 2024",
    image: "/images/cards/charlesdeluvio.jpg",
    slug: "/blog",
  },
  {
    id: "6",
    title: "Technology transformation: accelerating digital innovation",
    excerpt:
      "We help organizations navigate digital transformation by implementing cutting-edge technologies and modern development practices.",
    date: "Dec 15, 2024",
    image: "/images/cards/clay.jpg",
    slug: "/blog",
  },
  {
    id: "7",
    title: "Talent acquisition: finding the right people at the right time",
    excerpt:
      "Our recruitment strategies focus on identifying top talent that aligns with your company culture and long-term business objectives.",
    date: "Dec 10, 2024",
    image: "/images/cards/malte.jpg",
    slug: "/blog",
  },
  {
    id: "8",
    title: "Business operations: optimizing processes for sustainable growth",
    excerpt:
      "We work with businesses to streamline operations, improve efficiency, and create scalable processes that support long-term success.",
    date: "Dec 5, 2024",
    image: "/images/cards/zac-wolff.jpg",
    slug: "/blog",
  },
];

interface BlogArticlesGridProps {
  articles?: BlogArticle[];
}

export default function BlogArticlesGrid({
  articles = MOCK_ARTICLES,
}: BlogArticlesGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
      {articles.map((article) => (
        <BlogArticleComponent key={article.id} article={article} />
      ))}
    </div>
  );
}
