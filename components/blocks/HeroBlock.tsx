import Image from "next/image";
import type { HeroBlock as HeroBlockType } from "@/lib/cms/types";
import { getCms } from "@/lib/cms";
import SinglePageNavLink from "@/components/SinglePageNavLink";

export default async function HeroBlock({
  brandTitle,
  headline,
  subheadline,
  cta,
  backgroundImage
}: HeroBlockType) {
  const site = await getCms().getSiteSettings();
  return (
    <section className="relative -mt-16 min-h-screen w-full overflow-hidden">
      {backgroundImage?.src ? (
        <>
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt || ""}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/45" />
        </>
      ) : (
        <div className="absolute inset-0 bg-neutral-900" />
      )}

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center text-white">
        {brandTitle ? <div className="mb-6 text-sm tracking-[0.18em] opacity-90 uppercase">{brandTitle}</div> : null}

        <h1 className="text-5xl font-bold leading-tight md:text-7xl">
          {headline}
        </h1>

        {subheadline ? (
          <p className="mt-5 max-w-3xl text-lg opacity-90 md:text-2xl">
            {subheadline}
          </p>
        ) : null}

        {cta?.href && cta?.label ? (
          <SinglePageNavLink
            href={cta.href}
            navigationMode={site.navigationMode}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
          >
            {cta.label}
          </SinglePageNavLink>
        ) : null}
      </div>
    </section>
  );
}