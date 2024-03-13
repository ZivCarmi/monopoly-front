import { cn } from "@/utils";
import { Characters } from "@ziv-carmi/monopoly-utils";

export interface PlayerCharacterProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  character: Characters;
  size?: number | "auto";
}

const PlayerCharacter = ({
  character,
  className,
  size = 32,
  ...props
}: PlayerCharacterProps) => {
  return (
    <img
      src={`/${character}.png`}
      width={size}
      className={cn("inline-block", className)}
      {...props}
    />
  );
};

export default PlayerCharacter;
