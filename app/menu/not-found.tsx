import Link from "next/link";

export default function MenuNotFound() {
  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gray-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Store not found
        </h1>
        <p className="text-gray-500 mb-8">
          We couldn't find the store or category you're looking for.
          It may have been removed or the link might be incorrect.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:shadow-lg active:scale-95"
          style={{ backgroundColor: "#D02828" }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Go Home
        </Link>
      </div>
    </div>
  );
}