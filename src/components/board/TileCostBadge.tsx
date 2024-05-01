import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

const TileCostBadge = ({ cost }: { cost: number }) => {
  return (
    <motion.div
      className="badgeWrapper flex items-center justify-center"
      layout
    >
      <Badge variant="secondary" className="badge self-center">
        ₪{cost}
      </Badge>
    </motion.div>
  );
};

export default TileCostBadge;
