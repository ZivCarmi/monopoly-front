import { cn } from "@/utils";

export interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const TileHead: React.FC<DivProps> = (props) => {
  return <div {...props} className={cn("flex-[0_0_20%]", props.className)} />;
};
export default TileHead;
