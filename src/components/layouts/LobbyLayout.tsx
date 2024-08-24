import { Outlet } from "react-router-dom";
import Navigation from "../lobby/Navigation";

const LobbyLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col py-24 px-4 relative">
      <Navigation className="absolute top-8 right-8" />
      <h1 className="text-balance text-center text-4xl/normal tracking-tighter font-extrabold lg:text-7xl/normal text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 background-animate">
        Monopoly-io
      </h1>
      <Outlet />
    </div>
  );
};

export default LobbyLayout;
