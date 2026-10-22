import React from "react";

export const SkeletonMovieCard: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/60 animate-pulse">
      <div className="aspect-[2/3] w-full bg-zinc-800/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
      </div>
      <div className="p-3.5 space-y-2">
        <div className="h-4 bg-zinc-800 rounded-md w-3/4" />
        <div className="h-3 bg-zinc-800/60 rounded-md w-1/2" />
      </div>
    </div>
  );
};

export const CategoryPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 bg-zinc-800 rounded-lg w-40" />
          <div className="h-3.5 bg-zinc-800/60 rounded-md w-64" />
        </div>
        <div className="h-9 bg-zinc-800/80 rounded-xl w-full sm:w-80" />
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-4 bg-zinc-800 rounded w-10 shrink-0" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div key={j} className="h-6 w-14 bg-zinc-800/60 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, idx) => (
          <SkeletonMovieCard key={idx} />
        ))}
      </div>
    </div>
  );
};

export const WatchPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video w-full rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-amber-400/40 border-t-amber-400 animate-spin" />
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-3">
            <div className="h-5 bg-zinc-800 rounded w-1/3" />
            <div className="flex gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-8 w-12 bg-zinc-800/70 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-4">
            <div className="aspect-[2/3] w-28 mx-auto bg-zinc-800 rounded-xl" />
            <div className="h-5 bg-zinc-800 rounded w-2/3 mx-auto" />
            <div className="space-y-2">
              <div className="h-3 bg-zinc-800/60 rounded w-full" />
              <div className="h-3 bg-zinc-800/60 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
