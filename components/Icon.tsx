import { FC } from "react";
import * as Icons from "lucide-react";
import { TIconProps } from "@/lib/types";

const Icon: FC<TIconProps> = ({ name, size = 24, color = "currentColor", className }) => {
  const LucideIcon = Icons[name] as FC<{ size?: number; color?: string; className: string }>;

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon size={size} color={color} className={className} />;
};

export default Icon;