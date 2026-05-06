"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryBlock as GalleryBlockType } from "@/lib/cms/types";

export default function GalleryBlock({ title, items = [] }: GalleryBlockType) {
	// track a simple selected image (not required) — keep hooks at top-level
	const [selected, setSelected] = useState<number | null>(null);

	return (
		<section className="mx-auto max-w-6xl px-6 py-20" id="gallery">
			{title ? <h2 className="mb-10 text-center text-4xl font-bold">{title}</h2> : null}

					<div className="gallery__items grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
						{items.map((item, idx) => (
							<div
								key={idx}
								className="gallery__item group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-lg shadow-lg"
								onClick={() => setSelected(idx)}
							>
								{item.type === "video" ? (
									<video
										src={item.src}
										poster={item.poster?.src}
										aria-label={item.alt || "Gallery video"}
										className={`gallery__img h-full w-full object-cover transition-transform duration-300 ${selected === idx ? "scale-105" : ""} group-hover:scale-110`}
										controls
										playsInline
										preload="metadata"
									/>
								) : (
									<Image
										src={item.src}
										alt={item.alt || ""}
										width={800}
										height={600}
										className={`gallery__img h-full w-full object-cover transition-transform duration-300 ${selected === idx ? "scale-105" : ""} group-hover:scale-110`}
									/>
								)}
								<div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/35" />
							</div>
						))}
					</div>
		</section>
	);
}
