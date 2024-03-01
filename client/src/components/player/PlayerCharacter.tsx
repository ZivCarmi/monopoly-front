import { cn } from "@/utils";
import { Characters } from "@backend/types/Player";

export interface PlayerCharacterProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  character: Characters;
}

const PlayerCharacter = ({
  character,
  className,
  ...props
}: PlayerCharacterProps) => {
  return (
    <img
      src={`/${character}.png`}
      width={32}
      className={cn("inline-block", className)}
      {...props}
    />
  );
};

export default PlayerCharacter;
