import { LucideIcon } from "lucide-react";

const Icon = ({ icon }: { icon: LucideIcon }) => {
  const Comp = icon;

  return <Comp className="w-4 h-4 me-2" />;
};

export default Icon;
