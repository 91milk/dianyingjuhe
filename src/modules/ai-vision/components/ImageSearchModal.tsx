"use client";

import React, { useState } from "react";
import { visionService } from "../services/visionService";
import { VisionSearchResult } from "../types";
import { X, UploadCloud, ImageIcon, Play, Sparkles } from "lucide-react";
import Link from "next/link";

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<VisionSearchResult[]>([]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setIsAnalyzing(true);
    setResults([]);

    try {
      const res = await visionService.searchByImage(file);
      setResults(res);
    } catch {
      // ignore
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResults([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#ffcf32] flex items-center justify-center text-black">
            <Sparkles className="w-4 h-4 fill-black" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">以图搜片 / 剧照识别</h3>
            <p className="text-xs text-zinc-400">上传电影名场面截图、剧照，AI 帮您找片名</p>
          </div>
        </div>

        {/* 上传区域 */}
        {!selectedImage ? (
          <label className="border-2 border-dashed border-zinc-700 hover:border-[#ffcf32] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-zinc-900/50 cursor-pointer transition">
            <UploadCloud className="w-10 h-10 text-zinc-400" />
            <div className="text-center">
              <span className="text-xs font-semibold text-zinc-200">点击上传或将图片拖拽至此处</span>
              <p className="text-[11px] text-zinc-500 mt-1">支持 JPG, PNG, WEBP 格式截图</p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden max-h-48 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <img src={selectedImage} alt="Uploaded scene" className="max-h-48 object-contain" />
              <button
                onClick={handleReset}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/90 text-white text-xs px-2 py-1 rounded-md cursor-pointer"
              >
                重选图片
              </button>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center justify-center gap-3 py-6 text-xs text-zinc-300">
                <span className="w-3 h-3 rounded-full bg-[#ffcf32] animate-ping" />
                正在通过多模态大模型分析画面构图与人物角色...
              </div>
            ) : (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#ffcf32]" />
                  AI 识图匹配结果:
                </h4>

                {results.map((res, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={res.movie.poster}
                        alt={res.movie.title}
                        className="w-12 h-16 rounded object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{res.movie.title}</span>
                          <span className="text-[10px] bg-amber-400/20 text-[#ffcf32] px-1.5 py-0.5 rounded font-bold">
                            匹配度 {res.similarity}%
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                          {res.matchedSceneDescription}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/watch/${res.movie.id}`}
                      onClick={onClose}
                      className="px-3 py-1.5 bg-[#ffcf32] text-black font-semibold text-xs rounded-lg flex items-center gap-1 hover:bg-[#ffe066] transition cursor-pointer shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      去观看
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
