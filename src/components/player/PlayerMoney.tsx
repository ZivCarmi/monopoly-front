type PlayerMoneyProps = {
  money: number;
};

const PlayerMoney = ({ money }: PlayerMoneyProps) => {
  return (
    <p className="inline-flex rtl:flex-row-reverse text-sm">
      ₪<span className="ltr">{money}</span>
    </p>
  );
};

export default PlayerMoney;
