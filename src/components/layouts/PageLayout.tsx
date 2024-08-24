import { Link, Outlet } from "react-router-dom";
import Navigation from "../lobby/Navigation";

const PageLayout = () => {
  return (
    <div className="max-w-5xl m-auto min-h-dvh flex flex-col p-8 relative">
      <div className="ltr flex items-center justify-between mb-8">
        <Link to="/" className="text-2xl font-bold tracking-tighter">
          Monopoly-io
        </Link>
        <Navigation />
      </div>
      <Outlet />
    </div>
  );
};

export default PageLayout;
