import { cn } from "@/utils";
import styles from "./loader.module.css";
import { HTMLAttributes } from "react";

interface LoaderProps extends HTMLAttributes<HTMLSpanElement> {}

const Loader = ({ className, ...props }: LoaderProps) => {
  return <div className={cn(styles.loader, className)} {...props} />;
};

export default Loader;
