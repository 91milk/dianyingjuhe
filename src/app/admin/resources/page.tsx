import { ResourceManagerClient } from "./ResourceManagerClient";

export const metadata = {
  title: "线路与资源管理 - 流量君 AI",
  description: "管理第三方影视资源及全网播放线路调度",
};

export default function AdminResourcesPage() {
  return <ResourceManagerClient />;
}
