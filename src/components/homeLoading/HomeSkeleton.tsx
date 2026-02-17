export default function HomeSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 animate-pulse">
      {/* Breaking News Skeleton */}
      <div className="mb-8 h-10 w-full bg-gray-200 rounded-md"></div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
        {/* Left Sidebar Skeleton */}
        <aside className="md:col-span-3 space-y-6">
          <div className="h-6 w-32 bg-gray-300 mb-4"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-gray-200"></div>
              <div className="h-4 w-full bg-gray-200"></div>
            </div>
          ))}
        </aside>

        {/* Main Content Skeleton */}
        <main className="md:col-span-6">
          <div className="h-6 w-32 bg-gray-300 mb-6"></div>
          <div className="aspect-video w-full bg-gray-200 rounded-lg mb-5"></div>
          <div className="h-8 w-3/4 bg-gray-200 mb-3"></div>
          <div className="h-4 w-full bg-gray-200 mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-200"></div>
          
          <div className="mt-10 grid grid-cols-2 gap-8">
            <div className="h-40 bg-gray-200 rounded-md"></div>
            <div className="h-40 bg-gray-200 rounded-md"></div>
          </div>
        </main>

        {/* Right Sidebar Skeleton */}
        <aside className="md:col-span-3 space-y-6">
          <div className="h-6 w-32 bg-gray-300 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 bg-gray-200 shrink-0"></div>
              <div className="w-full space-y-2">
                <div className="h-4 w-full bg-gray-200"></div>
                <div className="h-3 w-1/2 bg-gray-200"></div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}