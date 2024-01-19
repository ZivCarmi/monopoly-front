import { cn } from "@/utils";

export interface TileContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TileContent: React.FC<TileContentProps> = (props) => {
  return (
    <div
      {...props}
      className={cn("tileBody w-full h-full flex", props.className)}
    />
  );
};

export default TileContent;
