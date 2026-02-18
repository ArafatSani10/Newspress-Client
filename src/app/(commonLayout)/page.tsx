"use client";

import { useState, useEffect, useMemo } from "react";
import { newsService, News } from "@/services/news.service";
import Link from "next/link";
import Image from "next/image";
import HomeSkeleton from "@/components/homeLoading/HomeSkeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [allNews, setAllNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const [latestPage, setLatestPage] = useState(1);
  const [topPage, setTopPage] = useState(1);
  const [mostReadPage, setMostReadPage] = useState(1);
  
  const itemsPerPage = 4;
  const itemsPerPageTop = 3; 

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      try {
        const res = await newsService.getAll();
        if (isMounted && !res.error) setAllNews(res.data);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchNews();
    return () => { isMounted = false };
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const { 
    latestBreakingNews, 
    pagedLatestNews, 
    latestTotal,
    pagedTopStories,
    topTotal,
    pagedMostRead,
    mostReadTotal
  } = useMemo(() => {
    const sortedAll = [...allNews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const breaking = sortedAll.filter(n => n.isBreaking);
    const featured = sortedAll.filter(n => n.isFeatured);
    const sortedMostRead = [...allNews].sort((a, b) => b.viewCount - a.viewCount);

    return {
      latestBreakingNews: breaking[0],
      pagedLatestNews: sortedAll.slice((latestPage - 1) * itemsPerPage, latestPage * itemsPerPage),
      latestTotal: Math.ceil(sortedAll.length / itemsPerPage),
      pagedTopStories: (featured.length > 0 ? featured : sortedAll).slice((topPage - 1) * itemsPerPageTop, topPage * itemsPerPageTop),
      topTotal: Math.ceil((featured.length > 0 ? featured : sortedAll).length / itemsPerPageTop),
      pagedMostRead: sortedMostRead.slice((mostReadPage - 1) * itemsPerPage, mostReadPage * itemsPerPage),
      mostReadTotal: Math.ceil(sortedMostRead.length / itemsPerPage)
    };
  }, [allNews, latestPage, topPage, mostReadPage]);

  if (loading) return <HomeSkeleton />;

  const MediaThumb = ({ news, heightClasses }: { news: News, heightClasses: string }) => (
    <div className={`relative ${heightClasses} w-full overflow-hidden rounded-sm bg-gray-50 mb-3 border border-gray-100`}>
      {news.featuredImage ? (
        <Image 
          src={news.featuredImage} 
          alt="" 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      ) : news.videoUrl ? (
        <iframe className="w-full h-full border-0" src={getYouTubeEmbedUrl(news.videoUrl) || ""} />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400 font-semibold uppercase tracking-widest">No Media</div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 font-sans text-gray-900">
      {/* Breaking News Marquee */}
      <div className="mb-10 flex items-center bg-gray-50 border border-gray-200 p-1 rounded-sm">
        <span className="shrink-0 bg-gray-900 text-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest rounded-sm">Breaking</span>
        <div className="ml-4 flex-1 overflow-hidden">
          {latestBreakingNews && (
            <Link href={`/news/${latestBreakingNews.slug}`} className="block">
              <marquee className="text-sm font-medium tracking-wide" scrollamount="5">{latestBreakingNews.title}</marquee>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        {/* Left Sidebar: Latest News */}
        <aside className="md:col-span-3 order-2 md:order-1">
          <div className="mb-6 border-b border-gray-900 pb-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Latest News</h2>
          </div>
          <div className="space-y-10 md:space-y-8">
            {pagedLatestNews.map((news) => (
              <Link href={`/news/${news.slug}`} key={news.id} className="block group border-b border-gray-50 pb-5 last:border-0">
                <MediaThumb news={news} heightClasses="h-60 md:h-44" />
                <div className="text-[10px] font-semibold text-red-600 mb-1 tracking-wide uppercase">
                  {new Date(news.createdAt).toLocaleDateString("en-US")}
                </div>
                <h3 className="text-base md:text-sm font-semibold group-hover:text-red-600 transition-colors line-clamp-2 leading-snug tracking-wide">{news.title}</h3>
              </Link>
            ))}
          </div>
          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100">
             <button onClick={() => setLatestPage(p => Math.max(1, p - 1))} disabled={latestPage === 1} className="p-1 disabled:opacity-10 transition-all hover:bg-gray-100 rounded-full"><ChevronLeft size={18}/></button>
             <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">{latestPage} / {latestTotal}</span>
             <button onClick={() => setLatestPage(p => Math.min(latestTotal, p + 1))} disabled={latestPage === latestTotal} className="p-1 disabled:opacity-10 transition-all hover:bg-gray-100 rounded-full"><ChevronRight size={18}/></button>
          </div>
        </aside>

        {/* Center Main: Featured Stories */}
        <main className="md:col-span-6 order-1 md:order-2">
          <div className="mb-6 border-b border-gray-900 pb-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-900">Featured Stories</h2>
          </div>
          
          {pagedTopStories.length > 0 && (
            <div className="space-y-12">
              <Link href={`/news/${pagedTopStories[0].slug}`} className="group block">
                <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-gray-50 mb-5 border border-gray-100">
                  {pagedTopStories[0].featuredImage ? (
                    <Image src={pagedTopStories[0].featuredImage} alt="" fill className="object-cover transition-transform group-hover:scale-105 duration-700" />
                  ) : (
                    <iframe className="w-full h-full border-0" src={getYouTubeEmbedUrl(pagedTopStories[0].videoUrl || "") || ""} />
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold group-hover:text-red-600 leading-tight mb-3 tracking-wide transition-colors">{pagedTopStories[0].title}</h1>
                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed tracking-wide">{pagedTopStories[0].summary || pagedTopStories[0].content?.substring(0, 160)}</p>
              </Link>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                {pagedTopStories.slice(1, 3).map((news) => (
                  <Link href={`/news/${news.slug}`} key={news.id} className="group block">
                    <MediaThumb news={news} heightClasses="aspect-video" />
                    <h3 className="text-sm md:text-base font-semibold group-hover:text-red-600 transition-colors line-clamp-2 leading-snug tracking-wide">{news.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-center gap-6 pt-6 border-t border-gray-100">
             <button onClick={() => setTopPage(p => Math.max(1, p - 1))} disabled={topPage === 1} className="p-1 disabled:opacity-10 transition-all hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
             <span className="text-[11px] font-semibold tracking-[0.2em] text-gray-400">{topPage} / {topTotal}</span>
             <button onClick={() => setTopPage(p => Math.min(topTotal, p + 1))} disabled={topPage === topTotal} className="p-1 disabled:opacity-10 transition-all hover:bg-gray-100 rounded-full"><ChevronRight size={20}/></button>
          </div>
        </main>

        {/* Right Sidebar: Popular News */}
        <aside className="md:col-span-3 order-3">
          <div className="mb-6 border-b border-gray-900 pb-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Popular</h2>
          </div>
          <div className="space-y-10 md:space-y-6">
            {pagedMostRead.map((news, index) => (
              <Link href={`/news/${news.slug}`} key={news.id} className="group block border-b border-gray-50 pb-5 last:border-0">
                {/* Image added here for Popular section */}
                <MediaThumb news={news} heightClasses="h-60 md:h-44" />
                
                <div className="flex gap-4">
                  <span className="text-xl font-semibold text-gray-200 group-hover:text-red-600 transition-colors leading-none">
                    {String((mostReadPage - 1) * itemsPerPage + index + 1).padStart(2, '0')}
                  </span>
                  <div className="w-full">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight tracking-wide">{news.title}</h3>
                    <div className="flex justify-between mt-2 font-semibold text-[9px] uppercase tracking-wider">
                      <span className="text-gray-400">{new Date(news.createdAt).toLocaleDateString("en-US")}</span>
                      <span className="text-red-600">{news.viewCount.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100">
             <button onClick={() => setMostReadPage(p => Math.max(1, p - 1))} disabled={mostReadPage === 1} className="p-1 disabled:opacity-10 transition-all hover:bg-gray-100 rounded-full"><ChevronLeft size={18}/></button>
             <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">{mostReadPage} / {mostReadTotal}</span>
             <button onClick={() => setMostReadPage(p => Math.min(mostReadTotal, p + 1))} disabled={mostReadPage === mostReadTotal} className="p-1 disabled:opacity-10 transition-all hover:bg-gray-100 rounded-full"><ChevronRight size={18}/></button>
          </div>
        </aside>
      </div>
    </div>
  );
}