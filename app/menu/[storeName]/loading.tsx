export default function StoreMenuLoading() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
            <div className="flex-1">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-1.5" />
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Grid Skeleton */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="aspect-square w-full bg-gray-100 animate-pulse" />
              <div className="p-3 sm:p-4">
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}