import { ResourceManagerClient } from "./ResourceManagerClient";

export const metadata = {
  title: "资源站管理后台 - 懂片AI",
  description: "管理第三方苹果CMS采集站及多源聚合配置",
};

export default function AdminResourcesPage() {
  return <ResourceManagerClient />;
}
