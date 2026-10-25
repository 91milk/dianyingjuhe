"use client";

import React from "react";
import { useTemplate } from "@/context/TemplateContext";
import { HomeClassic, HomePageData } from "./HomeClassic";
import { HomeModern } from "./HomeModern";

export const HomeContainer: React.FC<HomePageData> = (props) => {
  const { isModern } = useTemplate();

  if (isModern) {
    return <HomeModern {...props} />;
  }

  return <HomeClassic {...props} />;
};
