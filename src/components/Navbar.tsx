"use client";

import React from "react";
import { useTemplate } from "@/context/TemplateContext";
import { NavbarClassic } from "./NavbarClassic";
import { NavbarModern } from "./NavbarModern";

interface NavbarProps {
  onOpenAiChat?: () => void;
  onOpenHistory?: () => void;
  onOpenVisionSearch?: () => void;
  template?: "classic" | "modern";
}

export const Navbar: React.FC<NavbarProps> = ({ template, ...rest }) => {
  const { template: currentTemplate } = useTemplate();
  const activeTemplate = template || currentTemplate;

  if (activeTemplate === "modern") {
    return <NavbarModern {...rest} />;
  }

  return <NavbarClassic {...rest} />;
};
