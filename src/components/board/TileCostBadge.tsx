import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

const TileCostBadge = ({ cost }: { cost: number }) => {
  return (
    <motion.div
      className="badgeWrapper flex items-center justify-center"
      layout
    >
      <Badge
        className={`badge self-center rounded-sm bg-foreground/20 text-foreground hover:bg-foreground/20`}
      >
        ₪{cost}
      </Badge>
    </motion.div>
  );
};

export default TileCostBadge;
