import LoginPopover from "./login/LoginPopover";

interface NavigationProps extends React.HTMLAttributes<HTMLElement> {}

const Navigation = ({ ...props }: NavigationProps) => {
  return (
    <nav {...props}>
      <ul>
        <li>
          <LoginPopover />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
