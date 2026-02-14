export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* ১. ব্রেকিং নিউজ বার */}
      <div className="bg-black text-white p-2 mb-8 flex items-center overflow-hidden">
        <span className="bg-red-600 px-3 py-1 text-sm font-bold mr-4 shrink-0">ব্রেকিং</span>
        <marquee className="text-sm italic">এখানে তোমার isBreaking: true নিউজগুলো ডাটাবেস থেকে আসবে...</marquee>
      </div>

      {/* ২. মেইন কন্টেন্ট গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* বাম পাশ: সর্বশেষ নিউজ (Col 3) */}
        <aside className="md:col-span-3 space-y-6 border-r pr-4">
          <h2 className="text-xl font-bold border-b-2 border-red-600 pb-1 mb-4">সর্বশেষ</h2>
          {/* নিউজ কার্ড লুপ */}
          <div className="space-y-4">
             <div className="h-20 bg-gray-100 animate-pulse rounded"></div>
             <div className="h-20 bg-gray-100 animate-pulse rounded"></div>
          </div>
        </aside>

        {/* মাঝখান: বড় ফিচারড নিউজ (Col 6) */}
        <main className="md:col-span-6 border-r pr-4">
          <h2 className="text-xl font-bold border-b-2 border-blue-600 pb-1 mb-4">প্রধান সংবাদ</h2>
          <div className="w-full aspect-video bg-gray-200 rounded-lg mb-4"></div>
          <h1 className="text-3xl font-extrabold leading-tight">ফিচারড নিউজ টাইটেল (isFeatured)</h1>
          <p className="mt-2 text-gray-600">নিউজ সামারি এখানে আসবে...</p>
        </main>

        {/* ডান পাশ: ট্রেন্ডিং (Col 3) */}
        <aside className="md:col-span-3">
          <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-4">জনপ্রিয়</h2>
          <div className="space-y-4">
             {/* viewCount অনুযায়ী সর্ট করা নিউজ */}
             <div className="flex gap-4">
                <span className="text-3xl font-bold text-gray-300">০১</span>
                <p className="font-semibold">ট্রেন্ডিং নিউজ টাইটেল...</p>
             </div>
          </div>
        </aside>

      </div>
    </div>
  );
}