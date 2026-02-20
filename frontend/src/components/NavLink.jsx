import { NavLink as RouterNavLink } from "react-router-dom";

export default function NavLink({
  to,
  className = "",
  activeClassName = "",
  pendingClassName = "",
  ...props
}) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive, isPending }) =>
        `${className} ${isActive ? activeClassName : ""} ${
          isPending ? pendingClassName : ""
        }`
      }
      {...props}
    />
  );
}
