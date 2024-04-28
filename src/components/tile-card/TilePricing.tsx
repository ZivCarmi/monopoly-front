export const TilePricingList = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ul className="space-y-1">{children}</ul>;
};

export const TilePricingItem = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <li className="flex items-center justify-between">{children}</li>;
};

export const TilePricingLabel = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="text-right">{children}</div>;
};

export const TilePricingValue = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <span>{children}</span>;
};
