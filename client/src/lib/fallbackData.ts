import { BRACELET_ITEMS, EVENT_CAROUSEL } from "../data/site";
import type { PublicBracelet, PublicEvent } from "../types/data";

export function fallbackEvents(): PublicEvent[] {
  return EVENT_CAROUSEL.map((e, i) => ({
    id: `fallback-ev-${i}`,
    title: e.title,
    description: e.description,
    image: e.image,
    status: "active" as const,
  }));
}

export function fallbackBracelets(): PublicBracelet[] {
  return BRACELET_ITEMS.map((b, i) => ({
    id: `fallback-br-${i}`,
    title: b.title,
    description: b.description,
    image: b.image,
  }));
}
