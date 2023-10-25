import { getPlayerColor } from "@/utils";

type OwnerIndicatorProps = {
  ownerId: string;
  children?: React.ReactNode;
};

const OwnerIndicator: React.FC<OwnerIndicatorProps> = ({
  ownerId,
  children,
}) => {
  if (!ownerId) return null;

  const ownerColor = getPlayerColor(ownerId);

  return (
    <div
      className="w-full flex-[0_0_30%] flex items-center justify-center"
      style={{
        backgroundColor: ownerColor,
      }}
    >
      {children}
    </div>
  );
};

export default OwnerIndicator;
