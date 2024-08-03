import { useAppSelector } from "@/app/hooks";
import { isVacation } from "@ziv-carmi/monopoly-utils";
import { CornerTileProps } from "./CornerTile";
import Tile from "./Tile";

const VacationTile = (props: CornerTileProps) => {
  const { settings, addons } = useAppSelector((state) => state.game);

  return (
    <Tile {...props} className="items-center justify-center">
      {isVacation(props.tile) && settings.vacationCash && (
        <div className="text-sm text-muted-foreground text-center">
          סכום: ₪{addons.vacationCash.amount}
        </div>
      )}
    </Tile>
  );
};

export default VacationTile;
