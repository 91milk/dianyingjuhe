"use client";

import React from "react";
import { MovieItem } from "../types";
import { useTemplate } from "@/context/TemplateContext";
import { HeroPanoramaClassic } from "./HeroPanoramaClassic";
import { HeroPanoramaModern } from "./HeroPanoramaModern";

interface HeroPanoramaProps {
  featuredMovies: MovieItem[];
  template?: "classic" | "modern";
}

export const HeroPanorama: React.FC<HeroPanoramaProps> = ({ featuredMovies, template }) => {
  const { template: currentTemplate } = useTemplate();
  const activeTemplate = template || currentTemplate;

  if (activeTemplate === "modern") {
    return <HeroPanoramaModern featuredMovies={featuredMovies} />;
  }

  return <HeroPanoramaClassic featuredMovies={featuredMovies} />;
};
