import Image from "next/image";
import { Link } from "@/i18n/routing";

export type BlogArticle = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
};

interface BlogArticleProps {
  article: BlogArticle;
}

export default function BlogArticle({ article }: BlogArticleProps) {
  return (
    <article className="group">
      <Link href={article.slug as "/blog"} className="block" draggable={false}>
        <div className="relative mb-4 aspect-16/10 overflow-hidden rounded-sm bg-white/5">
          <Image
            src={article.image}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 33vw, 100vw"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </div>
        <time
          dateTime={article.date}
          className="font-pp-neue-montreal text-xs text-white/50 md:text-sm"
        >
          {article.date}
        </time>
        <h3 className="mt-2 line-clamp-2 font-pp-neue-montreal text-xl leading-tight font-normal text-white md:text-2xl">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 font-pp-neue-montreal text-sm leading-relaxed text-white/70 md:text-base">
          {article.excerpt}
        </p>
        <span className="mt-3 inline-flex translate-y-0 items-center gap-1 font-pp-neue-montreal text-sm text-white/80 opacity-100 transition-all duration-700 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          Read more <span aria-hidden>→</span>
        </span>
      </Link>
    </article>
  );
}
