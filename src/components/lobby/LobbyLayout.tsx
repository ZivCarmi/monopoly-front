import { Outlet } from "react-router-dom";

const LobbyLayout = () => {
  return (
    <div className="min-h-screen flex flex-col p-4">
      <h1 className="text-balance text-center text-4xl/normal font-extrabold tracking-tight lg:text-5xl/normal mt-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 background-animate">
        ברוכים הבאים למונופולי אונליין
      </h1>
      <Outlet />
    </div>
  );
};

export default LobbyLayout;
