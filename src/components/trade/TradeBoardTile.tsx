export interface TradeBoardTileProps
  extends React.ButtonHTMLAttributes<HTMLDivElement | HTMLButtonElement> {
  isOwnersProperty: boolean;
}

const TradeBoardTile = ({
  isOwnersProperty,
  onClick,
  children,
  ...props
}: TradeBoardTileProps) => {
  return isOwnersProperty ? (
    <button {...props} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div {...props}>{children}</div>
  );
};

export default TradeBoardTile;
