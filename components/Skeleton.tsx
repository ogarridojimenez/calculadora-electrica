"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-[var(--border-default)] rounded ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="w-32 h-5 rounded" />
          <Skeleton className="w-24 h-4 rounded" />
        </div>
      </div>
      <Skeleton className="w-full h-20 rounded-lg" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );
}

export function ResultSkeleton() {
  return (
    <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="w-20 h-4 rounded" />
          <Skeleton className="w-40 h-10 rounded" />
        </div>
        <Skeleton className="w-24 h-6 rounded" />
      </div>
      <Skeleton className="w-full h-16 rounded-lg" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-xl p-4 text-center">
      <Skeleton className="w-12 h-12 rounded-lg mx-auto mb-3" />
      <Skeleton className="w-12 h-8 rounded mx-auto" />
      <Skeleton className="w-16 h-3 rounded mx-auto mt-2" />
    </div>
  );
}
