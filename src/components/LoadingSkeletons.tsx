'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

// Shimmer animation for skeleton loading
const shimmer = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
};

// Base skeleton component with shimmer effect
export const Skeleton = memo(function Skeleton({
  className = '',
  width,
  height,
}: {
  className?: string;
  width?: string | number;
  height?: string | number;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-700/50 rounded ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial="initial"
        animate="animate"
        variants={shimmer}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
});

// Card skeleton for dashboard cards
export const CardSkeleton = memo(function CardSkeleton() {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-white/10 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-48" />
      <div className="space-y-2 mt-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
});

// Chart skeleton
export const ChartSkeleton = memo(function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
      <div className="p-6" style={{ height }}>
        <div className="flex items-end gap-2 h-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1"
              height={`${30 + Math.random() * 60}%`}
            />
          ))}
        </div>
      </div>
      <div className="px-4 py-3 bg-slate-800/50 border-t border-white/5">
        <Skeleton className="h-3 w-64" />
      </div>
    </div>
  );
});

// Agent activity skeleton
export const AgentSkeleton = memo(function AgentSkeleton() {
  return (
    <div className="pl-4 py-3 border-l-2 border-slate-600">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-12 rounded" />
      </div>
      <Skeleton className="h-1.5 w-full mt-2 ml-11" />
    </div>
  );
});

// Decision path skeleton
export const DecisionPathSkeleton = memo(function DecisionPathSkeleton() {
  return (
    <div className="p-4 rounded-lg bg-slate-800/50 border border-white/10 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton className="h-6 w-12 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-1 w-full rounded-full" />
    </div>
  );
});

// Metrics bar skeleton
export const MetricsSkeleton = memo(function MetricsSkeleton() {
  return (
    <div className="flex gap-4 p-3 bg-slate-900/50 rounded-lg border border-white/10">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
});

// Full page loading overlay
export const PageLoadingOverlay = memo(function PageLoadingOverlay({
  message = 'Processing...',
  progress,
}: {
  message?: string;
  progress?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center space-y-6">
        {/* Animated logo/spinner */}
        <motion.div
          className="relative w-20 h-20 mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500" />
        </motion.div>

        {/* Message */}
        <div className="space-y-2">
          <motion.p
            className="text-lg font-semibold text-white"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {message}
          </motion.p>

          {/* Progress bar (if provided) */}
          {progress !== undefined && (
            <div className="w-64 mx-auto">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{progress}% complete</p>
            </div>
          )}
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-amber-500 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

// Inline loading spinner
export const InlineSpinner = memo(function InlineSpinner({
  size = 16,
  color = 'currentColor',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeOpacity="0.2"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
  );
});

// Success checkmark animation
export const SuccessCheckmark = memo(function SuccessCheckmark({
  size = 48,
  color = '#22C55E',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="26"
        cy="26"
        r="25"
        fill="none"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 27l8 8 16-16"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      />
    </motion.svg>
  );
});

// Pulse dot indicator
export const PulseDot = memo(function PulseDot({
  color = '#22C55E',
  size = 8,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <span className="relative flex" style={{ width: size, height: size }}>
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span
        className="relative inline-flex rounded-full h-full w-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
});
