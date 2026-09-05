"use client";

import { Skeleton } from "boneyard-js/react";
import { MobileShellFixture } from "@/components/skeletons/MobileShellFixture";

/**
 * Dev-only capture target for `npm run boneyard:build`.
 * The CLI visits this route and snapshots the named skeleton at 375px.
 */
export default function BoneyardCapturePage() {
  return (
    <Skeleton
      name="ios-entry"
      loading={false}
      select="viewport"
      animate="shimmer"
      fixture={<MobileShellFixture />}
    >
      <MobileShellFixture />
    </Skeleton>
  );
}
