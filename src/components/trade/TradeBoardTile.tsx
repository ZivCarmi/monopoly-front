export interface TradeBoardTileProps
  extends React.ButtonHTMLAttributes<HTMLDivElement | HTMLButtonElement> {
  clickable: boolean;
}

const TradeBoardTile = ({
  clickable,
  onClick,
  children,
  ...props
}: TradeBoardTileProps) => {
  return clickable ? (
    <button {...props} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div {...props}>{children}</div>
  );
};

export default TradeBoardTile;
