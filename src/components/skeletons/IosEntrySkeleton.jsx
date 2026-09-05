"use client";

import { Skeleton } from "boneyard-js/react";
import { MobileShellFallback } from "./MobileShellFallback";

/**
 * Pixel-perfect mobile entry skeleton for iOS PWA cold starts.
 * Bones are pre-generated from MobileShellFixture via `npm run boneyard:build`.
 */
export function IosEntrySkeleton() {
  return (
    <Skeleton
      name="ios-entry"
      loading
      select="viewport"
      animate="shimmer"
      className="min-h-screen bg-background"
      fallback={<MobileShellFallback />}
    >
      <MobileShellFallback />
    </Skeleton>
  );
}
