import useLazySvgImport from "@/hooks/useLazySvgImport";
import { ComponentProps } from "react";

interface SvgProps extends ComponentProps<"svg"> {
  name: string;
}

const Svg = ({ name, ...props }: SvgProps) => {
  const { loading, error, Svg } = useLazySvgImport(name);

  if (error || loading || !Svg) {
    return null;
  }

  return <Svg {...props} />;
};

export default Svg;
