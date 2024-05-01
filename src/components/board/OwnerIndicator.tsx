import { cn, getPlayerColor } from "@/utils";

export interface OwnerIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  ownerId: string;
}

const OwnerIndicator = ({
  ownerId,
  className,
  ...props
}: OwnerIndicatorProps) => {
  if (!ownerId) return null;

  const ownerColor = getPlayerColor(ownerId);

  return (
    <div
      {...props}
      className={cn(
        "flex flex-[0_0_32%] items-center justify-center w-full h-full rounded-sm",
        className
      )}
      style={{ backgroundColor: ownerColor }}
    />
  );
};

export default OwnerIndicator;
