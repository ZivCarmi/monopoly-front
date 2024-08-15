import LoginPopover from "./login/LoginPopover";

const Navigation = () => {
  return (
    <nav className="absolute top-8 right-8">
      <ul>
        <li>
          <LoginPopover />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
