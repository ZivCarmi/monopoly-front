import { ToggleTheme } from "@/components/theme/ThemeToggle";
import { Link } from "react-router-dom";

const InfoPanel = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-5xl font-bold cursor-pointer">
        <Link to="/">מונופולי</Link>
      </h1>
      <ToggleTheme />
    </div>
  );
};

export default InfoPanel;
