interface SkeletonProps {
  className?: string;
}

// Basic skeleton pulse
export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`animate-pulse bg-cream-300 rounded ${className}`} />
);

// Anime card skeleton
export const AnimeCardSkeleton = ({
  variant = "default",
}: {
  variant?: "default" | "compact" | "large";
}) => {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="w-12 h-16 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === "large") {
    return (
      <div className="rounded-2xl overflow-hidden aspect-[3/4]">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
    );
  }

  return (
    <div>
      <Skeleton className="aspect-[3/4] rounded-xl mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
};

// Anime grid skeleton
export const AnimeGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <AnimeCardSkeleton key={i} />
    ))}
  </div>
);

// Search result skeleton
export const SearchResultSkeleton = () => (
  <div className="p-2 space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <AnimeCardSkeleton key={i} variant="compact" />
    ))}
  </div>
);

// Hero section skeleton
export const HeroSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Skeleton className="aspect-[3/4] rounded-2xl" />
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-10 w-32 rounded-full" />
    </div>
  </div>
);

// Text skeleton
export const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
      />
    ))}
  </div>
);

export default Skeleton;
