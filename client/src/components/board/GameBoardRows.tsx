import { rowClassname } from "@/types/Board";
import { isCorner } from "@backend/types/Board";
import BoardRow from "./BoardRow";
import BoardRowTile from "./BoardRowTile";
import CornerTile from "./CornerTile";
import { useGameBoard } from "./GameBoardProvider";
import MappedPlayers from "./MappedPlayers";
import NormalTile from "./NormalTile";

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
            ) : (
              <NormalTile
                tile={tile}
                tileIndex={tileIndex}
                rowClassName={rowClassname[rowIndex]}
              />
            )}
            <MappedPlayers tileIndex={tileIndex} />
          </BoardRowTile>
        );
      })}
    </BoardRow>
  ));
};

export default GameBoardRows;