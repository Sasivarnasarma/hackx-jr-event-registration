import React from "react";

/**
 * Animated glassmorphic skeleton loader for the Admin Dashboard.
 * Displays automatically during Next.js server-side database fetches.
 */
export default function DashboardLoading() {
  return (
    <div className="w-full min-h-screen bg-[#010E13] px-4 py-8 relative z-10 select-none">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Header Block skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/40">
          <div className="space-y-3">
            {/* Logo/Title skeleton */}
            <div className="h-10 w-52 bg-slate-800/60 rounded-xl" />
            {/* Subtitle skeleton */}
            <div className="h-4 w-36 bg-slate-800/40 rounded-lg" />
          </div>
          {/* Logout Button skeleton */}
          <div className="h-11 w-28 bg-slate-800/50 rounded-xl self-start md:self-auto" />
        </div>

        {/* 4 Stats Cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="glass-panel p-5 rounded-2xl border border-slate-800/40 space-y-3"
            >
              <div className="h-3 w-16 bg-slate-800/50 rounded" />
              <div className="h-8 w-12 bg-slate-800/70 rounded-lg" />
              <div className="h-2 w-20 bg-slate-800/30 rounded" />
            </div>
          ))}
        </div>

        {/* Filter Controls skeleton */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800/30 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
          {/* Search bar skeleton */}
          <div className="flex-1 max-w-md h-10 bg-slate-800/40 rounded-xl" />

          {/* Action filters skeleton */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-10 w-28 bg-slate-800/40 rounded-xl" />
            <div className="h-10 w-28 bg-slate-800/40 rounded-xl" />
            <div className="h-10 w-28 bg-slate-800/40 rounded-xl" />
            <div className="h-10 w-24 bg-slate-800/50 rounded-xl" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800/40">
          {/* Header Row */}
          <div className="h-12 w-full bg-slate-900/60 border-b border-slate-800/60 flex items-center px-6 justify-between">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-3 w-12 bg-slate-800/50 rounded" />
            ))}
          </div>

          {/* Data Rows */}
          <div className="divide-y divide-slate-800/40">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 w-full flex items-center px-6 justify-between">
                <div className="h-3.5 w-6 bg-slate-800/60 rounded" />
                <div className="h-3.5 w-24 bg-slate-800/60 rounded" />
                <div className="h-3.5 w-20 bg-slate-800/60 rounded" />
                <div className="h-3.5 w-24 bg-slate-800/40 rounded" />
                <div className="h-3.5 w-16 bg-slate-800/50 rounded" />
                <div className="h-3.5 w-28 bg-slate-800/40 rounded" />
                <div className="h-3.5 w-10 bg-slate-800/50 rounded" />
                <div className="h-3.5 w-16 bg-slate-800/40 rounded" />
                <div className="h-3.5 w-16 bg-slate-800/30 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
