import { cn } from "@/utils";
import { LucideIcon, LucideProps } from "lucide-react";

interface IconProps extends LucideProps {
  icon: LucideIcon;
}

const Icon = ({ icon, className, ...props }: IconProps) => {
  const Comp = icon;

  return <Comp className={cn("w-4 h-4 me-2", className)} {...props} />;
};

export default Icon;
