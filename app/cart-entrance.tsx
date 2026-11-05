"use client";

import { useLayoutEffect, useRef } from "react";
import { prepareCartEntrance } from "./cart-motion";

/** Let Pimolu finish mounting and focusing the drawer before it starts moving. */
export default function CartEntrance({ open }: { open: boolean }) {
  const marker = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const panel = marker.current?.closest<HTMLElement>(".cart-drawer");
    if (!panel) return;

    return prepareCartEntrance(
      panel,
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, [open]);

  return <span ref={marker} hidden aria-hidden="true" />;
}
