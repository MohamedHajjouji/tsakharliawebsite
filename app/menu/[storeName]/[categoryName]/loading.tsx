export default function CategoryProductsLoading() {
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
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-1.5" />
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-3 w-10 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Product List Skeleton */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 sm:gap-4 bg-white rounded-2xl border border-gray-100 p-3 sm:p-4"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-1/4 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse flex-shrink-0" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}