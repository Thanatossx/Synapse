import { EVENT_CAROUSEL } from "../data/site";
import type { PublicEvent } from "../types/data";

export function fallbackEvents(): PublicEvent[] {
  return EVENT_CAROUSEL.map((e, i) => ({
    id: `fallback-ev-${i}`,
    title: e.title,
    description: e.description,
    image: e.image,
    status: "active" as const,
  }));
}
