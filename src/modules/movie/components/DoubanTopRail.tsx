"use client";

import React from "react";
import { MovieItem } from "../types";
import { useTemplate } from "@/context/TemplateContext";
import { DoubanTopRailClassic } from "./DoubanTopRailClassic";
import { DoubanTopRailModern } from "./DoubanTopRailModern";

interface DoubanTopRailProps {
  movies: MovieItem[];
  template?: "classic" | "modern";
}

export const DoubanTopRail: React.FC<DoubanTopRailProps> = ({ movies, template }) => {
  const { template: currentTemplate } = useTemplate();
  const activeTemplate = template || currentTemplate;

  if (activeTemplate === "modern") {
    return <DoubanTopRailModern movies={movies} />;
  }

  return <DoubanTopRailClassic movies={movies} />;
};
