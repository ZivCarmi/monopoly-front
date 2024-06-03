import { cn } from "@/utils";

interface TileNameProps extends React.HTMLAttributes<HTMLDivElement> {}

const TileName = ({ children, className, ...props }: TileNameProps) => {
  return (
    <div
      className={cn(
        "text-sm text-center rtl font-bold leading-[14px] tracking-tight tileName",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default TileName;
