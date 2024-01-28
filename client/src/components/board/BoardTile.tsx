type BoardTileProps = {
  children: React.ReactNode;
};

const BoardTile = ({ ...props }: BoardTileProps) => {
  return <li className="relative">{props.children}</li>;
};

export default BoardTile;
