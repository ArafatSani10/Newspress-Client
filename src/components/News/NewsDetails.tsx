"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { newsService, News } from "@/services/news.service";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SingleNewsSkeleton from "../homeLoading/SingleNewsSkeleton";
import CommentBox from "./CommentBox";
import CommentList from "./CommentList";

export default function NewsDetails() {
  const params = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const isFetched = useRef(false);

  const getYouTubeEmbedUrl = useCallback((url: string | null | undefined) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  }, []);

  useEffect(() => {
    const fetchPageData = async () => {
      if (isFetched.current) return;

      try {
        if (!params.slug) return;
        isFetched.current = true;

        const decodedSlug = decodeURIComponent(params.slug as string);
        const [detailsRes, allRes] = await Promise.all([
          newsService.getBySlug(decodedSlug),
          newsService.getAll()
        ]);

        if (!detailsRes.error && detailsRes.data) {
          setNews(detailsRes.data);
        }

        if (!allRes.error) {
          setAllNews(allRes.data);
        }
      } catch (err) {
        isFetched.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();

    return () => {
      isFetched.current = false;
    };
  }, [params.slug]);

  const { pagedMoreNews, totalPages } = useMemo(() => {
    const filtered = allNews.filter((item) => item.slug !== news?.slug);
    const start = (currentPage - 1) * itemsPerPage;
    return {
      pagedMoreNews: filtered.slice(start, start + itemsPerPage),
      totalPages: Math.ceil(filtered.length / itemsPerPage) || 1
    };
  }, [allNews, news, currentPage]);

  if (loading) return <SingleNewsSkeleton />;
  if (!news) return <div className="text-center py-20 font-semibold text-gray-400 tracking-wide">News not found!</div>;

  const MediaThumb = ({ item, heightClasses }: { item: News, heightClasses: string }) => {
    const videoId = item.videoUrl ? getYouTubeEmbedUrl(item.videoUrl) : null;

    return (
      <div className={`relative ${heightClasses} w-full overflow-hidden rounded-sm bg-gray-50 mb-3 border border-gray-100 group`}>
        {item.featuredImage ? (
          <Image
            src={item.featuredImage}
            alt={item.title || "News Image"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : videoId ? (
          <iframe
            className="w-full h-full border-0"
            src={videoId}
            loading="lazy"
            title="Video Content"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
            No Media Available
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 font-sans text-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <main className="lg:col-span-8">
          <div className="mb-6">
            <span className="text-[10px] font-semibold tracking-widest text-red-600 uppercase">
              {news.category?.name || "General"}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-semibold leading-tight mb-8 tracking-wide">
            {news.title}
          </h1>

          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
            <div className="relative h-10 w-10 rounded-sm overflow-hidden bg-gray-100 border border-gray-200">
              {news.author?.image ? (
                <Image src={news.author.image} alt={news.author.name || "Author"} fill className="object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white font-semibold text-xs uppercase">
                  {news.author?.name?.charAt(0) || "A"}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">{news.author?.name || "Admin"}</p>
              <p className="text-[11px] text-gray-400">
                {new Date(news.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="mb-12 relative rounded-sm overflow-hidden bg-gray-50 border border-gray-100">
            {news.featuredImage ? (
              <div className="relative w-full aspect-video">
                <Image
                  src={news.featuredImage}
                  alt={news.title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
            ) : news.videoUrl && getYouTubeEmbedUrl(news.videoUrl) ? (
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full border-0"
                  src={getYouTubeEmbedUrl(news.videoUrl) as string}
                  allowFullScreen
                />
              </div>
            ) : null}
          </div>

          <div className="text-gray-800 leading-[1.8] whitespace-pre-wrap font-sans text-base mb-16 px-1">
            {news.content}
          </div>

          <div className="space-y-8 bg-gray-50 p-4 rounded-sm border border-gray-100 mb-16">
            <CommentBox postId={news.id} />
            <CommentList postId={news.id} />
          </div>

          <div className="pt-10 border-t border-gray-200">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900 mb-8 border-b border-gray-900 pb-2">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pagedMoreNews.map((item) => (
                <Link href={`/news/${item.slug}`} key={item.id} className="group block border-b border-gray-50 pb-6 last:border-0 md:border-0 md:pb-0">
                  <MediaThumb item={item} heightClasses="h-60 md:h-44" />
                  <div>
                    <span className="text-[9px] font-semibold text-red-600 uppercase tracking-widest block mb-1">
                      {item.category?.name || "News"}
                    </span>
                    <h4 className="font-semibold text-base group-hover:text-red-600 transition-colors leading-snug tracking-wide line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider font-medium">
                      {new Date(item.createdAt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-center gap-6 pt-6 border-t border-gray-50">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-10 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[11px] font-semibold tracking-[0.2em] text-gray-400">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-10 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </main>

        <aside className="lg:col-span-4">
          <div className="sticky top-10">
            <h3 className="text-xs font-semibold uppercase mb-6 border-b border-gray-900 pb-2 tracking-widest text-gray-500">Must Read</h3>
            <div className="space-y-10">
              {allNews
                .filter(n => n.isFeatured && n.slug !== news.slug)
                .slice(0, 5)
                .map((item) => (
                  <Link href={`/news/${item.slug}`} key={item.id} className="block group border-b border-gray-50 pb-5 last:border-0">
                    <MediaThumb item={item} heightClasses="h-60 lg:h-44" />
                    <span className="text-[9px] font-semibold text-red-600 uppercase tracking-widest block mb-1">
                      {item.category?.name}
                    </span>
                    <h4 className="font-semibold text-sm group-hover:text-red-600 transition-colors leading-tight tracking-wide line-clamp-2">
                      {item.title}
                    </h4>
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}