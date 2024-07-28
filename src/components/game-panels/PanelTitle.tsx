import { cn } from "@/utils";

interface PanelTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const PanelTitle = ({ className, ...props }: PanelTitleProps) => {
  return (
    <h2
      className={cn(
        "text-center text-pretty text-muted-foreground p-4",
        className
      )}
      {...props}
    />
  );
};

export default PanelTitle;
