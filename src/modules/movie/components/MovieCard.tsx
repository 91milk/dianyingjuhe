"use client";

import React from "react";
import { MovieItem } from "../types";
import { useTemplate } from "@/context/TemplateContext";
import { MovieCardClassic } from "./MovieCardClassic";
import { MovieCardModern } from "./MovieCardModern";

export interface MovieCardProps {
  movie: MovieItem;
  rank?: number;
  highlightText?: string;
  className?: string;
  template?: "classic" | "modern";
}

export const MovieCard: React.FC<MovieCardProps> = (props) => {
  const { template: currentTemplate } = useTemplate();
  const activeTemplate = props.template || currentTemplate;

  if (activeTemplate === "modern") {
    return <MovieCardModern {...props} />;
  }

  return <MovieCardClassic {...props} />;
};
