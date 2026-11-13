import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { playlistService } from "@/modules/movie/services/playlistService";
import { PlaylistDetailClient } from "./PlaylistDetailClient";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const playlist = await playlistService.getPlaylistBySlug(id);
  if (!playlist) {
    return { title: `片单不存在 - ${siteConfig.name}` };
  }

  return {
    title: `${playlist.title} · 精选片单 - ${siteConfig.name}`,
    description: playlist.description,
  };
}

export default async function PlaylistDetailPage({ params }: PageProps) {
  const { id } = await params;
  const playlist = await playlistService.getPlaylistBySlug(id);

  if (!playlist) {
    notFound();
  }

  return <PlaylistDetailClient playlist={playlist} />;
}
