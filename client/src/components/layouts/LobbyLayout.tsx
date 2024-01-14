import { Outlet } from "react-router-dom";

const LobbyLayout = () => {
  return (
    <div className="min-h-screen flex items-center flex-col">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mt-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 background-animate">
        Welcome to Monopolyz
      </h1>
      <div className="my-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default LobbyLayout;
