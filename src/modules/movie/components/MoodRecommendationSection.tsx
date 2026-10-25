"use client";

import React from "react";
import { MovieItem } from "../types";
import { MoodType } from "../types/mood";
import { useTemplate } from "@/context/TemplateContext";
import { MoodRecommendationClassic } from "./MoodRecommendationClassic";
import { MoodRecommendationModern } from "./MoodRecommendationModern";

interface MoodRecommendationSectionProps {
  moodCollections: Record<MoodType, MovieItem[]>;
  template?: "classic" | "modern";
}

export const MoodRecommendationSection: React.FC<MoodRecommendationSectionProps> = ({
  moodCollections,
  template,
}) => {
  const { template: currentTemplate } = useTemplate();
  const activeTemplate = template || currentTemplate;

  if (activeTemplate === "modern") {
    return <MoodRecommendationModern moodCollections={moodCollections} />;
  }

  return <MoodRecommendationClassic moodCollections={moodCollections} />;
};
