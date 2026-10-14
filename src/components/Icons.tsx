import React from "react";
import {
  Home,
  Search,
  Compass,
  Flame,
  Film,
  List,
  Calendar,
  Bookmark,
  History,
  Users,
  Bell,
  Crown,
  Star,
  Play,
  Plus,
  Share2,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Heart,
  ExternalLink,
  Globe,
  Settings,
  Volume2,
  VolumeX,
  Sliders,
  Music,
  X,
  Check,
  Info,
  Loader2,
  Tv,
  Zap,
  Shield,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  spin?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  home: Home,
  search: Search,
  explore: Compass,
  airing: Tv,
  popular: Flame,
  movie: Film,
  genre: List,
  schedule: Calendar,
  watchlist: Bookmark,
  history: History,
  community: Users,
  bell: Bell,
  crown: Crown,
  star: Star,
  play: Play,
  plus: Plus,
  bookmark: Bookmark,
  share: Share2,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  arrowLeft: ArrowLeft,
  heart: Heart,
  externalLink: ExternalLink,
  globe: Globe,
  settings: Settings,
  volume: Volume2,
  mute: VolumeX,
  sliders: Sliders,
  music: Music,
  x: X,
  check: Check,
  info: Info,
  loader: Loader2,
  tv: Tv,
  zap: Zap,
  shield: Shield,
  maximize: Maximize2,
  minimize: Minimize2,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 16,
  color = "currentColor",
  spin = false,
}) => {
  const LucideIcon = iconMap[name] || Info;
  
  const spinStyle: React.CSSProperties = spin
    ? { animation: "spin 1s linear infinite" }
    : {};

  return (
    <LucideIcon
      size={size}
      color={color}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        ...spinStyle,
      }}
    />
  );
};
export default Icon;
