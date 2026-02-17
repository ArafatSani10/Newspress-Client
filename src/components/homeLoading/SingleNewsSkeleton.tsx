export default function SingleNewsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="h-4 w-24 bg-gray-200 mb-4"></div>
          <div className="h-12 w-full bg-gray-200 mb-6"></div>
          <div className="flex gap-4 mb-8">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200"></div>
              <div className="h-3 w-20 bg-gray-200"></div>
            </div>
          </div>
          <div className="aspect-video w-full bg-gray-200 rounded-xl mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200"></div>
            <div className="h-4 w-full bg-gray-200"></div>
            <div className="h-4 w-3/4 bg-gray-200"></div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-8">
          <div className="h-64 bg-gray-100 rounded-xl"></div>
          <div className="h-64 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}