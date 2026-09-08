"use client";

import {
  RocketIcon,
  ChartColumnIcon,
  GlobeIcon,
  SettingsIcon,
  LogOutIcon,
  SearchIcon,
  ExternalLinkIcon,
  UsersIcon,
  TrendingUpIcon,
  ZapIcon,
  RefreshCwIcon,
  FolderIcon,
  SunIcon,
  MoonIcon,
  ArrowLeftIcon,
  MonitorIcon,
  CheckIcon,
  CheckCheckIcon,
  ChevronRightIcon,
  DropletIcon,
  TriangleAlertIcon,
  ServerIcon,
} from "@animateicons/react/lucide";

export const ICONS = {
  Rocket: RocketIcon,
  ChartColumn: ChartColumnIcon,
  Globe: GlobeIcon,
  Settings: SettingsIcon,
  LogOut: LogOutIcon,
  Search: SearchIcon,
  ExternalLink: ExternalLinkIcon,
  Users: UsersIcon,
  TrendingUp: TrendingUpIcon,
  Zap: ZapIcon,
  RefreshCw: RefreshCwIcon,
  Folder: FolderIcon,
  Sun: SunIcon,
  Moon: MoonIcon,
  ArrowLeft: ArrowLeftIcon,
  Monitor: MonitorIcon,
  Check: CheckIcon,
  CheckCheck: CheckCheckIcon,
  ChevronRight: ChevronRightIcon,
  Droplet: DropletIcon,
  TriangleAlert: TriangleAlertIcon,
  Server: ServerIcon,
};

export function NavIcon({ name, size = 16, ...props }) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} {...props} />;
}
