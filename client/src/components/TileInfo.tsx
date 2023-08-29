import { useAppSelector } from "@/app/hooks";
import { isProperty } from "@/helpers/tiles";
import { AIRPORT_RENTS, COMPANY_RENTS } from "@backend/constants";
import { Home, Hotel, Plane, Store } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TileTypes } from "@backend/types/Board";

const TileInfo = () => {
  const selectedTile = useAppSelector((state) => state.ui.selectedTilePos);
  const showCard = selectedTile && isProperty(selectedTile);
  const players = useAppSelector((state) => state.game.players);
  let tileOwner: string | undefined = "";

  if (!selectedTile) {
    return null;
  }

  if (
    selectedTile.type !== TileTypes.PROPERTY &&
    selectedTile.type !== TileTypes.AIRPORT &&
    selectedTile.type !== TileTypes.COMPANY
  ) {
    return null;
  }

  if (selectedTile.owner) {
    tileOwner = players.find(
      (player) => player.id === selectedTile.owner
    )?.name;
  }

  return (
    <AnimatePresence>
      {showCard && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.1,
          }}
          exit={{ y: 10, opacity: 0 }}
          className="mt-auto border outline outline-2 outline-red-600 rounded-sm"
        >
          <div className="flex flex-col text-center [&>*]:p-2 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-red-600 min-h-[25rem]">
            <h2 className="text-lg font-medium">{selectedTile.name}</h2>
            {selectedTile.type === TileTypes.PROPERTY && (
              <ul className="space-y-1 grow">
                {selectedTile.rent!.map((amount, i) => (
                  <li className="flex items-center" key={amount}>
                    <span className="flex-1 text-right">
                      ${amount}&nbsp;=&nbsp;
                    </span>
                    <div className="flex-1 text-left">
                      {i === 0 && (
                        <span className="font-medium">דמי שכירות</span>
                      )}
                      {i === 1 && (
                        <span className="font-medium">דמ"ש (מונפול נכסים)</span>
                      )}
                      {i >= 2 &&
                        i <= 5 &&
                        Array.from({ length: i - 1 }, (_, idx) => (
                          <Home className="inline text-red-900" key={idx} />
                        ))}
                      {i === 6 && <Hotel className="inline text-red-900" />}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {selectedTile.type === TileTypes.AIRPORT && (
              <ul className="space-y-1 grow">
                {AIRPORT_RENTS.map((price, i) => (
                  <li className="flex items-center" key={price}>
                    <span className="flex-1 text-right">
                      ${price}&nbsp;=&nbsp;
                    </span>
                    <div className="flex-1 text-left">
                      {Array.from({ length: i + 1 }, (_, idx) => (
                        <Plane className="inline text-red-900" key={idx} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {selectedTile.type === TileTypes.COMPANY && (
              <ul className="space-y-1 grow">
                {COMPANY_RENTS.map((price, i) => (
                  <li className="flex items-center" key={price}>
                    <span className="flex-1 text-right">
                      %{price}&nbsp;=&nbsp;
                    </span>
                    <div className="flex-1 text-left">
                      {Array.from({ length: i + 1 }, (_, idx) => (
                        <Store className="inline text-red-900" key={idx} />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {tileOwner && <div>הנכס בבעלות {tileOwner}</div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default TileInfo;
