"use client";

import {
  RocketIcon,
  ChartColumnIcon,
  GlobeIcon,
  SettingsIcon,
  InfoIcon,
  LogOutIcon,
  SearchIcon,
  MailIcon,
  BellIcon,
  PlusIcon,
  ArrowUpRightIcon,
  ExternalLinkIcon,
  UsersIcon,
  DownloadIcon,
  TrendingUpIcon,
  ZapIcon,
  RefreshCwIcon,
  FolderIcon,
  ClockIcon,
  LayoutGridIcon,
  SunIcon,
  MoonIcon,
  ArrowLeftIcon,
} from "@animateicons/react/lucide";

export const ICONS = {
  Rocket: RocketIcon,
  ChartColumn: ChartColumnIcon,
  Globe: GlobeIcon,
  Settings: SettingsIcon,
  Info: InfoIcon,
  LogOut: LogOutIcon,
  Search: SearchIcon,
  Mail: MailIcon,
  Bell: BellIcon,
  Plus: PlusIcon,
  ArrowUpRight: ArrowUpRightIcon,
  ExternalLink: ExternalLinkIcon,
  Users: UsersIcon,
  Download: DownloadIcon,
  TrendingUp: TrendingUpIcon,
  Zap: ZapIcon,
  RefreshCw: RefreshCwIcon,
  Folder: FolderIcon,
  Clock: ClockIcon,
  LayoutGrid: LayoutGridIcon,
  Sun: SunIcon,
  Moon: MoonIcon,
  ArrowLeft: ArrowLeftIcon,
};

export function NavIcon({ name, size = 16, ...props }) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} {...props} />;
}
