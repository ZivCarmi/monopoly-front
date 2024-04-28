import { Badge } from "../ui/badge";

type TileCostBadgeProps = {
  cost: number;
};

const TileCostBadge = ({ cost }: TileCostBadgeProps) => {
  return (
    <div className="badgeWrapper flex items-center justify-center">
      <Badge variant="secondary" className="badge self-center">
        ₪{cost}
      </Badge>
    </div>
  );
};

export default TileCostBadge;
