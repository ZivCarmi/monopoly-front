import { rowClassname } from "@/types/Board";
import { isCard, isCorner, isPurchasable } from "@backend/types/Board";
import BoardRow from "./BoardRow";
import { BoardRowTile } from "./BoardRowTile";
import CornerTile from "./CornerTile";
import { useGameBoard } from "./GameBoardProvider";
import GameCard from "./GameCard";
import MappedPlayers from "./MappedPlayers";
import PurchasableTile from "./PurchasableTile";
import Tile from "./Tile";

const GameBoardRows = () => {
  const gameBoard = useGameBoard();

  return gameBoard.map((row, rowIndex) => (
    <BoardRow key={rowIndex} area={row.area}>
      {row.tiles.map((tile, tileIndexInRow) => {
        const rowIndex = rowClassname.findIndex((rowCn) => rowCn === row.area);
        const tileIndex = 10 * rowIndex + tileIndexInRow;

        return (
          <BoardRowTile key={tileIndex} tile={tile}>
            {isCorner(tile) ? (
              <CornerTile tile={tile} />
            ) : isPurchasable(tile) ? (
              <PurchasableTile tile={tile} />
            ) : isCard(tile) ? (
              <Tile
                tile={tile}
                className="flex-col justify-between relative tileContent"
              >
                <GameCard
                  tileIndex={tileIndex}
                  rowClassName={rowClassname[rowIndex]}
                />
              </Tile>
            ) : (
              <Tile tile={tile} className="tileContent" />
            )}
            <MappedPlayers
              tileIndex={tileIndex}
              rowClassName={rowClassname[rowIndex]}
            />
          </BoardRowTile>
        );
      })}
    </BoardRow>
  ));
};

export default GameBoardRows;
