import { LucideIcon } from "lucide-react";

type CityBuildingProps = {
  icon: LucideIcon;
  count?: number;
};

const CityBuilding: React.FC<CityBuildingProps> = ({ count, icon }) => {
  const Icon = icon;
  const iconsCount = count || 1;

  return (
    <div className="inline-flex items-center gap-[2px] cityBuilding">
      {Array.from({ length: iconsCount }).map((_, idx) => (
        <Icon size={16} key={idx} />
      ))}
    </div>
  );
};

export default CityBuilding;
