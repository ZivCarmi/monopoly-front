import { cn } from "@/utils";

export interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const TileBody: React.FC<DivProps> = (props) => {
  return (
    <div {...props} className={cn("text-sm text-center", props.className)}>
      {props.children}
    </div>
  );
};

export default TileBody;
