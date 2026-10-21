"use client";

import React, { useState, useEffect } from "react";
import { ResourceSite } from "@/modules/collector/types";
import {
  Server,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

export const ResourceManagerClient: React.FC = () => {
  const [sites, setSites] = useState<ResourceSite[]>([]);
  const [stats, setStats] = useState({ total: 0, enabledCount: 0, totalItemsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);

  // 添加弹窗
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [newSitePlayFrom, setNewSitePlayFrom] = useState("m3u8");
  const [newSiteWeight, setNewSiteWeight] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 搜索测试工具
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTesting, setSearchTesting] = useState(false);
  const [searchResults, setSearchResults] = useState<{ title: string; sourcesCount: number; category: string }[]>([]);

  const fetchSites = async () => {
    try {
      const res = await fetch("/api/admin/resources");
      const json = await res.json();
      if (json.success) {
        setSites(json.data.sites);
        setStats(json.data.stats);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  // 切换启用开关
  const handleToggleEnable = async (site: ResourceSite) => {
    try {
      const res = await fetch("/api/admin/resources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: site.id, isEnabled: !site.isEnabled }),
      });
      if (res.ok) {
        fetchSites();
      }
    } catch {
      // ignore
    }
  };

  // 单独测速
  const handleTestSite = async (site: ResourceSite) => {
    setTestingId(site.id);
    try {
      await fetch("/api/admin/resources/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: site.id }),
      });
      await fetchSites();
    } catch {
      // ignore
    } finally {
      setTestingId(null);
    }
  };

  // 一键测速所有源站
  const handleTestAll = async () => {
    setLoading(true);
    for (const site of sites) {
      await handleTestSite(site);
    }
    setLoading(false);
  };
  // 一键同步增量数据
  const [syncing, setSyncing] = useState(false);
  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/resources/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "maotai", hours: 24 }),
      });
      const data = await res.json();
      alert(data.message || "同步完成");
      fetchSites();
    } catch {
      alert("同步请求失败");
    } finally {
      setSyncing(false);
    }
  };

  // 删除站点
  const handleDeleteSite = async (site: ResourceSite) => {
    if (!confirm(`确定要移除资源站【${site.name}】吗？`)) return;
    try {
      const res = await fetch(`/api/admin/resources?id=${site.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchSites();
      }
    } catch {
      // ignore
    }
  };

  // 提交新站点
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName || !newSiteUrl) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSiteName,
          apiUrl: newSiteUrl,
          playFrom: newSitePlayFrom,
          weight: newSiteWeight,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewSiteName("");
        setNewSiteUrl("");
        fetchSites();
      } else {
        alert(data.error || "添加失败");
      }
    } catch (e: unknown) {
      alert("添加请求失败: " + String(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 测试聚合搜索
  const handleTestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchTesting(true);
    try {
      const res = await fetch(`/api/movies?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSearchResults(
          data.data.slice(0, 10).map((m: { title: string; sources: unknown[]; category: string }) => ({
            title: m.title,
            sourcesCount: m.sources.length,
            category: m.category,
          }))
        );
      }
    } catch {
      // ignore
    } finally {
      setSearchTesting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* 头部标题与快捷按钮 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffcf32] flex items-center justify-center text-black font-bold">
              <Server className="w-4 h-4 fill-black" />
            </div>
            <h1 className="text-2xl font-black text-white">影视采集资源站管理</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            已实现标准 MacCMS (苹果CMS) V10 JSON 采集源多站并发聚合与自动测速
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-[#ffcf32] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            title="拉取最近24小时最新入库资源到本地索引库"
          >
            <Zap className={`w-3.5 h-3.5 ${syncing ? "animate-bounce" : ""}`} />
            {syncing ? "增量同步中..." : "同步当日更新 (h=24)"}
          </button>
          <button
            onClick={handleTestAll}
            disabled={loading}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            一键测速所有源
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#ffcf32] hover:bg-[#ffe066] text-black text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            添加资源站
          </button>
        </div>
      </div>

      {/* 核心指标统计卡片 (KPI) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#ffcf32]" /> 接入资源站
          </span>
          <div className="mt-2 text-2xl font-black text-white">{stats.total} 个</div>
          <span className="text-[10px] text-zinc-500 mt-1">支持无限添加第三方站</span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 当前在线源
          </span>
          <div className="mt-2 text-2xl font-black text-emerald-400">{stats.enabledCount} 个</div>
          <span className="text-[10px] text-zinc-500 mt-1">参与实时聚合搜索</span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 全网聚合片源
          </span>
          <div className="mt-2 text-2xl font-black text-[#ffcf32]">
            {stats.totalItemsCount.toLocaleString()} +
          </div>
          <span className="text-[10px] text-zinc-500 mt-1">包含电影/剧集/短剧/动漫</span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-sky-400" /> 聚合响应模式
          </span>
          <div className="mt-2 text-2xl font-black text-sky-400">并发聚合</div>
          <span className="text-[10px] text-zinc-500 mt-1">自动去重 & 多线路合并</span>
        </div>
      </div>

      {/* 资源站列表表格 */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Server className="w-4 h-4 text-[#ffcf32]" />
            已配置资源站列表
          </h2>
          <span className="text-xs text-zinc-500">优先级随权重由高到低聚合</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800/80">
              <tr>
                <th className="py-3 px-4 font-medium">名称 / ID</th>
                <th className="py-3 px-4 font-medium">API 采集地址</th>
                <th className="py-3 px-4 font-medium">运行状态</th>
                <th className="py-3 px-4 font-medium">接口延迟</th>
                <th className="py-3 px-4 font-medium">片库总数</th>
                <th className="py-3 px-4 font-medium">聚合权重</th>
                <th className="py-3 px-4 font-medium">启用</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sites.map((site) => {
                const isTesting = testingId === site.id;
                const isOnline = site.status === "online";

                return (
                  <tr key={site.id} className="hover:bg-zinc-800/30 transition">
                    {/* 名称 */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{site.name}</div>
                      <div className="text-[10px] text-zinc-500">{site.id}</div>
                    </td>

                    {/* API 地址 */}
                    <td className="py-3 px-4 max-w-xs truncate text-zinc-400 font-mono text-[11px]" title={site.apiUrl}>
                      {site.apiUrl}
                    </td>

                    {/* 状态 */}
                    <td className="py-3 px-4">
                      {isOnline ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> 在线
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                          <XCircle className="w-3 h-3" /> 离线/异常
                        </span>
                      )}
                    </td>

                    {/* 延迟 */}
                    <td className="py-3 px-4">
                      {site.responseTime !== undefined ? (
                        <span
                          className={`font-mono font-semibold ${
                            site.responseTime < 500
                              ? "text-emerald-400"
                              : site.responseTime < 1000
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        >
                          {site.responseTime} ms
                        </span>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </td>

                    {/* 片库数 */}
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      {site.totalItems ? site.totalItems.toLocaleString() : "-"}
                    </td>

                    {/* 权重 */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[#ffcf32] font-bold font-mono">
                        {site.weight}
                      </span>
                    </td>

                    {/* 启用开关 */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleEnable(site)}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                          site.isEnabled ? "bg-[#ffcf32]" : "bg-zinc-700"
                        }`}
                      >
                        <div
                          className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            site.isEnabled ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* 操作 */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTestSite(site)}
                          disabled={isTesting}
                          className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] flex items-center gap-1 cursor-pointer"
                          title="测试响应速度"
                        >
                          <RefreshCw className={`w-3 h-3 ${isTesting ? "animate-spin" : ""}`} />
                          测速
                        </button>
                        <button
                          onClick={() => handleDeleteSite(site)}
                          className="p-1 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-800 transition cursor-pointer"
                          title="移除资源站"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 跨源实时聚合搜索调试器 */}
      <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#ffcf32]" />
          <h2 className="text-sm font-bold text-white">全网资源站聚合检索调试工具</h2>
        </div>
        <p className="text-xs text-zinc-400">
          测试任意关键词（如“繁花”、“庆余年”、“逆袭”），验证多个资源站并发抓取与多线路自动合并效果：
        </p>

        <form onSubmit={handleTestSearch} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="输入影片名测试检索..."
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#ffcf32]"
          />
          <button
            type="submit"
            disabled={searchTesting || !searchQuery.trim()}
            className="px-4 py-2 bg-[#ffcf32] text-black font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer"
          >
            {searchTesting ? "聚合检索中..." : "测试搜索"}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
            {searchResults.map((res, i) => (
              <div key={i} className="bg-zinc-950/80 border border-zinc-800 p-2.5 rounded-xl text-xs flex justify-between items-center">
                <span className="font-semibold text-white truncate mr-2">{res.title}</span>
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-[#ffcf32] font-mono shrink-0">
                  {res.sourcesCount} 条播放线路
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 添加资源站弹窗 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">添加新影视资源采集站</h3>
            <p className="text-xs text-zinc-400 mb-4">
              支持任何兼容苹果CMS (MacCMS V10) JSON 接口规范的第三方资源站
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">资源站名称</label>
                <input
                  type="text"
                  required
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  placeholder="例如：红牛资源站、量子资源"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-[#ffcf32]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">API 接口地址</label>
                <input
                  type="url"
                  required
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  placeholder="例如：https://caiji.xxx.com/api.php/provide/vod/from/xxx/at/json/"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-[#ffcf32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">播放前缀代码 (可选)</label>
                  <input
                    type="text"
                    value={newSitePlayFrom}
                    onChange={(e) => setNewSitePlayFrom(e.target.value)}
                    placeholder="如 mtm3u8 / hnzy"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-[#ffcf32]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">排序权重 (1~100)</label>
                  <input
                    type="number"
                    value={newSiteWeight}
                    onChange={(e) => setNewSiteWeight(parseInt(e.target.value, 10))}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-[#ffcf32]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#ffcf32] text-black font-bold rounded-xl hover:bg-[#ffe066] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "正在测试连通性并接入..." : "确认添加并上线"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
