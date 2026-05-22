/** Matches SiteHeader `h-16` and `--header-height` in globals.css */
export const PAGE_HEADER_OFFSET_PX = 64;

export function normalizePageSectionId(hashOrSlug: string): string {
  const raw = hashOrSlug.replace(/^#/, "").trim();
  if (!raw || raw === "/") return "home";
  const seg = raw.match(/^\/([^/]+)/)?.[1] ?? raw;
  return seg;
}

/** Scroll so the section top sits just below the fixed header. */
export function scrollToPageSection(
  sectionId: string,
  behavior: ScrollBehavior = "smooth"
): boolean {
  if (typeof window === "undefined") return false;

  const id = normalizePageSectionId(sectionId);
  const el = document.getElementById(id);
  if (!el) return false;

  const root = document.documentElement;
  const varOffset = parseFloat(
    getComputedStyle(root).getPropertyValue("--header-height")
  );
  const offset = Number.isFinite(varOffset) ? varOffset : PAGE_HEADER_OFFSET_PX;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}
