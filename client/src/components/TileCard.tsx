import { useAppSelector } from "@/app/hooks";
import { AIRPORT_RENTS, COMPANY_RENTS } from "@backend/constants";
import { Home, Hotel, Plane, Store } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TileTypes } from "@backend/types/Board";
import { useSocket } from "@/app/socket-context";
import TileCardActions from "./TileCardActions";

const TileInfo = () => {
  const { socket } = useSocket();
  const {
    players,
    map: { board },
  } = useAppSelector((state) => state.game);
  const { selectedTileIndex } = useAppSelector((state) => state.ui);
  const selectedTile = selectedTileIndex && board[selectedTileIndex];

  if (!socket || !selectedTile) return null;

  if (
    selectedTile.type !== TileTypes.PROPERTY &&
    selectedTile.type !== TileTypes.AIRPORT &&
    selectedTile.type !== TileTypes.COMPANY
  )
    return null;

  const selfPlayerIsOwner = socket.id === selectedTile.owner;
  const tileOwnerName = players.find(
    (player) => player.id !== socket.id && player.id === selectedTile.owner
  )?.name;

  return (
    <AnimatePresence>
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
              {selectedTile.rent.map((amount, i) => (
                <li className="flex items-center" key={amount}>
                  <div className="flex-1 text-right">
                    <div>${amount}&nbsp;=&nbsp;</div>
                    {i === 0 && <div>${amount * 2}&nbsp;=&nbsp;</div>}
                  </div>
                  <div className="flex-1 text-left">
                    {i === 0 && <div className="font-medium">דמי שכירות</div>}
                    {i === 0 && (
                      <div className="font-medium">דמ"ש (מונפול נכסים)</div>
                    )}
                    {i > 0 &&
                      i < 5 &&
                      Array.from({ length: i }, (_, idx) => (
                        <Home className="inline text-red-900" key={idx} />
                      ))}
                    {i === 5 && <Hotel className="inline text-red-900" />}
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
          {selfPlayerIsOwner ? (
            <TileCardActions
              tileIndex={selectedTileIndex}
              tile={selectedTile}
            />
          ) : (
            tileOwnerName && (
              <p>
                הנכס בבעלות <strong>{tileOwnerName}</strong>
              </p>
            )
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default TileInfo;
