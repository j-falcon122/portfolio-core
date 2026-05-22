import { getCms } from "@/lib/cms";
import { resolveSinglePageSectionSlugs } from "@/lib/cms/singlePageSections";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export default async function HomePage() {
  const cms = getCms();
  const site = await cms.getSiteSettings();
  const singlePage = (site.navigationMode ?? "routes") === "single-page";

  if (!singlePage) {
    const home = await cms.getPageBySlug("home");
    return <BlockRenderer blocks={home?.blocks || []} />;
  }

  const sectionSlugs = resolveSinglePageSectionSlugs(site);
  const pages = await Promise.all(sectionSlugs.map((s) => cms.getPageBySlug(s)));

  return (
    <>
      {pages.map((p, i) => (
        <section
          id={p?.slug || `section-${i}`}
          key={p?.slug || i}
          className={`page-section${p?.slug ? ` page-section--${p.slug}` : ""}`}
          aria-label={p?.title || p?.slug}
        >
          <div className="page-section__inner">
            <BlockRenderer blocks={p?.blocks || []} />
          </div>
        </section>
      ))}
    </>
  );
}