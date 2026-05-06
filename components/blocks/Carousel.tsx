"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/cms/types";

export default function Carousel({
  items = [],
  className = "",
  showControls = true,
}: {
  items?: GalleryItem[];
  className?: string;
  showControls?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: 0 });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoplayRef = useRef<number | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    if (items.length > 0) {
      emblaApi.scrollTo(0);
    }

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, items.length]);

  useEffect(() => {
    if (!emblaApi) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") emblaApi.scrollPrev();
      else if (e.key === "ArrowRight") emblaApi.scrollNext();
      else if (e.key === " ") setIsPlaying((p) => !p);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    if (isPlaying) {
      autoplayRef.current = window.setInterval(() => emblaApi.scrollNext(), 4000);
    } else if (autoplayRef.current !== null) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }

    return () => {
      if (autoplayRef.current !== null) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isPlaying, emblaApi]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onPlay = () => setIsPlaying(false);
    const videos = Array.from(root.querySelectorAll("video")) as HTMLVideoElement[];

    videos.forEach((v) => v.addEventListener("play", onPlay));

    return () => {
      videos.forEach((v) => v.removeEventListener("play", onPlay));
    };
  }, [items.length]);

  const mergeRefs = (el: HTMLDivElement | null) => {
    rootRef.current = el;
    emblaRef(el);
  };

  return (
    <div className={className}>
      <div className="embla" ref={mergeRefs}>
        <div className="embla__container">
          {items.map((item, idx) => {
            const keyStr =
              item.type === "image"
                ? item.src
                : item.embedUrl || item.videoUrl || item.src || String(idx);

            return (
              <div key={keyStr} className="embla__slide">
                {item.type === "image" ? (
                  <Image
                    src={item.src}
                    alt={item.alt || ""}
                    width={1600}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                ) : item.embedUrl ? (
                  <iframe
                    src={item.embedUrl}
                    title={item.alt || "Video"}
                    className="h-full w-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={item.videoUrl ?? item.src}
                    controls
                    poster={item.poster?.src}
                    className="h-auto w-full"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {items.length > 1 && showControls ? (
        <div className="carousel-controls mt-4">
          <div className="controls-inner flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                className="pointer-events-auto rounded bg-white px-3 py-2"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="pointer-events-auto rounded bg-white px-3 py-2"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>

            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-2 w-2 rounded-full pointer-events-auto ${
                    i === selectedIndex ? "bg-black" : "bg-white/60"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="pointer-events-auto rounded bg-white px-3 py-2"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
