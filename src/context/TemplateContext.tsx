"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type SiteTemplate = "classic" | "modern";

export interface TemplateDefinition {
  id: SiteTemplate;
  name: string;
  enName: string;
  tagline: string;
  themeColor: string;
  accentClass: string;
  badge: string;
}

export const TEMPLATES: Record<SiteTemplate, TemplateDefinition> = {
  classic: {
    id: "classic",
    name: "经典暖金",
    enName: "Classic Amber",
    tagline: "灵动流光 · 经典圆角 · 极速直链",
    themeColor: "#ffcf32",
    accentClass: "text-[#ffcf32] bg-[#ffcf32]",
    badge: "经典版",
  },
  modern: {
    id: "modern",
    name: "先锋红影",
    enName: "Modern Crimson",
    tagline: "极致先锋 · 典藏排版 · 双模选片",
    themeColor: "#ef4b43",
    accentClass: "text-[#ef4b43] bg-[#ef4b43]",
    badge: "新版",
  },
};

export const TEMPLATE_COOKIE_NAME = "dianying_template";
export const TEMPLATE_STORAGE_KEY = "dianying_template";

interface TemplateContextType {
  template: SiteTemplate;
  setTemplate: (t: SiteTemplate) => void;
  toggleTemplate: () => void;
  isClassic: boolean;
  isModern: boolean;
  activeConfig: TemplateDefinition;
}

const TemplateContext = createContext<TemplateContextType>({
  template: "classic",
  setTemplate: () => {},
  toggleTemplate: () => {},
  isClassic: true,
  isModern: false,
  activeConfig: TEMPLATES.classic,
});

export const TemplateProvider: React.FC<{
  initialTemplate?: SiteTemplate;
  children: React.ReactNode;
}> = ({ initialTemplate = "classic", children }) => {
  const [template, setTemplateState] = useState<SiteTemplate>(initialTemplate);

  const applyTemplate = useCallback((nextTemplate: SiteTemplate) => {
    setTemplateState(nextTemplate);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(TEMPLATE_STORAGE_KEY, nextTemplate);
        document.cookie = `${TEMPLATE_COOKIE_NAME}=${nextTemplate}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.setAttribute("data-template", nextTemplate);
      } catch (err) {
        console.warn("Failed to persist template selection:", err);
      }
    }
  }, []);

  useEffect(() => {
    // 1. 优先读取 URL Query 参数（方便分享/预览：?template=classic 或 ?template=modern）
    const searchParams = new URLSearchParams(window.location.search);
    const queryTemplate = searchParams.get("template") as SiteTemplate | null;
    if (queryTemplate === "classic" || queryTemplate === "modern") {
      applyTemplate(queryTemplate);
      return;
    }

    // 2. 检查 localStorage
    const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY) as SiteTemplate | null;
    if (saved === "classic" || saved === "modern") {
      if (saved !== template) {
        applyTemplate(saved);
      } else {
        document.documentElement.setAttribute("data-template", saved);
      }
    } else {
      document.documentElement.setAttribute("data-template", template);
    }
  }, [applyTemplate, template]);

  const setTemplate = (nextTemplate: SiteTemplate) => {
    applyTemplate(nextTemplate);
  };

  const toggleTemplate = () => {
    applyTemplate(template === "classic" ? "modern" : "classic");
  };

  const value: TemplateContextType = {
    template,
    setTemplate,
    toggleTemplate,
    isClassic: template === "classic",
    isModern: template === "modern",
    activeConfig: TEMPLATES[template] || TEMPLATES.classic,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};

export function useTemplate(): TemplateContextType {
  const context = useContext(TemplateContext);
  return context;
}
