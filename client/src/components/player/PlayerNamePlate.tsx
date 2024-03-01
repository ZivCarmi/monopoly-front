import { cn } from "@/utils";

export interface PlayerNamePlateProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const PlayerNamePlate = ({
  children,
  className,
  ...props
}: PlayerNamePlateProps) => {
  return (
    <div {...props} className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  );
};
export default PlayerNamePlate;
