"use client";

import { useState, useEffect, useMemo } from "react";
import { newsService, News } from "@/services/news.service";
import Link from "next/link";
import HomeSkeleton from "@/components/homeLoading/HomeSkeleton";

export default function Home() {
  const [allNews, setAllNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      try {
        const res = await newsService.getAll();
        if (isMounted && !res.error) {
          setAllNews(res.data);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchNews();
    return () => { isMounted = false };
  }, []);

  const generateSlug = (title: string) => {
    return title?.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  };

  const { latestBreakingNews, latestNews, topStory, secondaryFeatured, mostRead } = useMemo(() => {
    const breaking = allNews.filter(n => n.isBreaking).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const featured = allNews.filter(n => n.isFeatured);
    const sortedLatest = [...allNews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
    const sortedMostRead = [...allNews].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

    return {
      latestBreakingNews: breaking[0],
      latestNews: sortedLatest,
      topStory: featured[0] || allNews[0],
      secondaryFeatured: featured.slice(1, 3),
      mostRead: sortedMostRead
    };
  }, [allNews]);

  if (loading) return <HomeSkeleton />;

  return (
    <div className="container mx-auto px-4 py-6 font-sans">
      <div className="mb-8 flex items-center overflow-hidden rounded-md bg-black p-1 text-white shadow-md">
        <span className="relative shrink-0 bg-red-600 px-4 py-2 text-xs font-black">Breaking</span>
        <div className="ml-4 overflow-hidden whitespace-nowrap">
          {latestBreakingNews && (
            <Link href={`/news/${latestBreakingNews.slug || generateSlug(latestBreakingNews.title)}`} className="block">
              <marquee className="text-xs font-bold text-gray-200" scrollamount="5">
                {latestBreakingNews.title}
              </marquee>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <aside className="md:col-span-3">
          <div className="mb-6 border-b-2 border-black pb-2">
            <h2 className="text-sm font-black uppercase text-gray-900">Latest News</h2>
          </div>
          <div className="space-y-6">
            {latestNews.map((news) => (
              <Link href={`/news/${news.slug || generateSlug(news.title)}`} key={news.id} className="block group border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-red-600 mb-1">
                  <span className="uppercase">News</span>
                  <span className="text-gray-400">
                    {new Date(news.createdAt).toLocaleDateString()} {new Date(news.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-sm font-bold group-hover:text-red-600 transition-colors line-clamp-2">{news.title}</h3>
              </Link>
            ))}
          </div>
        </aside>

        <main className="md:col-span-6">
          <div className="mb-6 border-b-2 border-black pb-2">
            <h2 className="text-sm font-black text-blue-600 uppercase">Top Stories</h2>
          </div>
          {topStory && (
            <Link href={`/news/${topStory.slug || generateSlug(topStory.title)}`} className="group block">
              {topStory.featuredImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                  <img
                    src={topStory.featuredImage}
                    alt={topStory.title}
                    className="absolute inset-0 h-full w-full object-fill  transition-transform duration-700"
                  />
                </div>
              )}
              <div className={topStory.featuredImage ? "mt-5" : "mt-0"}>
                <h1 className="mb-3 text-3xl font-black group-hover:text-red-600 transition-colors">{topStory.title}</h1>
                <p className="text-gray-600 text-sm line-clamp-3">{topStory.summary || topStory.content?.substring(0, 160)}...</p>
              </div>
            </Link>
          )}

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
            {secondaryFeatured.map((news) => (
              <Link href={`/news/${news.slug || generateSlug(news.title)}`} key={news.id} className="group block">
                {news.featuredImage && (
                  <div className="mb-3 aspect-[16/9] w-full rounded-md bg-gray-200 overflow-hidden shadow-sm">
                    <img
                      src={news.featuredImage}
                      alt={news.title}
                      className="h-full w-full object-fill  transition-transform duration-500"
                    />
                  </div>
                )}
                <h3 className="text-base font-bold group-hover:text-red-600 line-clamp-2 transition-colors">{news.title}</h3>
              </Link>
            ))}
          </div>
        </main>

        <aside className="md:col-span-3">
          <div className="mb-6 border-b-2 border-black pb-2">
            <h2 className="text-sm font-black uppercase text-gray-900">Most Read</h2>
          </div>
          <div className="space-y-6">
            {mostRead.map((news, index) => (
              <Link href={`/news/${news.slug || generateSlug(news.title)}`} key={news.id} className="group flex items-start gap-4">
                <span className="text-3xl font-black text-gray-200 group-hover:text-red-600 transition-colors">{index + 1}</span>
                <div className="border-b border-gray-50 pb-4 w-full">
                  <p className="text-[13px] font-bold text-gray-900 group-hover:text-red-600 line-clamp-2 transition-colors">{news.title}</p>
                  <span className="text-[10px] text-red-500 font-black">{news.viewCount.toLocaleString()} views</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}