import { cn } from "@/utils";

export const TilePricingList = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ul>{children}</ul>;
};

export const TilePricingInstructions = () => {
  return (
    <TilePricingItem>
      <TilePricingLabel className="text-muted-foreground underline">
        כשבבעלותך
      </TilePricingLabel>
      <TilePricingValue className="text-muted-foreground underline">
        קבל
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
      className={cn(
        "flex items-center justify-between rounded-sm p-1",
        className
      )}
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
