import { cn, getPlayerColor } from "@/utils";

export interface OwnerIndicatorProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  ownerId: string;
  children?: React.ReactNode;
}

const OwnerIndicator: React.FC<OwnerIndicatorProps> = ({
  ownerId,
  ...props
}) => {
  if (!ownerId) return null;

  const ownerColor = getPlayerColor(ownerId);

  return (
    <div
      {...props}
      className={cn(
        "w-full flex-[0_0_30%] flex items-center justify-center",
        props.className
      )}
      style={{
        backgroundColor: ownerColor,
      }}
    />
  );
};

export default OwnerIndicator;
