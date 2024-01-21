type CenterProps = {
  children?: React.ReactNode;
};

const BoardCenter: React.FC<CenterProps> = ({ children }) => {
  return (
    <div className="col-start-2 col-end-11 row-start-2 row-end-[11] border border-neutral-600 p-8 rtl grid">
      {children}
    </div>
  );
};

export default BoardCenter;
