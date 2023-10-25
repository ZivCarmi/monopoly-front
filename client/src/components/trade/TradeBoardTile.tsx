export interface TradeBoardTileProps
  extends React.ButtonHTMLAttributes<HTMLDivElement | HTMLButtonElement> {
  isOwnersProperty: boolean;
}

const TradeBoardTile: React.FC<TradeBoardTileProps> = ({
  isOwnersProperty,
  onClick,
  children,
  ...props
}) => {
  return isOwnersProperty ? (
    <button {...props} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div {...props}>{children}</div>
  );
};

export default TradeBoardTile;
