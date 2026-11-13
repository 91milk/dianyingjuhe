import type { Metadata } from "next";
import { playlistService } from "@/modules/movie/services/playlistService";
import { PlaylistsClient } from "./PlaylistsClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `精选专题片单 · 懂片更懂你 - ${siteConfig.name}`,
  description: "精选午夜放映室、诺兰时空迷宫、高智商反转神作与爆款微短剧专题片单，全网多源秒级极速起播。",
};

export default async function PlaylistsPage() {
  const playlists = await playlistService.getAllPlaylists();

  return <PlaylistsClient playlists={playlists} />;
}
