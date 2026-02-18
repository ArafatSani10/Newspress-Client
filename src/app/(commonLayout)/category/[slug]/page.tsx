"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { newsService, News } from "@/services/news.service";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const [allNews, setAllNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchNews = async () => {
      try {
        const res = await newsService.getAll();
        if (!res.error) setAllNews(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const categoryNews = useMemo(() => {
    const slug = params.slug as string;
    return allNews.filter((news) => news.category?.slug === slug);
  }, [allNews, params.slug]);

  const categoryName = categoryNews[0]?.category?.name || (params.slug as string).replace(/-/g, ' ');

  const getYouTubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg` 
      : null;
  };

  const CategorySkeleton = () => (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 mb-8 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-video bg-gray-200 rounded-md"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!mounted || loading) return <CategorySkeleton />;

  return (
    <div className="container mx-auto px-4 py-8 font-sans text-slate-900">
      <div className="mb-10 border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 capitalize italic">
          {categoryName}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          {categoryNews.length} articles found
        </p>
      </div>

      {categoryNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {categoryNews.map((news) => {
            const ytThumb = news.videoUrl ? getYouTubeThumbnail(news.videoUrl) : null;
            const displayImage = news.featuredImage || ytThumb;

            return (
              <Link href={`/news/${news.slug}`} key={news.id} className="group block">
                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-slate-100 mb-4 border border-slate-200">
                  {displayImage ? (
                    <>
                      <Image 
                        src={displayImage} 
                        alt="" 
                        fill 
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                      {news.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <PlayCircle className="text-white w-12 h-12 drop-shadow-lg" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-medium uppercase">
                      No Media
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-[12px] text-slate-500 gap-2">
                    <span className="font-semibold text-red-600">{news.category?.name}</span>
                    <span>/</span>
                    <span>{new Date(news.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <h2 className="text-[18px] font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {news.title}
                  </h2>
                  
                  <p className="text-slate-600 text-[14px] line-clamp-2 leading-relaxed">
                    {news.summary || news.content?.substring(0, 110)}...
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-slate-400 font-medium">No articles available in this category.</p>
          <Link href="/" className="text-blue-600 text-sm mt-4 inline-block hover:underline font-semibold">
            Back to homepage
          </Link>
        </div>
      )}
    </div>
  );
}