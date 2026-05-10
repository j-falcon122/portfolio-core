import { notFound } from "next/navigation";
import { getCms } from "@/lib/cms";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export default async function HomeAliasPage() {
  const cms = getCms();
  const page = await cms.getPageBySlug("home");
  if (!page) return notFound();
  return <BlockRenderer blocks={page.blocks || []} />;
}