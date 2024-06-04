export interface TradeBoardTileProps
  extends React.ButtonHTMLAttributes<HTMLDivElement | HTMLButtonElement> {
  isOwned: boolean;
}

const TradeBoardTile = ({
  isOwned,
  onClick,
  children,
  ...props
}: TradeBoardTileProps) => {
  return isOwned ? (
    <button {...props} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div {...props}>{children}</div>
  );
};

export default TradeBoardTile;
