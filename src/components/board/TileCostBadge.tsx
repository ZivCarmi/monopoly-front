import { Badge } from "../ui/badge";

const TileCostBadge = ({ cost }: { cost: number }) => {
  return (
    <Badge className="self-center rounded-sm text-foreground bg-foreground/20 hover:bg-foreground/20">
      ₪{cost}
    </Badge>
  );
};

export default TileCostBadge;
