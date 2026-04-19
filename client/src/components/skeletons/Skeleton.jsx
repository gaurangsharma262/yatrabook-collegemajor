export default function Skeleton({ className = '', variant = 'rect' }) {
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div className={`skeleton skeleton-shimmer ${variants[variant]} ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-0.5 flex-1" />
        <div className="text-center space-y-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-white/5">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
