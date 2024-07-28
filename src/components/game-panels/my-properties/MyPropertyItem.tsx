import CardPopover, { CardPopoverProps } from "@/components/board/CardPopover";
import useWindowSize from "@/hooks/useWindowSize";

const MyPropertyItem = ({
  _content,
  popoverTrigger,
  ...props
}: CardPopoverProps) => {
  const width = useWindowSize();
  const isMobile = width <= 768;

  return (
    <li>
      <CardPopover
        _content={_content}
        popoverTrigger={{
          className: "gap-4 items-center px-4 py-2 text-sm",
          ...popoverTrigger,
        }}
        {...(isMobile
          ? { align: "start", side: "top" }
          : { side: "right", sideOffset: 24 })}
        {...props}
      />
    </li>
  );
};

export default MyPropertyItem;
