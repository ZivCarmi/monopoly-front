type BoardTileProps = {
  children: React.ReactNode;
};

const BoardTile: React.FC<BoardTileProps> = ({ children }) => {
  return <li className="relative">{children}</li>;
};

export default BoardTile;
