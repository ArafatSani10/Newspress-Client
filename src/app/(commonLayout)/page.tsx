"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 font-sans">
      <div className="mb-8 flex items-center overflow-hidden rounded-md bg-black p-1 text-white shadow-md">
        <span className="relative shrink-0 bg-red-600 px-4 py-2 text-xs font-black ">
          Breaking
        </span>
        <marquee className="ml-4 text-xs font-bold  text-gray-200" scrollamount="5">
          Major headlines appear here • Stay tuned for the latest updates from around the world • Global markets seeing significant shifts today • New technological breakthroughs announced.
        </marquee>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <aside className="md:col-span-3">
          <div className="mb-6 flex items-center justify-between border-b-2 border-black pb-2">
            <h2 className="text-sm font-black ">Latest News</h2>
            <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
          </div>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="group cursor-pointer border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-2 text-[10px] font-semibold   text-red-600 mb-1">
                  <span>Category</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-400">2h ago</span>
                </div>
                <h3 className="text-sm font-bold leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                  News headline goes here and it might span across two lines for better visibility
                </h3>
              </div>
            ))}
          </div>
        </aside>

        <main className="md:col-span-6">
          <div className="mb-6 border-b-2 border-black pb-2">
            <h2 className="text-sm font-black  text-blue-600">Top Stories</h2>
          </div>

          <div className="group cursor-pointer">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
              <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-500"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-red-600 px-3 py-1 text-[10px] font-bold  text-white">Featured</span>
              </div>
            </div>
            <div className="mt-5">
              <h1 className="mb-3 text-3xl font-black leading-tight group-hover:underline decoration-red-600 underline-offset-4">
                Major featured story headline that captures immediate reader attention
              </h1>
              <p className="text-gray-600 leading-relaxed text-sm">
                This is a short summary of the featured article. It provides essential context and gives readers a glimpse of the core content, encouraging them to click and engage with the full story.
              </p>
              <div className="mt-4 flex items-center gap-3 text-[11px] font-bold  text-gray-400">
                <span className="text-black">By News Desk</span>
                <span>•</span>
                <span>15 Feb 2026</span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
            {[1, 2].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="mb-3 aspect-[16/9] w-full rounded-md bg-gray-200 overflow-hidden">
                  <div className="h-full w-full bg-gray-200 group-hover:bg-gray-300 transition-colors"></div>
                </div>
                <h3 className="text-base font-bold leading-tight group-hover:text-red-600 line-clamp-2">
                  Secondary featured news with a compelling title for the readers
                </h3>
                <p className="mt-2 text-xs text-gray-500 font-medium ">5 MIN READ</p>
              </div>
            ))}
          </div>
        </main>

        <aside className="md:col-span-3">
          <div className="mb-6 border-b-2 border-black pb-2">
            <h2 className="text-sm font-black uppercase">Most Read</h2>
          </div>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="group flex cursor-pointer items-start gap-4">
                <span className="text-3xl font-black text-gray-100 group-hover:text-red-600 transition-colors  leading-none">
                  {i}
                </span>
                <div className="border-b border-gray-50 pb-4 w-full">
                  <p className="text-[13px] font-bold leading-tight text-gray-900 group-hover:text-red-600 line-clamp-2 transition-colors">
                    Popular news article that many people are reading right now in this category
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-black  text-gray-400">
                    <span>Trending</span>
                    <span className="text-red-500">1.2k views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-sm border bg-transparent p-6 text-black">
            <h3 className="mb-2 text-md font-black">Join the Insider</h3>
            <p className="mb-5 text-[11px] font-medium leading-relaxed text-gray-400 uppercase">
              Get the top stories delivered to your inbox daily.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white rounded-md border border-2 px-4 py-3 text-[11px] font-bold placeholder:text-gray-500 focus:border-red-600 focus:outline-none transition-all"
              />
              <button className="w-full rounded-md bg-red-600 px-4 py-3 text-[11px] font-black uppercase text-white">
                Subscribe
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}