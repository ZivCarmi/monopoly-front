import { cn } from "@/utils";

export const TilePricingList = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ul className="space-y-2">{children}</ul>;
};

export const TilePricingInstructions = () => {
  return (
    <TilePricingItem>
      <TilePricingLabel className="text-muted-foreground underline">
        כשברשותך
      </TilePricingLabel>
      <TilePricingValue className="text-muted-foreground underline">
        קבל/י
      </TilePricingValue>
    </TilePricingItem>
  );
};

interface TilePricingItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export const TilePricingItem = ({
  className,
  ...props
}: TilePricingItemProps) => {
  return (
    <li
      className={cn("flex items-center justify-between", className)}
      {...props}
    />
  );
};

interface TilePricingLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TilePricingLabel = ({
  className,
  ...props
}: TilePricingLabelProps) => {
  return <div className={cn("text-right", className)} {...props} />;
};

interface TilePricingValueProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const TilePricingValue = ({
  className,
  ...props
}: TilePricingValueProps) => {
  return <div className={cn("text-left", className)} {...props} />;
};
